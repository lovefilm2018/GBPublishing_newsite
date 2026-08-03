import localCatalog from '../data/catalog.json';

// Live Wix Credentials for GB Publishing (`gbpublishing.co.uk`) - Connected to Staging Sandbox Store
const WIX_API_KEY = import.meta.env.VITE_WIX_API_KEY || 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjA2YTJiOTc4LWVkMzAtNGFlZS1iMzc4LWRlNzY3NzkwMWM3YVwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImQwOTYzZjFjLTRkNjgtNDU1Ny1iZmRmLWFkM2VkZTIwMzMyN1wifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCJhZDMzOTFjYi1jMTY4LTQ1MmItYmFjNi0yYzEyOWJmYjUwODRcIn19IiwiaWF0IjoxNzg1NzYyODAzfQ.B56Pyy8acMlfxhxds60rNRehlqmf4gclsoQE1tHZxPmdcuzeZmplx7esEgIE-U2h_qL5Dm4_veAVotCgMQI7B7sRPfDbd1rk7gcInxI0HoMEQxMWSqQL00axDT0zngJYebcuUcsbcf5MVJqKl7g0wvTvAO0p47LD_60T1aXuv_HIjvgjuiH_OfUnP30CeeJgOpRyh7RnTM_Tm42OAlcUIuSPur60R_N18Oe31Dbqs-EVJCjoP4z3uuDJjH74q1uNUJOJTaJuxhYOYFg4ScgBCoc9Mg3w5jNZ2GQZWJynaFDJYQ0zxdbmDrnlKjky5murF_Fy9H6WT-3exZfhvC2VEA';
const WIX_SITE_ID = import.meta.env.VITE_WIX_SITE_ID || 'dd68067c-f9a8-445f-bc9c-e35dff588dd2';

/**
 * Normalizes a raw Wix REST product payload into our custom React storefront schema
 */

// ─── Comprehensive Wix Collection Name → 5 Core Imprint Mapping ─────────────
// Based on full audit of all 70+ collections in the Staging Wix Store.
// Collection names are matched on substrings (case-insensitive).
const COLLECTION_IMPRINT_MAP = [
  // Cookbooks & Food
  { keywords: ['cook', 'food', 'drink', 'ginologist', 'ozlem', 'gin', 'turkish', 'zodiac cooks', 'penny - tzc'], imprint: "Cookbooks & Food" },
  // Children's & Picture Books
  { keywords: ['picture book', 'children', 'lois', 'latham', 'boughton -alice', 'boughton - alice', 'solonair', 'islam - doogie', 'trivedy', 'pink biscuit', 'morgan - swsw', 'morgan - a2 prints', 'morgan - a3 prints', 'lois art prints', 'children\'s a', 'tillier'], imprint: "Children's & Picture Books" },
  // Poetry & Fine Art
  { keywords: ['poetry', 'pargeter', 'politics & poetry', 'wendy kimberley', 'boughton - art', 'fine art'], imprint: "Poetry & Fine Art" },
  // Non-Fiction & Memoir
  { keywords: ['biography', 'memoir', 'non-fiction', 'sauvage', 'animals & nature', 'nature', 'akeroyd', 'plants', 'murray - n&j', 'seafaring', 'boughton - sf'], imprint: "Non-Fiction & Memoir" },
  // Fiction, Young Adult & Sci-Fi
  { keywords: ['fiction', 'sci-fi', 'science fiction', 'fantasy', 'young adult', 'fitzgerald', 'pearson', 'kimberley - antecedent', 'boughton - bgbs', 'boughton - outtack', 'walker - tc', 'christopher ritchie', 'ritchie', 'jones - rie', 'o\'brien', 'cowley', 'futcher', 'women writers', 'turner - sgam', 'occult', 'erotica'], imprint: "Fiction, Young Adult & Sci-Fi" },
];

// ─── Product-Specific Overrides ───────────────────────────────────────────────
// For books where the Wix Dashboard collection is incorrect.
// Key: substring match on product name (lowercase), Value: correct imprint
const PRODUCT_NAME_OVERRIDES = [
  { match: 'crumbdog', imprint: "Children's & Picture Books" },
  { match: 'gathering of gods', imprint: "Fiction, Young Adult & Sci-Fi" },
  { match: 'adventures of milla carter', imprint: "Fiction, Young Adult & Sci-Fi" },
  { match: 'plants & us', imprint: "Non-Fiction & Memoir" },
  { match: 'plants and us', imprint: "Non-Fiction & Memoir" },
  { match: 'poetry collections - by mary pargeter', imprint: "Poetry & Fine Art" },
  { match: 'mary pargeter', imprint: "Poetry & Fine Art" },
  { match: 'nora & john', imprint: "Fiction, Young Adult & Sci-Fi" },
  { match: 'dennis to alice', imprint: "Children's & Picture Books" },
];

