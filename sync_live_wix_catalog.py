"""
GB Publishing — Live Wix Stores Catalog Sync Engine
Directly fetches live catalog products and collections from the production Wix site
(gbp-publishing-org, Site ID: 34002663-ff5b-495e-be4c-53ad0dc3184f)
Normalizes titles, pricing, variants, and 5 core imprints, then updates catalog.json.
"""

import urllib.request
import json
import re
import html
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def load_credentials():
    # 1. Environment variable
    api_key = os.environ.get('VITE_WIX_API_KEY') or os.environ.get('WIX_API_KEY')
    site_id = os.environ.get('VITE_WIX_SITE_ID') or os.environ.get('WIX_SITE_ID', '34002663-ff5b-495e-be4c-53ad0dc3184f')
    
    # 2. Local .env file
    if not api_key:
        env_file = os.path.join(os.path.dirname(__file__), '.env')
        if os.path.exists(env_file):
            with open(env_file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith('VITE_WIX_API_KEY='):
                        api_key = line.split('=', 1)[1].strip()
                    elif line.startswith('VITE_WIX_SITE_ID='):
                        site_id = line.split('=', 1)[1].strip()
                        
    # 3. Local machine credentials vault
    if not api_key:
        master_key_file = os.path.expanduser(r'C:\Users\TotalBiz\.wix\auth\master_api_key.json')
        if os.path.exists(master_key_file):
            try:
                with open(master_key_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    api_key = data.get('apiKey')
                    site_id = data.get('productionSiteId', site_id)
            except Exception:
                pass
                
    if not api_key:
        raise ValueError("Missing Wix Master API Key. Please set VITE_WIX_API_KEY in .env or environment.")
        
    return api_key, site_id

WIX_API_KEY, WIX_SITE_ID = load_credentials()

headers = {
    'Authorization': WIX_API_KEY,
    'wix-site-id': WIX_SITE_ID,
    'Content-Type': 'application/json'
}

COLLECTION_IMPRINT_MAP = [
    (['cook', 'food', 'drink', 'ginologist', 'ozlem', 'gin', 'turkish', 'zodiac cooks', 'penny - tzc'], "Food & Drink"),
    (['picture book', 'children', 'lois', 'latham', 'boughton -alice', 'boughton - alice', 'solonair', 'islam - doogie', 'trivedy', 'pink biscuit', 'morgan - swsw', 'morgan - a2 prints', 'morgan - a3 prints', 'lois art prints', "children's a", 'tillier'], "Children's & Picture Books"),
    (['poetry', 'pargeter', 'politics & poetry', 'wendy kimberley', 'boughton - art', 'fine art'], "Poetry & Fine Art"),
    (['biography', 'memoir', 'non-fiction', 'sauvage', 'animals & nature', 'nature', 'akeroyd', 'plants', 'murray - n&j', 'seafaring', 'boughton - sf'], "Non-Fiction & Memoir"),
    (['fiction', 'sci-fi', 'science fiction', 'fantasy', 'young adult', 'fitzgerald', 'pearson', 'kimberley - antecedent', 'boughton - bgbs', 'boughton - outtack', 'walker - tc', 'christopher ritchie', 'ritchie', 'jones - rie', "o'brien", 'cowley', 'futcher', 'women writers', 'turner - sgam', 'occult', 'erotica'], "Fiction, Young Adult & Sci-Fi"),
]

PRODUCT_NAME_OVERRIDES = [
    ('crumbdog', "Children's & Picture Books"),
    ('gathering of gods', "Fiction, Young Adult & Sci-Fi"),
    ('adventures of milla carter', "Fiction, Young Adult & Sci-Fi"),
    ('plants & us', "Non-Fiction & Memoir"),
    ('plants and us', "Non-Fiction & Memoir"),
    ('poetry collections - by mary pargeter', "Poetry & Fine Art"),
    ('mary pargeter', "Poetry & Fine Art"),
    ('nora & john', "Fiction, Young Adult & Sci-Fi"),
    ('dennis to alice', "Children's & Picture Books"),
]

EDITORIAL_ENRICHMENTS = {
    '9792a2c8-299a-cf0e-6987-1c32c2df92a4': {
        'title': "The Ginologist Cook: Dinner Party Recipes",
        'tagline': "150 delicious recipes with Gin — The world's first craft gin coffee-table cookbook",
        'author': "Pieter Carter & The Ginologist Team",
        'authors': [
            {
                "name": "Pieter Carter",
                "role": "Ginologist Distiller & Founder",
                "bio": "Graduated in law but instead of practising law he took to the stills. It wasn’t long before the 3 Gins in the Ginologist range of Spice, Floral and Citrus entered their first competition, the Michelangelo International Wine and Spirits awards, winning 2 gold medals and a silver. This victory made Pieter one of the youngest distillers to distil an award-winning gin."
            },
            {
                "name": "Shane Heldsinger",
                "role": "Group Executive Chef",
                "bio": "Studied at Cordon Bleu Chefs School of South Africa and later had the privilege of cooking for Nelson Mandela on his 90th birthday celebrations. Currently Group Executive Chef for Gastronomie, a chain of Restaurants in South Africa featuring Carbon Bistro, Capital P and Kingelato. Trained in Classical French cuisine, he has personalised his own style fusing modern contemporary cuisine with a strong Asian influence."
            },
            {
                "name": "Charlotte Letlape",
                "role": "The Pastry Princess",
                "bio": "Better known as The Pastry Princess, Charlotte is a former investment banker turned pastry chef from Johannesburg. She specialises in designer desserts, high tea catering and speciality cakes. Her private and corporate clients include former First Lady Zanele Mbeki, T-Systems, Olympic Gold medal winner Wayde van Niekerk, and Kaya FM."
            },
            {
                "name": "Kundi Thai",
                "role": "Culinary Specialist & Private Chef",
                "bio": "An attorney whose love for good food swept her from the courtroom and permanently into the kitchen! Self-taught through cook books, cooking shows, and the internet, she founded kundiskitchen.com to share recipe details of her enticing meals. She is a private chef and runs her own premier catering business."
            },
            {
                "name": "Phillip Tlhako",
                "role": "Professional Cookery Chef",
                "bio": "His dream of becoming a mine boy after matric didn’t come true. Instead, he won an internship in the hospitality industry where his love of food flourished. After a hotel manager discovered his talent and offered to pay his student fees, he gained his Diploma in Professional Cookery and is now living his dream as a chef in Pretoria."
            },
            {
                "name": "Ahe Jafta",
                "role": "Master Mixologist",
                "bio": "A celebrated South African mixologist who competed in MasterChef South Africa 2009 and represented the nation as a contender in top Middle East championships (World Class UAE, Campari, Chivas Masters). A well-established head bartender working with top cocktail experts, he is 'changing the world one cocktail at a time.'"
            }
        ],
        'authorBio': "Crafted by the culinary and distilling team at Ginologist, South Africa's award-winning craft distillery. From savoury mains to sweet desserts and signature cocktails, each recipe explores botanical gin flavour pairings.",
        'previewPages': [
            "https://static.wixstatic.com/media/7c7af8_5b34981d7433437e9a6e1434ca501ec9~mv2.jpg/v1/fill/w_1000,h_1250,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_4d81a60c16b8430997ed206d21293311~mv2.jpg/v1/fill/w_1200,h_750,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_be677a6802924525b9cef47571d585f7~mv2.jpg/v1/fill/w_1000,h_1250,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_702a44fa0a6245669c0affde03d6e57e~mv2_d_1240_1754_s_2.jpg/v1/fill/w_1000,h_1400,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_aa2998b42b244a6cad6deb16457ce841~mv2.jpg/v1/fill/w_1000,h_1400,q_90/file.jpg"
        ],
        'accolades': [
            {"title": "IWSC Silver Award", "subtitle": "International Wine & Spirit Competition"},
            {"title": "Expresso TV Show", "subtitle": "National Morning Showcase"}
        ]
    },
    'ec30ad44-30fb-85eb-9725-4259f6c72523': {
        'title': "Özlem's Turkish Table: Recipes from My Homeland",
        'tagline': "Winner of the Gourmand World Cookbook Award · Authentic Southern Turkish & Antakya Gastronomy",
        'author': "Özlem Warren",
        'authors': [
            {"name": "Özlem Warren", "role": "Author & Culinary Ambassador"}
        ],
        'authorBio': "Özlem Warren is an internationally acclaimed Turkish culinary expert, author, and food writer born in Antakya, Southern Turkey. She teaches Turkish cookery courses in the UK and USA and is a passionate ambassador for authentic Anatolian gastronomy.",
        'accolades': [
            {"title": "Gourmand World Award", "subtitle": "Best Heritage Cookery Book"},
            {"title": "BBC Good Food & The Sun", "subtitle": "Featured Cookbook"}
        ]
    },
    '5aba1fc3-b88f-12d6-37f8-4da625fff3bd': {
        'title': "The Zodiac Cooks: Date Night Recipes",
        'tagline': "Recipes for Romance from the Celestial Kitchen of Life — Sensuous cooking tailored to your date's star sign",
        'author': "Penny Thornton",
        'authors': [
            {
                "name": "Penny Thornton",
                "role": "Princess Diana's Astrologer & Author",
                "bio": "Penny Thornton has been an astrologer for over thirty years, with a global clientele and one of the top astrology authorities in the world (Astrolutely.com). Formerly personal astrologer to Princess Diana, she is the author of Suns and Lovers and hosted a six-month daily spot on the US Food Network blending culinary art with astrology. She divides her time between the UK, USA, and Sweden."
            }
        ],
        'authorBio': "Penny Thornton has been an astrologer for over thirty years, with a global clientele and one of the top astrology authorities in the world (Astrolutely.com). Formerly personal astrologer to Princess Diana, she hosted a daily spot on the US Food Network blending culinary art with astrology.",
        'previewPages': [
            "https://static.wixstatic.com/media/7c7af8_408884359f964e3984000304aa9c5ddf~mv2.jpg/v1/fill/w_1000,h_1300,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_a2e9d9ffe9ae4000959643eca805a309~mv2.jpg/v1/fill/w_1000,h_1300,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_bbbf9a776e4c4db5bfadacb2b937fd0f~mv2.jpg/v1/fill/w_1000,h_1300,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_d4f4a95298f64cc281648386ba6a9511~mv2.png/v1/fill/w_800,h_900,q_90/file.png"
        ],
        'accolades': [
            {"title": "Daily Mail (Femail)", "subtitle": "How Your Star Sign Rules Your Diet"},
            {"title": "Woman & Home", "subtitle": "Featured Astrologer & Chef"},
            {"title": "US Food Network & The List TV", "subtitle": "Broadcast Feature"}
        ]
    },
    '33b34cc3-7713-1327-240c-204c99fb52b1': {
        'title': "Dennis to Alice: A Movie in a Book",
        'tagline': "An interactive wildlife picture book where pages come alive with video — Supporting endangered species conservation",
        'author': "George S Boughton & Martyn Tillier",
        'authors': [
            {
                "name": "George S Boughton",
                "role": "Author & Publisher",
                "bio": "Founder of GB Publishing and author, George documented a chance moment of lockdown mayhem when flooding created a river dam, inspiring this interactive 'movie in a book'."
            },
            {
                "name": "Martyn Tillier",
                "role": "Illustrator",
                "bio": "Talented wildlife and children's book illustrator whose vibrant artwork brings the river animals, swans, geese, and canoeing mayhem to life."
            }
        ],
        'authorBio': "Written by George S Boughton and illustrated by Martyn Tillier. Conceived as an interactive 'movie in a book' tied to the 12-part Noah's Ark Sky TV series.",
        'videoTrailer': {
            'title': "Dennis to Alice — Official Book Trailer",
            'url': "https://video.wixstatic.com/video/7c7af8_952d7f4ee2be48458e51975fea0afcba/720p/mp4/file.mp4",
            'poster': "https://static.wixstatic.com/media/7c7af8_5e0fa6969a2341f1ac6b381cb38258a0f001.jpg/v1/fill/w_1280,h_720,q_90/file.jpg",
            'duration': "0:31"
        },
        'previewPages': [
            "https://static.wixstatic.com/media/7c7af8_860b6ef537d945dc840dd2f3be408f4d~mv2.jpg/v1/fit/w_1200,h_1200,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_182f71d5a18747c883b388dfc1f02936~mv2.jpeg/v1/fit/w_1200,h_1000,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_41e2dd8b08a44c5b9654eaec7691806a~mv2.png/v1/fit/w_800,h_1000,q_90/file.png"
        ],
        'accolades': [
            {"title": "Sky TV Tie-In", "subtitle": "Noah's Ark 12-Part Conservation Series"},
            {"title": "Brooklands Radio Feature", "subtitle": "Author Broadcast Interview"},
            {"title": "£1 Charity Donation", "subtitle": "Noah's Ark Wildlife Sanctuary"}
        ]
    }
}

def clean_text(text):
    if not text:
        return ""
    t = html.unescape(str(text))
    t = re.sub(r'<[^>]+>', ' ', t)
    # Fix Özlem name cleanly with single Ö
    t = re.sub(r'(?i)(?:[ÖöOo]{1,3}|\ufffd+|[^\x00-\x7F])?zlem', 'Özlem', t)
    t = t.replace('\ufffd', ' ')
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def extract_author(name, brand=""):
    if brand and len(brand) > 2 and brand != "GB Publishing":
        return clean_text(brand)
    n = clean_text(name).lower()
    if 'ozlem' in n or 'zlem' in n or 'özlem' in n:
        return 'Özlem Warren'
    if 'pargeter' in n:
        return 'Mary Pargeter'
    if 'kimberley' in n:
        return 'Anthony & Wendy Kimberley'
    if 'thornton' in n:
        return 'P Thornton'
    if 'latham' in n:
        return 'Clare Latham'
    if 'solonair' in n:
        return 'Dr Solonair'
    if 'collins' in n:
        return 'Lois Collins'
    if 'boughton' in n:
        return 'George S Boughton'
    if 'fitzgerald' in n:
        return 'M.A. Fitzgerald'
    if 'futcher' in n:
        return 'Keith Futcher'
    if 'sauvage' in n:
        return 'John Sauvage'
    if 'trivedy' in n:
        return 'Dr Chet Trivedy'
    if 'morganico' in n or 'sam widges' in n:
        return 'Morganico'
    return 'GB Publishing Author'

def categorize_product(name, collection_ids, collections_map):
    n_lower = clean_text(name).lower()
    cats = []
    
    # 1. Product specific overrides
    for match_kw, imp in PRODUCT_NAME_OVERRIDES:
        if match_kw in n_lower:
            if imp not in cats:
                cats.append(imp)
                
    # 2. Collection IDs
    if not cats:
        for cid in collection_ids:
            cname = collections_map.get(cid, '').lower()
            if not cname or cname in ['all products', 'gbp', 'news letter']:
                continue
            for keywords, imprint in COLLECTION_IMPRINT_MAP:
                if any(kw in cname for kw in keywords):
                    if imprint not in cats:
                        cats.append(imprint)
                    break
                    
    # 3. Fallback keyword categorization
    if not cats:
        if any(k in n_lower for k in ['cook', 'food', 'recipe', 'turkish', 'gin']):
            cats.append("Food & Drink")
        elif any(k in n_lower for k in ['picture', 'children', 'grandad', 'erin', 'dennis', 'tommy', 'crumbdog']):
            cats.append("Children's & Picture Books")
        elif any(k in n_lower for k in ['poetry', 'pargeter', 'fine art', 'paintings', 'kimberley bem']):
            cats.append("Poetry & Fine Art")
        elif any(k in n_lower for k in ['memoir', 'biography', 'nature', 'plants', 'vet']):
            cats.append("Non-Fiction & Memoir")
        else:
            cats.append("Fiction, Young Adult & Sci-Fi")
            
    return cats

print(f"Connecting to live Wix Stores (Site ID: {WIX_SITE_ID})...")

# 1. Query Collections Map
col_req = urllib.request.Request(
    'https://www.wixapis.com/stores/v1/collections/query',
    data=json.dumps({'query': {'paging': {'limit': 100}}}).encode('utf-8'),
    headers=headers,
    method='POST'
)
with urllib.request.urlopen(col_req) as resp:
    cols_data = json.loads(resp.read().decode('utf-8'))
    collections_map = {c['id']: c['name'] for c in cols_data.get('collections', [])}
print(f"Retrieved {len(collections_map)} collections.")

# 2. Query Products
prod_req = urllib.request.Request(
    'https://www.wixapis.com/stores/v1/products/query',
    data=json.dumps({'query': {'paging': {'limit': 100}}}).encode('utf-8'),
    headers=headers,
    method='POST'
)
with urllib.request.urlopen(prod_req) as resp:
    prods_data = json.loads(resp.read().decode('utf-8'))
    raw_products = prods_data.get('products', [])
print(f"Retrieved {len(raw_products)} live products from gbp-publishing-org.")

catalog = []
for idx, p in enumerate(raw_products):
    raw_name = clean_text(p.get('name', ''))
    ribbon = clean_text(p.get('ribbon', ''))
    description = clean_text(p.get('description', ''))
    
    is_signed = ('signed' in ribbon.lower() or 
                 'signed' in raw_name.lower() or 
                 'signed' in description.lower())
    
    is_wholesale = ('wholesale' in raw_name.lower())
    
    display_name = raw_name
    # Clean up minor artifacts while preserving edition details
    display_name = re.sub(r'(?:[ÖöOo]{2,3}|\ufffd+)zlem', 'Özlem', display_name)
    display_name = display_name.replace(' -by ', ' - by ').strip()
    if not display_name:
        display_name = raw_name
        
    price_data = p.get('priceData', {})
    base_price = price_data.get('price')
    discounted_price = price_data.get('discountedPrice')
    
    if discounted_price is not None and base_price is not None and discounted_price < base_price:
        price = float(discounted_price)
        original_price = float(base_price)
    elif base_price is not None:
        price = float(base_price)
        original_price = round(price * 1.2, 2) if is_signed else None
    else:
        price_val = p.get('price', {}).get('price')
        price = float(price_val) if price_val is not None else 14.99
        original_price = round(price * 1.2, 2) if is_signed else None
    
    media_items = p.get('media', {}).get('items', [])
    image_urls = []
    for m in media_items:
        if m.get('image', {}).get('url'):
            image_urls.append(m['image']['url'])
        elif m.get('url'):
            image_urls.append(m['url'])
        elif m.get('src'):
            image_urls.append(f"https://static.wixstatic.com/media/{m['src']}")
            
    cover_image = image_urls[0] if image_urls else "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    gallery = image_urls[1:] if len(image_urls) > 1 else [cover_image]
    
    author = extract_author(raw_name, p.get('brand', ''))
    collection_ids = p.get('collectionIds', [])
    categories = categorize_product(raw_name, collection_ids, collections_map)
    
    slug = re.sub(r'[^a-z0-9]+', '-', display_name.lower()).strip('-')
    if not slug:
        slug = f"book-{idx+1}"
        
    handle_id = p.get('id', p.get('numericId', f"wix_{idx}"))
    sku = p.get('sku') or f"GBP-{1000 + idx}"
    
    # Mary Pargeter exclusive bookmark perk per George's instruction
    if 'pargeter' in raw_name.lower() or 'pargeter' in slug:
        ribbon = "Free Bookmark Included"
        if "free custom gb publishing bookmark" not in description.lower():
            description = description + " ✨ Free custom GB Publishing bookmark included with every copy."
    
    if p.get('visible', True) is False:
        continue

    enrichment = EDITORIAL_ENRICHMENTS.get(handle_id, {})
    if enrichment.get('title'):
        display_name = enrichment['title']
    if enrichment.get('author'):
        author = enrichment['author']

    catalog.append({
        "id": handle_id,
        "slug": slug,
        "title": display_name,
        "rawTitle": raw_name,
        "author": author,
        "tagline": enrichment.get('tagline', ''),
        "authors": enrichment.get('authors', []),
        "authorBio": enrichment.get('authorBio', ''),
        "previewPages": enrichment.get('previewPages', []),
        "accolades": enrichment.get('accolades', []),
        "videoTrailer": enrichment.get('videoTrailer', None),
        "price": price,
        "originalPrice": original_price,
        "sku": sku,
        "ribbon": ribbon if ribbon else ("Signed Collector Edition" if is_signed else ""),
        "categories": categories,
        "coverImage": cover_image,
        "gallery": gallery,
        "description": description if len(description) > 25 else f"A featured indie publication by {author}, available directly from GB Publishing Org with fast UK delivery.",
        "isWholesale": is_wholesale,
        "isSigned": is_signed,
        "visible": True,
        "format": "Signed Edition" if is_signed else ("Hardcover" if price > 20 else "Paperback"),
        "stock": p.get('stock', {}).get('quantity', 25)
    })

# Save output to both locations
os.makedirs('src/data', exist_ok=True)
os.makedirs('public/data', exist_ok=True)

with open('src/data/catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

with open('public/data/catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"SUCCESS: Synced {len(catalog)} products from live gbp-publishing-org into catalog.json!")
