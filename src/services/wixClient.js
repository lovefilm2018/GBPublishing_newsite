import localCatalog from '../data/catalog.json';

// Live Wix Credentials for GB Publishing (`gbpublishing.co.uk`) - Connected to Staging Sandbox Store
const WIX_API_KEY = import.meta.env.VITE_WIX_API_KEY || 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjA2YTJiOTc4LWVkMzAtNGFlZS1iMzc4LWRlNzY3NzkwMWM3YVwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImQwOTYzZjFjLTRkNjgtNDU1Ny1iZmRmLWFkM2VkZTIwMzMyN1wifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCJhZDMzOTFjYi1jMTY4LTQ1MmItYmFjNi0yYzEyOWJmYjUwODRcIn19IiwiaWF0IjoxNzg1NzYyODAzfQ.B56Pyy8acMlfxhxds60rNRehlqmf4gclsoQE1tHZxPmdcuzeZmplx7esEgIE-U2h_qL5Dm4_veAVotCgMQI7B7sRPfDbd1rk7gcInxI0HoMEQxMWSqQL00axDT0zngJYebcuUcsbcf5MVJqKl7g0wvTvAO0p47LD_60T1aXuv_HIjvgjuiH_OfUnP30CeeJgOpRyh7RnTM_Tm42OAlcUIuSPur60R_N18Oe31Dbqs-EVJCjoP4z3uuDJjH74q1uNUJOJTaJuxhYOYFg4ScgBCoc9Mg3w5jNZ2GQZWJynaFDJYQ0zxdbmDrnlKjky5murF_Fy9H6WT-3exZfhvC2VEA';
const WIX_SITE_ID = import.meta.env.VITE_WIX_SITE_ID || 'dd68067c-f9a8-445f-bc9c-e35dff588dd2';

/**
 * Normalizes a raw Wix REST product payload into our custom React storefront schema
 */
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

    // Resolve Collection / Category mapping from Wix Collection IDs
    const collectionIds = p.collectionIds || [];
    const rawCategoryNames = collectionIds
      .map(id => collectionsMap[id])
      .filter(Boolean)
      .filter(name => name !== 'All Products' && name !== 'GBP');

    let categories = [];

    // Map Wix Collections to the 5 Core Imprint Categories
    for (const catName of rawCategoryNames) {
      const cLower = catName.toLowerCase();
      if (cLower.includes('cook') || cLower.includes('food') || cLower.includes('ginologist') || cLower.includes('ozlem')) {
        if (!categories.includes("Cookbooks & Food")) categories.push("Cookbooks & Food");
      } else if (cLower.includes('picture') || cLower.includes('children') || cLower.includes('lois') || cLower.includes('boughton - alice') || cLower.includes('latham')) {
        if (!categories.includes("Children's & Picture Books")) categories.push("Children's & Picture Books");
      } else if (cLower.includes('art') || cLower.includes('poetry') || cLower.includes('kimberley')) {
        if (!categories.includes("Poetry & Fine Art")) categories.push("Poetry & Fine Art");
      } else if (cLower.includes('biography') || cLower.includes('memoir') || cLower.includes('non-fiction') || cLower.includes('sauvage') || cLower.includes('nature') || cLower.includes('animals')) {
        if (!categories.includes("Non-Fiction & Memoir")) categories.push("Non-Fiction & Memoir");
      } else if (cLower.includes('fiction') || cLower.includes('sci-fi') || cLower.includes('fantasy') || cLower.includes('young adult') || cLower.includes('fitzgerald') || cLower.includes('pearson')) {
        if (!categories.includes("Fiction, YA & Sci-Fi")) categories.push("Fiction, YA & Sci-Fi");
      }
    }

    // Fallback if no specific collection matched
    if (categories.length === 0) {
      const n = rawName.toLowerCase();
      if (n.includes('cook') || n.includes('food') || n.includes('recipe') || n.includes('turkish')) categories.push("Cookbooks & Food");
      else if (n.includes('picture') || n.includes('children') || n.includes('grandad') || n.includes('erin') || n.includes('dennis')) categories.push("Children's & Picture Books");
      else if (n.includes('art') || n.includes('painting') || n.includes('kimberley')) categories.push("Poetry & Fine Art");
      else if (n.includes('vet') || n.includes('autobiology') || n.includes('memoir')) categories.push("Non-Fiction & Memoir");
      else categories.push("Fiction, YA & Sci-Fi");
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
