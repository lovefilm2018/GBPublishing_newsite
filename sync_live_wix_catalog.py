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

# Editorial and Author Credits per George's authoritative instructions
EDITORIAL_ENRICHMENTS = {
    # 1. Plants & Us (b220ed82-aca4-347e-1fd3-a029e6d655d4)
    'b220ed82-aca4-347e-1fd3-a029e6d655d4': {
        'title': "Plants & Us: How They Shape Human History & Society",
        'tagline': "Plant usage, ethnobotany, and habitat conservation — Foreword by Sir Tim Smit, Co-Founder of The Eden Project",
        'author': "John Akeroyd, Donough O'Brien & Liz Cowley",
        'contributors': "Foreword by Sir Tim Smit, The Eden Project Cornwall · Tie-in to You are Noah! Introduction by Hein Prinsloo Curson",
        'authorSectionTitle': "About the Authors & Botanists",
        'authors': [
            {
                "name": "John Akeroyd",
                "role": "Lead Author & Renowned Botanist",
                "bio": "Leading European field botanist, conservationist, and writer. Co-edited Flora Europaea and has written extensively on ethnobotany, plant usage, and habitat preservation worldwide."
            },
            {
                "name": "Donough O'Brien",
                "role": "Co-Author & Researcher",
                "bio": "Accomplished non-fiction writer and cultural researcher examining the societal, political, and historical ramifications of agriculture and flora across continents."
            },
            {
                "name": "Liz Cowley",
                "role": "Co-Author & Literary Contributor",
                "bio": "Celebrated poet, writer, and commentator whose work explores the human connection to nature, folklore, and the vital importance of plant conservation."
            }
        ],
        'authorBio': "Written by John Akeroyd, Donough O'Brien, and Liz Cowley, with a prestigious Foreword by Sir Tim Smit, Co-Founder of The Eden Project Cornwall.",
        'previewPages': [
            "https://static.wixstatic.com/media/7c7af8_186ba8567fb84f06914d297d3fb48741~mv2.jpg/v1/fit/w_1200,h_1500,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_2a2dd71014d847c3aa4a3e7a58019650~mv2.png/v1/fit/w_1400,h_900,q_90/file.png",
            "https://static.wixstatic.com/media/7c7af8_3fb3724e80d2478b908ee1cd62f9f382~mv2.jpg/v1/fit/w_800,h_1000,q_90/file.jpg"
        ],
        'accolades': [
            {"title": "The Telegraph", "subtitle": "A Fascinating New Book"},
            {"title": "Sir Tim Smit Foreword", "subtitle": "The Eden Project Cornwall"},
            {"title": "Gardens Illustrated & The Countryman", "subtitle": "Press Feature"},
            {"title": "Hannah Murray Radio", "subtitle": "Talk Radio Europe"}
        ],
        'description': "Plants & Us by John Akeroyd, Donough O'Brien, and Liz Cowley explores how plants have defined human civilisation — not only in food, drink, and commerce, but also in medicine, folklore, love, fashion, war, and art.\n\nNot just another gardening book, this is a sweeping exploration of how plants affect humankind for better or worse. From Presidents to pop stars, scientists to explorers, and royalty to pioneers, Plants & Us presents startling facts and compelling stories about our ubiquitous bond with the plant kingdom and the urgent necessity of global botanical conservation."
    },

    # 2. You are Noah! (76419b0d-f424-c776-9477-d7d9255302f3)
    '76419b0d-f424-c776-9477-d7d9255302f3': {
        'title': "You are Noah! Introduction — Wild Animal Conservation",
        'tagline': "The official book tie-in to the 6-part Sky TV wildlife series — Building the world's greatest nature sanctuary",
        'author': "Hein Prinsloo Curson",
        'contributors': "6-part Sky TV series tie-in · Tie-in to Plants & Us by John Akeroyd, Donough O'Brien, Liz Cowley",
        'authorSectionTitle': "About the Author & Conservation Founder",
        'authors': [
            {
                "name": "Hein Prinsloo Curson",
                "role": "Founder, The Noah's Ark Foundation",
                "bio": "Conservation visionary and founder of The Noah's Ark Foundation, a registered charity dedicated to creating a 100-square-kilometre ultra-secure wildlife sanctuary in South Africa to halt species extinction."
            },
            {
                "name": "Richard Prinsloo Curson",
                "role": "Co-Founder & Producer",
                "bio": "Creative director and producer behind the 6-part Noah's Ark television documentary broadcast on Sky TV and international networks."
            }
        ],
        'authorBio': "Hein Prinsloo Curson is the founder of The Noah's Ark Foundation. All publisher and author proceeds from direct purchases of this book go directly to charity operations protecting endangered species.",
        'missionCard': {
            'badge': "Official Sky TV & Conservation Initiative",
            'tag': "100% Proceeds Support Charity",
            'heading': "The Noah's Ark Sanctuary — Africa",
            'content': "You are Noah! is the official companion to the 6-part wildlife documentary series broadcast on Sky TV. Author and publisher profits from sales of this book directly support The Noah's Ark Foundation in South Africa, building an ultra-secure sanctuary to protect UN Red List endangered species.",
            'highlights': [
                "Official 6-part Sky TV wildlife series tie-in",
                "Directly funds anti-poaching security & veterinary teams",
                "Eden Project-style biomes for vulnerable wildlife",
                "Full engagement and upliftment of local indigenous communities"
            ]
        },
        'videoTrailer': {
            'title': "Noah's Ark TV Series — Official Trailer",
            'url': "https://video.wixstatic.com/video/7c7af8_952d7f4ee2be48458e51975fea0afcba/720p/mp4/file.mp4",
            'poster': "https://static.wixstatic.com/media/7c7af8_134a1929da7e4819a99a2af310de89e9~mv2.png/v1/fit/w_1280,h_720,q_90/file.png",
            'duration': "Trailer"
        },
        'previewPages': [
            "https://static.wixstatic.com/media/7c7af8_134a1929da7e4819a99a2af310de89e9~mv2.png/v1/fit/w_1200,h_1500,q_90/file.png",
            "https://static.wixstatic.com/media/7c7af8_61fa0963c53d4c98b16aa0079a50e8d9~mv2.jpg/v1/fit/w_1000,h_1200,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_f35bf2d72ef84f36acec365128697d8c~mv2.jpg/v1/fit/w_1000,h_1200,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_bb40f6f11a3946588ca6a20d3d32ae38~mv2.jpg/v1/fit/w_1000,h_1200,q_90/file.jpg"
        ],
        'accolades': [
            {"title": "Sky TV Broadcast", "subtitle": "6-Part Wildlife Documentary Series"},
            {"title": "Good Morning Britain (ITV)", "subtitle": "National Television Feature"},
            {"title": "Daily Express & Mail Online", "subtitle": "Press Feature"},
            {"title": "Jacaranda FM", "subtitle": "Martin Bester Broadcast"}
        ],
        'description': "You are Noah! Introduction by Hein Prinsloo Curson.\n\nThe official book tie-in to the 6-part Noah's Ark television series broadcast on Sky TV. This volume captures the opening chapters of a bold global conservation effort: constructing a 100-square-kilometre state-of-the-art wildlife sanctuary in South Africa to protect Earth's most endangered species.\n\nFeaturing behind-the-scenes photography from the TV production, architectural plans for climate-controlled biomes, and insights into high-tech anti-poaching security, You are Noah! is both a compelling visual journey and an urgent call to action. Author profits support The Noah's Ark Foundation registered charity."
    },

    # 3. Seafaring (bd3fe905-f8dc-a69b-b940-84f606827877)
    'bd3fe905-f8dc-a69b-b940-84f606827877': {
        'title': "Seafaring: The Full Story (Edition 2)",
        'tagline': "Sailing autobiography of a life before the mast in the final days of commercial tall ships",
        'author': "Captain George P Boughton",
        'contributors': "Illustrations by renowned maritime artist Kenneth D Shoesmith RI",
        'authorSectionTitle': "About the Author & Maritime Artist",
        'authors': [
            {
                "name": "Captain George P Boughton",
                "role": "Master Mariner & Author",
                "bio": "Captain George P Boughton spent decades navigating oceans under canvas and steam during the heroic era of merchant seamanship."
            },
            {
                "name": "Kenneth D Shoesmith RI",
                "role": "Renowned Maritime Illustrator",
                "bio": "Celebrated member of the Royal Institute of Painters in Water Colours, Shoesmith was one of Britain's most legendary maritime poster artists and illustrators."
            }
        ]
    },

    # 4. Dennis to Alice (33b34cc3-7713-1327-240c-204c99fb52b1)
    '33b34cc3-7713-1327-240c-204c99fb52b1': {
        'title': "Dennis to Alice: A Movie in a Book",
        'tagline': "An interactive wildlife picture book where pages come alive with video — Supporting endangered species conservation",
        'author': "George S Boughton",
        'contributors': "Illustrations by Martyn Tillier",
        'authorSectionTitle': "About the Author & Illustrator",
        'authors': [
            {
                "name": "George S Boughton",
                "role": "Author & Publisher",
                "bio": "Founder of GB Publishing Org and author, George documented a chance moment of lockdown mayhem when flooding created a river dam, inspiring this interactive 'movie in a book'."
            },
            {
                "name": "Martyn Tillier",
                "role": "Wildlife Illustrator",
                "bio": "Talented wildlife and children's book illustrator whose vibrant artwork brings the river animals, swans, geese, and canoeing mayhem to life."
            }
        ],
        'authorBio': "Written by George S Boughton and illustrated by Martyn Tillier. Conceived as an interactive 'movie in a book' tied to wildlife conservation.",
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
            {"title": "Sky TV Tie-In", "subtitle": "Noah's Ark Conservation Series"},
            {"title": "Brooklands Radio Feature", "subtitle": "Author Broadcast Interview"},
            {"title": "£1 Charity Donation", "subtitle": "Noah's Ark Wildlife Sanctuary"}
        ],
        'description': "Dennis to Alice by George S Boughton — Picture book & interactive movie in a book (SIGNED edition).\n\nCaptured is a chance moment of mayhem. Flooding from two strong storms created a dam across an otherwise peaceful river, just before a pandemic swept across the world to isolate this spot along with the author.\n\nBut, also captured along with manmade environmental contaminants, is the transformation that took place from busy contrail skies to blue and verdant water scenes… and a pair of geese that made this their home. Then kayakers tackle the obstacle, boaters try to remove it, a swan performs... and a fox attacks…"
    },

    # 5. Tulsi the Tiger (4f0a9ef7-8f73-4dad-a64c-1de4e3e405aa)
    '4f0a9ef7-8f73-4dad-a64c-1de4e3e405aa': {
        'title': "Tulsi the Tiger",
        'tagline': "An enchanting tale of conservation, courage, and wildlife protection in India's tiger reserves",
        'author': "Dr Chet Trivedy",
        'contributors': "Illustrations by Derek E Pearson",
        'authorSectionTitle': "About the Author & Illustrator",
        'authors': [
            {"name": "Dr Chet Trivedy", "role": "Emergency Medicine Consultant & Wildlife Advocate"},
            {"name": "Derek E Pearson", "role": "Illustrator & Author"}
        ]
    },

    # 6. Crumbdog (ad53e2e6-9058-48c0-ff65-c8b10fdcd401)
    'ad53e2e6-9058-48c0-ff65-c8b10fdcd401': {
        'title': "Crumbdog",
        'tagline': "A heartfelt illustrated children's story about friendship, resilience, and rescue dogs",
        'author': "Lois Collins",
        'contributors': "Foreword by Dame Jacqueline Wilson",
        'authorSectionTitle': "About the Author & Foreword",
        'authors': [
            {"name": "Lois Collins", "role": "Author & Artist"},
            {"name": "Dame Jacqueline Wilson", "role": "Foreword Contributor & Children's Laureate"}
        ],
        'accolades': [
            {"title": "Dame Jacqueline Wilson Foreword", "subtitle": "Distinguished Children's Laureate"},
            {"title": "Free Fridge Magnet", "subtitle": "Included with Direct Orders"}
        ]
    },

    # 7. Özlem's Turkish Table (ec30ad44-30fb-85eb-9725-4259f6c72523)
    'ec30ad44-30fb-85eb-9725-4259f6c72523': {
        'title': "Özlem's Turkish Table: Recipes from My Homeland",
        'tagline': "Winner of the Gourmand World Cookbook Award · Authentic Southern Turkish & Antakya Gastronomy",
        'author': "Özlem Warren",
        'contributors': "Foreword by Ghillie Basan · Food photography Sian Irvine",
        'authorSectionTitle': "About the Author & Culinary Ambassador",
        'authors': [
            {"name": "Özlem Warren", "role": "Author & Culinary Ambassador", "bio": "Özlem Warren is an internationally acclaimed Turkish culinary expert, author, and food writer born in Antakya, Southern Turkey. She teaches Turkish cookery courses in the UK and USA and is a passionate ambassador for authentic Anatolian gastronomy."}
        ],
        'authorBio': "Özlem Warren is an internationally acclaimed Turkish culinary expert, author, and food writer born in Antakya, Southern Turkey. She teaches Turkish cookery courses in the UK and USA and is a passionate ambassador for authentic Anatolian gastronomy.",
        'accolades': [
            {"title": "Gourmand World Award", "subtitle": "Best Heritage Cookery Book"},
            {"title": "BBC Good Food & The Sun", "subtitle": "Featured Cookbook"}
        ]
    },

    # 8. Grandad, let's go for a walk (aef4a66f-8990-8876-b336-b4aa17e8d6f9)
    'aef4a66f-8990-8876-b336-b4aa17e8d6f9': {
        'title': "Grandad, let's go for a walk",
        'tagline': "A gentle intergenerational journey exploring nature through the eyes of a grandchild and grandfather",
        'author': "Anthony Kimberley",
        'contributors': "Illustrations by fine artist Wendy Kimberley",
        'authorSectionTitle': "About the Author & Fine Artist",
        'authors': [
            {"name": "Anthony Kimberley", "role": "Author"},
            {"name": "Wendy Kimberley BEM", "role": "Fine Artist & Illustrator"}
        ]
    },

    # 9. The Zodiac Cooks (5aba1fc3-b88f-12d6-37f8-4da625fff3bd)
    '5aba1fc3-b88f-12d6-37f8-4da625fff3bd': {
        'title': "The Zodiac Cooks: Date Night Recipes",
        'tagline': "Recipes for Romance from the Celestial Kitchen of Life — Sensuous cooking tailored to your date's star sign",
        'author': "renowned astrologer Penny Thornton",
        'contributors': "Photography by Adrian Lawrence and Sian Irvine",
        'authorSectionTitle': "About the Author & Astrologer",
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

    # 10. Searching With Sam Widges (5d38a779-fb29-5f59-b189-bcab3a8d479e)
    '5d38a779-fb29-5f59-b189-bcab3a8d479e': {
        'title': "Searching With Sam Widges",
        'tagline': "An adventure across continents and imagination with Sam Widges — Free sticker or fridge magnet included",
        'author': "fine artist Morganico",
        'contributors': "Author & Illustrator: fine artist Morganico",
        'authorSectionTitle': "About the Author & Illustrator",
        'authors': [
            {"name": "Morganico", "role": "Fine Artist, Author & Illustrator"}
        ]
    },

    # 11. Little Tommy & the Kingdom of Clouds (5c8d41e2-e681-a38d-0cc1-bdd15678664d)
    '5c8d41e2-e681-a38d-0cc1-bdd15678664d': {
        'title': "Little Tommy & the Kingdom of Clouds",
        'tagline': "A magical journey above the skies supporting children's healthcare charity initiatives",
        'author': "fine artist Solonair",
        'contributors': "Author & Illustrator: fine artist Solonair",
        'authorSectionTitle': "About the Author & Illustrator",
        'authors': [
            {"name": "Dr Solonair", "role": "Fine Artist, Author & Illustrator"}
        ]
    },

    # 12. Spoddle the Frog (78e32832-8930-c891-85ef-2bcc73befdc2)
    '78e32832-8930-c891-85ef-2bcc73befdc2': {
        'title': "Spoddle the Frog",
        'tagline': "A delightfully illustrated wildlife pond adventure following Spoddle the adventurous amphibian",
        'author': "Martyn Tillier",
        'contributors': "Author & Illustrator: Martyn Tillier",
        'authorSectionTitle': "About the Author & Illustrator",
        'authors': [
            {"name": "Martyn Tillier", "role": "Wildlife Artist, Author & Illustrator"}
        ]
    },

    # 13. Pink Biscuit Zoo (9b74fd4c-a947-a37a-e2a9-db8137513882)
    '9b74fd4c-a947-a37a-e2a9-db8137513882': {
        'title': "Pink Biscuit Zoo",
        'tagline': "Whimsical rhymes and colourful zoo creature illustrations for early young readers",
        'author': "Derek E Pearson",
        'contributors': "Author & Illustrator: Derek E Pearson",
        'authorSectionTitle': "About the Author & Illustrator",
        'authors': [
            {"name": "Derek E Pearson", "role": "Author & Illustrator"}
        ]
    },

    # 14. Autobiology of a Vet (3cd38c96-a27a-0a03-77c2-93f8a2360fd3)
    '3cd38c96-a27a-0a03-77c2-93f8a2360fd3': {
        'title': "Autobiology of a Vet: A Vet's Life",
        'tagline': "From South London comprehensive to Royal Veterinary College, East Africa under Idi Amin, and rural farmyard surgery",
        'author': "John Sauvage",
        'contributors': "Veterinary Surgeon & RVC Graduate",
        'authorSectionTitle': "About the Author",
        'authors': [
            {
                "name": "John Sauvage, MRCVS",
                "role": "Veterinary Surgeon & Author",
                "bio": "Graduate of the Royal Veterinary College (London) and member of the Royal College of Veterinary Surgeons. His diverse veterinary career spanned rural cattle, equine practice, small-animal surgery, and veterinary cardiology across the UK, Australia, Portugal, and Norway. He served with an East African research team during Idi Amin's dictatorship."
            }
        ],
        'authorBio': "John Sauvage MRCVS graduated from the Royal Veterinary College after growing up in South London. Over four decades his practice spanned farm animals, equine medicine, and domestic pets across Britain and abroad.",
        'previewPages': [
            "https://static.wixstatic.com/media/7c7af8_f7bb75cddb6246249104d45bd1140696~mv2.jpg/v1/fit/w_1200,h_1600,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_a71fb7ce410d408398486a8f363bf860~mv2.jpg/v1/fit/w_800,h_1000,q_90/file.jpg",
            "https://static.wixstatic.com/media/7c7af8_2e292d907e2a4a2d978aa1384fb00f1d~mv2.jpg/v1/fit/w_1000,h_800,q_90/file.jpg"
        ],
        'accolades': [
            {"title": "Take a Break Magazine", "subtitle": "National Feature"},
            {"title": "Companion Life & Your Dog", "subtitle": "Industry Review"},
            {"title": "Improve Veterinary Practice", "subtitle": "Clinical & Memoir Spotlight"},
            {"title": "RVC Alumni Eclipse", "subtitle": "Royal Veterinary College"}
        ],
        'description': "Autobiology of a Vet by John Sauvage, MRCVS.\n\nOpening with his admission to the Royal College of Veterinary Surgeons, this warm and honest memoir traces John's journey from a South London comprehensive school through family wartime history, rigorous veterinary training, and research adventures in East Africa during Idi Amin's dictatorship.\n\nBack in the UK, John's tales of farm calls, midnight surgeries, equine emergencies, and beloved companion pets are educational, moving, and frequently hilarious. Covering vital debates from vaccination and bovine TB to the devastating heartbreak of foot-and-mouth disease, this is an authentic look behind the clinic doors."
    },

    # 15. Kingswraith series (95f9aab9-aa63-bb4d-b091-f010f89aa2fb)
    '95f9aab9-aa63-bb4d-b091-f010f89aa2fb': {
        'title': "Kingswraith Series",
        'author': "Derek E Pearson"
    },

    # 16. The Ordinary (ab1a611d-9061-e0ea-cf14-0c3b43255ebd)
    'ab1a611d-9061-e0ea-cf14-0c3b43255ebd': {
        'title': "The Ordinary",
        'tagline': "A chilling psychological supernatural thriller reminiscent of Stephen King",
        'author': "Christopher Ritchie"
    },

    # 17. Adventures of Milla Carter #1 (bb859fbd-7446-7580-8c3d-058c54e1a570)
    'bb859fbd-7446-7580-8c3d-058c54e1a570': {
        'title': "Adventures of Milla Carter Series 1",
        'tagline': "High fantasy series following Milla Carter — Body Holiday, Shadow Players & A Time To Prey",
        'author': "Derek E Pearson"
    },

    # 18. Adventures of Milla Carter #2 (0dda819e-726d-32e4-6a43-bb7a3caa5d87)
    '0dda819e-726d-32e4-6a43-bb7a3caa5d87': {
        'title': "Adventures of Milla Carter Series 2",
        'tagline': "Epic dark fantasy series following Milla Carter — Soul's Asylum, Star Weaver & The Swarm",
        'author': "Derek E Pearson"
    },

    # 19. Antecedent Series (915c7442-fdf6-d504-ff7f-824704f50343)
    '915c7442-fdf6-d504-ff7f-824704f50343': {
        'title': "Antecedent Series",
        'tagline': "Classic space opera science fiction trilogy — Galahad Suns, Nova Descent & Royal Gambit",
        'author': "David Kimberley"
    },

    # 20. Wendy Kimberley Art - Royal Gambit (be269508-8e69-a84c-1206-18619ed63c14)
    'be269508-8e69-a84c-1206-18619ed63c14': {
        'title': "Royal Gambit & Antecedent SF Art Prints (Size A2 / A3)",
        'tagline': "Fine art prints covering books in David Kimberley's Antecedent SF series by Wendy Kimberley",
        'author': "Wendy Kimberley",
        'isArt': True
    },

    # 21. The Gathering of Gods (69d3f6e8-f622-58ef-9679-740461b95b86)
    '69d3f6e8-f622-58ef-9679-740461b95b86': {
        'title': "The Gathering of Gods: Anubis & Isis",
        'tagline': "Epic mythological fantasy series — Anubis & Isis with exclusive series bundle offer",
        'author': "Derek E Pearson"
    },

    # 22. Preacher Spindrift (db9b7b04-bb72-0569-010b-ccadbd1eb228)
    'db9b7b04-bb72-0569-010b-ccadbd1eb228': {
        'title': "Preacher Spindrift Series",
        'tagline': "Gods' Enemy, Gods' Fool & Gods' Warrior epic fantasy trilogy",
        'author': "Derek E Pearson"
    },

    # 23. Erin & the Mouse (c0215ec8-1058-1b90-549d-1dc35000fda0)
    'c0215ec8-1058-1b90-549d-1dc35000fda0': {
        'title': "Erin & the Mouse (Edition 2)",
        'author': "Clare Latham",
        'contributors': "Foreword by Lee Ridley (Lost Voice Guy)"
    },

    # 24. Poetry Collection by Mary Pargeter (cde47029-fa39-eb54-3f55-b986494ac6bf)
    'cde47029-fa39-eb54-3f55-b986494ac6bf': {
        'title': "Poetry Collection by Mary Pargeter",
        'author': "Mary Pargeter",
        'contributors': "Free custom GB Publishing bookmark included with every copy",
        'isArt': False
    },

    # 25. The Ginologist Cook (9792a2c8-299a-cf0e-6987-1c32c2df92a4)
    '9792a2c8-299a-cf0e-6987-1c32c2df92a4': {
        'title': "The Ginologist Cook: Dinner Party Recipes",
        'tagline': "150 delicious recipes with Gin — The world's first craft gin coffee-table cookbook",
        'author': "Pieter Carter & The Ginologist Team",
        'contributors': "Craft gin recipes, mixology & botanical pairings from award-winning distillers",
        'authors': [
            {
                "name": "Pieter Carter",
                "role": "Ginologist Distiller & Founder",
                "bio": "Graduated in law but instead of practising law he took to the stills. It wasn’t long before the 3 Gins in the Ginologist range of Spice, Floral and Citrus entered their first competition, the Michelangelo International Wine and Spirits awards, winning 2 gold medals and a silver."
            },
            {
                "name": "Shane Heldsinger",
                "role": "Group Executive Chef",
                "bio": "Studied at Cordon Bleu Chefs School of South Africa and later had the privilege of cooking for Nelson Mandela on his 90th birthday celebrations."
            },
            {
                "name": "Charlotte Letlape",
                "role": "The Pastry Princess",
                "bio": "Specialises in designer desserts, high tea catering and speciality cakes. Former investment banker turned pastry chef from Johannesburg."
            },
            {
                "name": "Kundi Thai",
                "role": "Culinary Specialist & Private Chef",
                "bio": "Private chef and premier catering business owner dedicated to gourmet home cooking."
            },
            {
                "name": "Phillip Tlhako",
                "role": "Professional Cookery Chef",
                "bio": "Professional chef in Pretoria with deep passion for contemporary South African gastronomy."
            },
            {
                "name": "Ahe Jafta",
                "role": "Master Mixologist",
                "bio": "Celebrated mixologist who competed in MasterChef South Africa and represented the nation in top international cocktail championships."
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
    if brand and len(brand) > 2 and brand != "GB Publishing" and brand != "GB Publishing Org":
        return clean_text(brand)
    n = clean_text(name).lower()
    if 'ozlem' in n or 'zlem' in n or 'özlem' in n:
        return 'Özlem Warren'
    if 'pargeter' in n:
        return 'Mary Pargeter'
    if 'kimberley' in n:
        if 'david kimberley' in n or 'antecedent' in n:
            return 'David Kimberley'
        if 'wendy' in n:
            return 'Wendy Kimberley'
        return 'Anthony Kimberley'
    if 'thornton' in n or 'zodiac cooks' in n:
        return 'renowned astrologer Penny Thornton'
    if 'latham' in n:
        return 'Clare Latham'
    if 'solonair' in n:
        return 'fine artist Solonair'
    if 'collins' in n or 'crumbdog' in n:
        return 'Lois Collins'
    if 'boughton' in n:
        if 'cptn' in n or 'captain' in n or 'seafaring' in n:
            return 'Captain George P Boughton'
        return 'George S Boughton'
    if 'fitzgerald' in n:
        return 'M.A. Fitzgerald'
    if 'futcher' in n:
        return 'Keith Futcher'
    if 'sauvage' in n:
        return 'John Sauvage'
    if 'trivedy' in n or 'tulsi' in n:
        return 'Dr Chet Trivedy'
    if 'morganico' in n or 'sam widges' in n:
        return 'fine artist Morganico'
    if 'tillier' in n or 'spoddle' in n:
        return 'Martyn Tillier'
    if 'pearson' in n or 'kingswraith' in n or 'milla carter' in n or 'spindrift' in n or 'gathering of gods' in n or 'pink biscuit' in n:
        return 'Derek E Pearson'
    if 'ritchie' in n or 'the ordinary' in n:
        return 'Christopher Ritchie'
    if 'akeroyd' in n or 'plants' in n:
        return "John Akeroyd, Donough O'Brien & Liz Cowley"
    if 'noah' in n or 'prinsloo' in n:
        return 'Hein Prinsloo Curson'
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
        elif any(k in n_lower for k in ['picture', 'children', 'grandad', 'erin', 'dennis', 'tommy', 'crumbdog', 'widges', 'spoddle']):
            cats.append("Children's & Picture Books")
        elif any(k in n_lower for k in ['poetry', 'pargeter', 'fine art', 'paintings', 'kimberley bem', 'art print']):
            cats.append("Poetry & Fine Art")
        elif any(k in n_lower for k in ['memoir', 'biography', 'nature', 'plants', 'vet', 'seafaring']):
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

# 2. Query Products with includeVariants: True
prod_req = urllib.request.Request(
    'https://www.wixapis.com/stores/v1/products/query',
    data=json.dumps({'includeVariants': True, 'query': {'paging': {'limit': 100}}}).encode('utf-8'),
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
    handle_id = p.get('id', p.get('numericId', f"wix_{idx}"))
    
    # Check hidden or Black Friday
    if p.get('visible', True) is False:
        continue
    name_lower = raw_name.lower()
    if 'black friday' in name_lower:
        continue
    if any(dump in name_lower for dump in [
        'copy of buy these stunning books',
        'gbp crisis appeal',
        'non-fiction biography memoir paperbacks',
        'stunning coffee-table cook-books'
    ]):
        continue
        
    is_signed = ('signed' in ribbon.lower() or 
                 'signed' in raw_name.lower() or 
                 'signed' in description.lower())
    
    is_wholesale = ('wholesale' in raw_name.lower())
    
    display_name = raw_name
    display_name = re.sub(r'(?:[ÖöOo]{2,3}|\ufffd+)zlem', 'Özlem', display_name)
    display_name = display_name.replace(' -by ', ' - by ').strip()
    if not display_name:
        display_name = raw_name

    # Determine isArt strictly
    # Mary Pargeter poetry collections are books, not art prints
    if 'pargeter' in name_lower or 'poetry' in name_lower:
        is_art = False
    elif any(k in name_lower for k in [
        'art print', 'art prints', 'render', '360x300mm', 'size a2', 'size a3', 
        'a2 prints', 'a3 prints', 'wendy kimberley art', 'wendy kimberley bem art', 
        'painting 1', 'paintings in anthony', 'tigers in lockdown'
    ]):
        is_art = True
    elif 'prints' in name_lower:
        is_art = True
    else:
        is_art = False

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
        
    sku = p.get('sku') or f"GBP-{1000 + idx}"
    
    # Mary Pargeter exclusive bookmark perk per George's instruction
    if 'pargeter' in name_lower or 'pargeter' in slug:
        ribbon = "Free Bookmark Included"
        if "free custom gb publishing bookmark" not in description.lower():
            description = description + " ✨ Free custom GB Publishing bookmark included with every copy."

    # Parse productOptions
    clean_options = []
    for opt in p.get('productOptions', []):
        visible_choices = [c for c in opt.get('choices', []) if c.get('visible', True)]
        if visible_choices:
            clean_options.append({
                'name': opt.get('name', ''),
                'optionType': opt.get('optionType', 'drop_down'),
                'choices': [
                    {
                        'value': c.get('value', ''),
                        'description': c.get('description', ''),
                        'inStock': c.get('inStock', True)
                    }
                    for c in visible_choices
                ]
            })

    # Parse variants (only visible ones)
    clean_variants = []
    for v in p.get('variants', []):
        v_data = v.get('variant', {})
        if v_data.get('visible', True) is False:
            continue
        p_data = v_data.get('priceData', {})
        v_price = p_data.get('price')
        v_discount = p_data.get('discountedPrice')
        if v_discount is not None and v_price is not None and v_discount < v_price:
            actual_price = float(v_discount)
            orig_price = float(v_price)
        elif v_price is not None:
            actual_price = float(v_price)
            orig_price = None
        else:
            actual_price = price
            orig_price = None
        clean_variants.append({
            'id': v.get('id', ''),
            'choices': v.get('choices', {}),
            'price': actual_price,
            'originalPrice': orig_price,
            'sku': v_data.get('sku', ''),
            'inStock': v.get('stock', {}).get('inStock', True)
        })

    # Apply editorial enrichments
    enrichment = EDITORIAL_ENRICHMENTS.get(handle_id, {})
    if enrichment.get('title'):
        display_name = enrichment['title']
    if enrichment.get('author'):
        author = enrichment['author']
    if 'isArt' in enrichment:
        is_art = enrichment['isArt']
    contributors = enrichment.get('contributors', '')

    catalog.append({
        "id": handle_id,
        "slug": slug,
        "title": display_name,
        "rawTitle": raw_name,
        "author": author,
        "contributors": contributors,
        "isArt": is_art,
        "tagline": enrichment.get('tagline', ''),
        "authorSectionTitle": enrichment.get('authorSectionTitle', ''),
        "authors": enrichment.get('authors', []),
        "authorBio": enrichment.get('authorBio', ''),
        "previewPages": enrichment.get('previewPages', []),
        "accolades": enrichment.get('accolades', []),
        "videoTrailer": enrichment.get('videoTrailer', None),
        "missionCard": enrichment.get('missionCard', None),
        "price": price,
        "originalPrice": original_price,
        "sku": sku,
        "ribbon": ribbon if ribbon else ("Signed Copy Available" if is_signed else ""),
        "categories": categories,
        "coverImage": cover_image,
        "gallery": gallery,
        "description": enrichment.get('description') or (description if len(description) > 25 else f"A featured indie publication by {author}, available directly from GB Publishing Org with fast UK delivery."),
        "isWholesale": is_wholesale,
        "isSigned": is_signed,
        "visible": True,
        "format": "Signed Copy" if is_signed else ("Hardcover" if price > 20 else "Paperback"),
        "stock": p.get('stock', {}).get('quantity', 25),
        "options": clean_options,
        "variants": clean_variants
    })

# Save output to both locations
os.makedirs('src/data', exist_ok=True)
os.makedirs('public/data', exist_ok=True)

with open('src/data/catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

with open('public/data/catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

books_count = sum(1 for item in catalog if not item['isArt'])
art_count = sum(1 for item in catalog if item['isArt'])

print(f"SUCCESS: Synced {len(catalog)} products ({books_count} Books, {art_count} Art Prints) from live gbp-publishing-org into catalog.json!")
