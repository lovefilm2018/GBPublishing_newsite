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

# Read from .env if available, else use verified default
WIX_API_KEY = os.environ.get('VITE_WIX_API_KEY', 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjIzNzIzYjA3LTVjMjgtNGQ3ZC1hMTI1LTFmMzFhMzI1YWIyYVwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjE0ZjczMjYxLWQ2NDEtNDc3NS1iNzY2LTFkM2Q5ZWU0MjEyZFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCJhZDMzOTFjYi1jMTY4LTQ1MmItYmFjNi0yYzEyOWJmYjUwODRcIn19IiwiaWF0IjoxNzg5NTcyNzg0fQ.eDgE2zW5DISpHu_QJnaHZp8Kuj01sV5QG2yM7o0KAX3FdNQ4r2-cyECiczHK0aPiaBiyCeE3NLLqKbduhVgnutqXnmqs7rNphT_aLjs37BhuDoQjzBgAL1b39MUlO4RZQz2CZhvOxXE6M_YY1XydkImoyVVMa1-Ld9xnag0FEfZp7x3lqKmNTT4qExCnVfm-ty0DiJGb8l2I4AU2-cBYTO7nNVFbMpPrBcm2NvaxLGptqPYW-j9P_v2FpbC9QcCgT_lmQm2K8FbR99p8inmTzwAYhqz-2fdZns6xfg83tR-DH50hYm2SzlX-AuRBVDtrv5ryAPu6VR-YAhsNhZ0azw')
WIX_SITE_ID = os.environ.get('VITE_WIX_SITE_ID', '34002663-ff5b-495e-be4c-53ad0dc3184f')

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

def clean_text(text):
    if not text:
        return ""
    t = html.unescape(str(text))
    t = re.sub(r'<[^>]+>', ' ', t)
    # Fix Özlem name cleanly with single Ö
    t = re.sub(r'(?:[ÖöOo]{2,3}|\ufffd+)zlem', 'Özlem', t)
    t = re.sub(r'\bOzlem\b', 'Özlem', t)
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
    
    is_wholesale = ('wholesale' in raw_name.lower() or 
                    '40% off' in raw_name.lower())
    
    display_name = re.sub(r'(?i)\s*-\s*wholesale.*$', '', raw_name)
    display_name = re.sub(r'(?i)\s*-\s*40%\s*off.*$', '', display_name)
    display_name = re.sub(r'(?i)\s*-\s*buy wholesale.*$', '', display_name).strip()
    if not display_name:
        display_name = raw_name
        
    price_val = p.get('price', {}).get('price')
    price = float(price_val) if price_val is not None else 14.99
    
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
    
    catalog.append({
        "id": handle_id,
        "slug": slug,
        "title": display_name,
        "rawTitle": raw_name,
        "author": author,
        "price": price,
        "originalPrice": round(price * 1.2, 2) if is_signed else None,
        "sku": sku,
        "ribbon": ribbon if ribbon else ("Signed Collector Edition" if is_signed else ""),
        "categories": categories,
        "coverImage": cover_image,
        "gallery": gallery,
        "description": description if len(description) > 25 else f"A featured indie publication by {author}, available directly from GB Publishing Org with fast UK delivery.",
        "isWholesale": is_wholesale,
        "isSigned": is_signed,
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