export function normalizeWixRestProduct(p, idx, collectionsMap = {}) {
  try {
    const rawName = p.name || "";
    const ribbon = p.ribbon || "";
    const description = p.description || "";

    const isSigned = ribbon.toLowerCase().includes('signed') || 
                     rawName.toLowerCase().includes('signed') || 
                     description.toLowerCase().includes('signed');

    const isWholesale = rawName.toLowerCase().includes('wholesale') || 
                        rawName.toLowerCase().includes('40% off');

    // Strip wholesale suffix cleanly using valid JS regex
    let displayName = rawName
      .replace(/\s*-\s*wholesale.*$/i, '')
      .replace(/\s*-\s*40%\s*off.*$/i, '')
      .replace(/\s*-\s*buy wholesale.*$/i, '')
      .trim();

    if (!displayName) displayName = rawName;

    const price = p.price?.price || 14.99;
    
    // Media handling
    const mediaItems = p.media?.items || [];
    const imageUrls = mediaItems.map(m => {
      if (m.image?.url) return m.image.url;
      if (m.url) return m.url;
      if (m.src) return `https://static.wixstatic.com/media/${m.src}`;
      return null;
    }).filter(Boolean);

    const coverImage = imageUrls[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80";
    const gallery = imageUrls.length > 1 ? imageUrls.slice(1) : [coverImage];

    let categories = [];
    const nameLower = rawName.toLowerCase();

    // ── Step 1: Check product-specific name overrides first (highest priority) ──
    for (const override of PRODUCT_NAME_OVERRIDES) {
      if (nameLower.includes(override.match)) {
        if (!categories.includes(override.imprint)) categories.push(override.imprint);
      }
    }

    // ── Step 2: Resolve from Wix Collection IDs ───────────────────────────────
    if (categories.length === 0) {
      const collectionIds = p.collectionIds || [];
      const rawCategoryNames = collectionIds
        .map(id => collectionsMap[id])
        .filter(Boolean)
        .filter(name => name !== 'All Products' && name !== 'GBP' && name !== 'News letter');

      for (const catName of rawCategoryNames) {
        const cLower = catName.toLowerCase();
        for (const { keywords, imprint } of COLLECTION_IMPRINT_MAP) {
          if (keywords.some(kw => cLower.includes(kw))) {
            if (!categories.includes(imprint)) categories.push(imprint);
            break;
          }
        }
      }
    }

    // ── Step 3: Name-based fallback (if Wix collections returned nothing) ─────
    if (categories.length === 0) {
      if (nameLower.includes('cook') || nameLower.includes('food') || nameLower.includes('recipe') || nameLower.includes('turkish') || nameLower.includes('gin')) {
        categories.push("Cookbooks & Food");
      } else if (nameLower.includes('picture') || nameLower.includes('children') || nameLower.includes('grandad') || nameLower.includes('erin') || nameLower.includes('dennis') || nameLower.includes('tommy') || nameLower.includes('crumbdog')) {
        categories.push("Children's & Picture Books");
      } else if (nameLower.includes('poetry') || nameLower.includes('pargeter') || nameLower.includes('fine art')) {
        categories.push("Poetry & Fine Art");
      } else if (nameLower.includes('memoir') || nameLower.includes('biography') || nameLower.includes('nature') || nameLower.includes('plants')) {
        categories.push("Non-Fiction & Memoir");
      } else {
        categories.push("Fiction, Young Adult & Sci-Fi");
      }
    }

    const slug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    return {
      id: p.id || p.numericId || `wix_${idx}`,
      slug: slug,
      title: displayName,
      rawTitle: rawName,
      author: p.brand || extractAuthorFromName(rawName),
      price: price,
      originalPrice: isSigned ? Math.round((price * 1.2) * 100) / 100 : null,
      sku: p.sku || `GBP-${1000 + idx}`,
      ribbon: ribbon || (isSigned ? "Signed Collector Edition" : ""),
      categories: categories,
      coverImage: coverImage,
      gallery: gallery,
      description: description.length > 20 ? description.replace(/<[^>]+>/g, ' ').trim() : `A featured indie publication by GB Publishing, available direct with free bookmark.`,
      isWholesale: isWholesale,
      isSigned: isSigned,
      format: isSigned ? "Signed Edition" : (price > 20 ? "Hardcover" : "Paperback"),
      stock: p.stock?.quantity || 25
    };
  } catch (err) {
    console.error('[Wix Normalizer] Error normalizing item:', err, p);
    return null;
  }
}

function extractAuthorFromName(name) {
  if (name.includes('Özlem') || name.includes('Ozlem')) return 'Özlem Warren';
  if (name.includes('Kimberley')) return 'Anthony & Wendy Kimberley';
  if (name.includes('Thornton')) return 'P Thornton';
  if (name.includes('Latham')) return 'Clare Latham';
  if (name.includes('Solonair')) return 'Dr Solonair';
  if (name.includes('Collins')) return 'Lois Collins';
  if (name.includes('Boughton')) return 'George S Boughton';
  return 'GB Publishing Author';
}

/**
 * Safely fetches live products from live Wix Stores REST API
 * Falls back seamlessly to verified catalog.json cache on offline or error
 */
export async function fetchCatalogProducts() {
  try {
    const headers = {
      'Authorization': WIX_API_KEY,
      'wix-site-id': WIX_SITE_ID,
      'Content-Type': 'application/json'
    };

    // 1. Fetch Collections Map in parallel
    let collectionsMap = {};
    try {
      const colRes = await fetch('https://www.wixapis.com/stores/v1/collections/query', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ query: { paging: { limit: 100 } } })
      });
      if (colRes.ok) {
        const colData = await colRes.json();
        if (colData.collections) {
          colData.collections.forEach(c => {
            collectionsMap[c.id] = c.name;
          });
        }
      }
    } catch (e) {
      console.warn('[Wix Headless API] Could not fetch collections map:', e);
    }

    // 2. Fetch Products
    const response = await fetch('https://www.wixapis.com/stores/v1/products/query', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        query: {
          paging: { limit: 100 }
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.products && data.products.length > 0) {
        const normalized = data.products.map((p, idx) => normalizeWixRestProduct(p, idx, collectionsMap)).filter(Boolean);
        if (normalized.length > 0) {
          console.log(`[Wix Headless Live API] Successfully fetched ${normalized.length} live products with dynamic collections!`);
          return normalized;
        }
      }
    }
  } catch (err) {
    console.warn('[Wix Headless API] Failed to query live Wix API, using verified catalog cache:', err.message);
  }

  // Fallback to verified local catalog cache
  return localCatalog;
}
