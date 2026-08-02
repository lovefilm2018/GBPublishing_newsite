import pandas as pd
import json
import re
import html
import os

csv_path = r'C:\Users\TotalBiz\Documents\GBPublishing\catalog_products.csv'

df = pd.read_csv(csv_path, encoding='utf-8-sig', encoding_errors='replace')

products = df[df['fieldType'] == 'Product'].copy()

def clean_text(text):
    if not isinstance(text, str) or pd.isna(text):
        return ""
    t = html.unescape(text)
    # Strip HTML tags
    t = re.sub(r'<[^>]+>', ' ', t)
    # Fix character replacements
    t = t.replace('\ufffdzlem', 'Özlem').replace('zlem', 'Özlem').replace('Ozlem', 'Özlem')
    t = t.replace('\ufffd', ' ')
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def extract_author(name, collection):
    name_str = clean_text(name)
    coll_str = clean_text(collection)
    
    if "Özlem" in name_str or "Ozlem" in name_str:
        return "Özlem Warren"
    if "Anthony & Wendy Kimberley" in name_str or "Anthony Kimberley" in name_str or "Kimberley" in name_str:
        return "Anthony & Wendy Kimberley"
    if "Thornton" in name_str or "Zodiac Cooks" in name_str:
        return "P Thornton"
    if "Latham" in name_str or "Erin" in name_str:
        return "Clare Latham"
    if "Fitzgerald" in name_str or "Tree" in name_str:
        return "M.A. Fitzgerald"
    if "Solonair" in name_str or "Solonair" in coll_str or "Tommy" in name_str:
        return "Dr Solonair"
    if "Cummins" in name_str or "Cummins" in coll_str or "Vet" in name_str:
        return "Paddy Cummins"
    if "Morganico" in name_str or "Sam Widges" in name_str:
        return "Morganico"
    if "Lois Collins" in name_str or "Lois Collins" in coll_str:
        return "Lois Collins"
    
    match = re.search(r'\bby\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})', name_str)
    if match:
        return match.group(1).strip()
        
    return "GB Publishing Author"

def categorize_product(name, collection):
    n = clean_text(name).lower()
    c = clean_text(collection).lower()
    
    cats = []
    if any(k in n or k in c for k in ['cook', 'food', 'recipe', 'turkish', 'ginologist', 'crumbdog', 'zodiac cooks']):
        cats.append("Cookbooks & Food")
    if any(k in n or k in c for k in ['picture', 'children', 'grandad', 'tommy', 'sam widges', 'erin', 'cloud']):
        cats.append("Children's & Picture Books")
    if any(k in n or k in c for k in ['art', 'paintings', 'kimberley bem', 'lois collins', 'illustration']):
        cats.append("Poetry & Fine Art")
    if any(k in n or k in c for k in ['sci-fi', 'fiction', 'novel', 'young adult', 'ya', 'tree', 'noah', 'war', 'kingswraith', 'absurd', 'nightmare']):
        cats.append("Fiction, YA & Sci-Fi")
    if any(k in n or k in c for k in ['vet', 'autobiology', 'biography', 'memoir', 'non-fiction', 'history', 'crisis', 'appeal']):
        cats.append("Non-Fiction & Memoir")
        
    if not cats:
        cats.append("Fiction, YA & Sci-Fi")
    return cats

def parse_images(img_field):
    if not isinstance(img_field, str) or pd.isna(img_field):
        return ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"]
    
    parts = [p.strip() for p in img_field.split(';') if p.strip()]
    urls = []
    for p in parts:
        if p.startswith('http'):
            urls.append(p)
        else:
            urls.append(f"https://static.wixstatic.com/media/{p}")
    return urls if urls else ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"]

catalog = []
for idx, row in products.iterrows():
    raw_name = str(row['name'])
    cleaned_name = clean_text(raw_name)
    
    # Strip wholesale / discount suffix for clean user-facing title
    display_name = re.sub(r'(?i)\s*-\s*wholesale.*$', '', cleaned_name)
    display_name = re.sub(r'(?i)\s*-\s*40%\s*off.*$', '', display_name)
    display_name = re.sub(r'(?i)\s*-\s*buy wholesale.*$', '', display_name).strip()
    
    handle_id = str(row['handleId'])
    sku = str(row['sku']) if not pd.isna(row['sku']) else f"GBP-{idx+1000}"
    price = float(row['price']) if not pd.isna(row['price']) else 14.99
    ribbon = clean_text(row['ribbon'])
    collection = clean_text(row['collection'])
    description = clean_text(row['description'])
    
    images = parse_images(row['productImageUrl'])
    cover_image = images[0]
    gallery = images[1:] if len(images) > 1 else [cover_image]
    
    author = extract_author(cleaned_name, collection)
    categories = categorize_product(cleaned_name, collection)
    
    is_wholesale = "wholesale" in raw_name.lower() or "40% off" in raw_name.lower() or "wholesale" in collection.lower()
    is_signed = "signed" in ribbon.lower() or "signed" in raw_name.lower() or "signed" in description.lower()
    
    slug = re.sub(r'[^a-z0-9]+', '-', display_name.lower()).strip('-')
    
    catalog.append({
        "id": handle_id,
        "slug": slug,
        "title": display_name,
        "rawTitle": cleaned_name,
        "author": author,
        "price": price,
        "originalPrice": round(price * 1.2, 2) if is_signed or "award" in ribbon.lower() else None,
        "sku": sku,
        "ribbon": ribbon if ribbon else ("Signed Collector Edition" if is_signed else ""),
        "categories": categories,
        "coverImage": cover_image,
        "gallery": gallery,
        "description": description if len(description) > 30 else f"A featured indie publication by {author}, available directly from GB Publishing with free bookmark and fast delivery.",
        "isWholesale": is_wholesale,
        "isSigned": is_signed,
        "format": "Signed Edition" if is_signed else ("Hardcover" if price > 20 else "Paperback"),
        "stock": 25
    })

os.makedirs('src/data', exist_ok=True)
os.makedirs('public/data', exist_ok=True)

with open('src/data/catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

with open('public/data/catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"Successfully generated catalog with {len(catalog)} clean products!")
