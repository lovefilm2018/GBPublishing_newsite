import localCatalog from '../data/catalog.json';

// Live Wix Credentials for GB Publishing (`gbpublishing.co.uk`)
const WIX_API_KEY = import.meta.env.VITE_WIX_API_KEY || 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjUwZjc0MGQ3LTUxNDItNDFkOS04OTlkLWI5ZDlhMDhlZmIzY1wiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjA3ODU2YjQ1LTQwNWQtNDkwMS05NGY0LTY4NTk0NmE5YzU3MlwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCJhZDMzOTFjYi1jMTY4LTQ1MmItYmFjNi0yYzEyOWJmYjUwODRcIn19IiwiaWF0IjoxNzg1NzYwNTg4fQ.cRvLiGa-dDttypxHWhAWZv3IdQxlkMlF2c4RuVRv7olGE5Z4oHy5HIIC4q_ZeXeBcu7PE2x_QNHXvOxvjCIZzhei15noGsAXwrUJJZo4JBJg3s1gvgURx5O4fis_BP6lZRg-kG2v-79Gt88oIo0FcG1CkvbHSI9OV9QvkJrzFe4b0qib2b0aoRJ3IgU9beBv_3EQCdfob-bRebYp0PnTKv5za1mEWO0jdKG-NCkoxbUZ6ll56cAIACH_gGoa9VCORAV4-Wp83P-4lP9suLtF7_Ggy0M67OwkFeKjd_4W423scd7kIvYNZ0syX0D63pg2IJMI6dwggAcD-EHQqTeZSA';
const WIX_SITE_ID = import.meta.env.VITE_WIX_SITE_ID || '34002663-ff5b-495e-be4c-53ad0dc3184f';

/**
 * Normalizes a raw Wix REST product payload into our custom React storefront schema
 */
export function normalizeWixRestProduct(p, idx) {
  const rawName = p.name || "";
  const ribbon = p.ribbon || "";
  const description = p.description || "";

  const isSigned = ribbon.toLowerCase().includes('signed') || 
                   rawName.toLowerCase().includes('signed') || 
                   description.toLowerCase().includes('signed');

  const isWholesale = rawName.toLowerCase().includes('wholesale') || 
                      rawName.toLowerCase().includes('40% off');

  // Strip wholesale suffix for clean display title
  let displayName = rawName.replace(/(?i)\s*-\s*wholesale.*$/, '')
                           .replace(/(?i)\s*-\s*40%\s*off.*$/, '')
                           .replace(/(?i)\s*-\s*buy wholesale.*$/, '').strip ? rawName.trim() : rawName;

  displayName = displayName.replace(/\s*-\s*WHOLESALE\s*40%\s*OFF/i, '').replace(/\s*-\s*wholesale paperback 40%\s*OFF/i, '').trim();

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

  // Collection / Category mapping
  const collections = p.collections?.map(c => c.name) || [];
  let categories = [];
  if (collections.length > 0) {
    categories = collections;
  } else {
    // Derive categories intelligently from title
    const n = rawName.toLowerCase();
    if (n.includes('cook') || n.includes('food') || n.includes('recipe') || n.includes('turkish')) categories.push("Cookbooks & Food");
    if (n.includes('picture') || n.includes('children') || n.includes('grandad') || n.includes('erin')) categories.push("Children's & Picture Books");
    if (n.includes('art') || n.includes('painting') || n.includes('kimberley')) categories.push("Poetry & Fine Art");
    if (n.includes('vet') || n.includes('autobiology') || n.includes('memoir')) categories.push("Non-Fiction & Memoir");
    if (categories.length === 0) categories.push("Fiction, YA & Sci-Fi");
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
}

function extractAuthorFromName(name) {
  if (name.includes('Özlem') || name.includes('Ozlem')) return 'Özlem Warren';
  if (name.includes('Kimberley')) return 'Anthony & Wendy Kimberley';
  if (name.includes('Thornton')) return 'P Thornton';
  if (name.includes('Latham')) return 'Clare Latham';
  if (name.includes('Solonair')) return 'Dr Solonair';
  if (name.includes('Collins')) return 'Lois Collins';
  return 'GB Publishing Author';
}

/**
 * Safely fetches live products from live Wix Stores REST API
 * Falls back seamlessly to verified catalog.json cache on offline or error
 */
export async function fetchCatalogProducts() {
  try {
    const response = await fetch('https://www.wixapis.com/stores/v1/products/query', {
      method: 'POST',
      headers: {
        'Authorization': WIX_API_KEY,
        'wix-site-id': WIX_SITE_ID,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
          paging: { limit: 100 }
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.products && data.products.length > 0) {
        console.log(`[Wix Headless Live API] Successfully fetched ${data.products.length} live products from Wix Stores!`);
        return data.products.map((p, idx) => normalizeWixRestProduct(p, idx));
      }
    }
  } catch (err) {
    console.warn('[Wix Headless API] Failed to query live Wix API, using verified catalog cache:', err.message);
  }

  // Fallback to verified local catalog cache
  return localCatalog;
}
