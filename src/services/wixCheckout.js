import { createClient, OAuthStrategy } from '@wix/sdk';
import { checkout } from '@wix/ecom';
import { redirects } from '@wix/redirects';

// Public OAuth Client ID for GB Publishing Production Storefront (Safe for frontend bundles)
const WIX_CLIENT_ID = import.meta.env.VITE_WIX_CLIENT_ID || '842a5a1c-fbbe-46e2-97cf-96bb7f6d1d2a';

// Official Wix Stores Catalog Application ID
const WIX_STORES_APP_ID = '215238eb-22a5-4c36-9e7b-e7c08025e04e';

const wixClient = createClient({
  modules: { checkout, redirects },
  auth: OAuthStrategy({
    clientId: WIX_CLIENT_ID
  })
});

/**
 * Creates a Wix eCommerce Checkout session and generates the hosted Wix checkout redirect URL
 * @param {Array} cartItems - Array of items currently in the cart
 * @returns {Promise<string>} Full Wix-hosted checkout URL
 */
export async function createWixCheckoutSession(cartItems) {
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Your cart is empty');
  }

  // 1. Format line items for live Wix Stores production catalog
  const lineItems = cartItems.map(item => {
    let variantId = item.variantId;

    // Fallback: If product has variants but none explicitly selected, use first variant
    if ((!variantId || variantId === '00000000-0000-0000-0000-000000000000') && item.variants && item.variants.length > 0) {
      variantId = item.variants[0].id;
    }

    const lineItem = {
      quantity: item.quantity || 1,
      catalogReference: {
        appId: WIX_STORES_APP_ID,
        catalogItemId: item.id
      }
    };

    if (variantId && variantId !== '00000000-0000-0000-0000-000000000000') {
      lineItem.catalogReference.options = { variantId };
    }

    return lineItem;
  });

  // 2. Filter valid Wix catalog items (UUID format)
  const validItems = lineItems.filter(item => 
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.catalogReference.catalogItemId)
  );

  if (validItems.length === 0) {
    throw new Error('The selected item(s) are upcoming pre-releases not yet active in the Wix online store.');
  }

  // 3. Create the checkout session on Wix Live Production
  const createdCheckout = await wixClient.checkout.createCheckout({
    channelType: checkout.ChannelType.WEB,
    lineItems: validItems
  });

  const checkoutId = createdCheckout._id || createdCheckout.id;
  if (!checkoutId) {
    throw new Error('Failed to create checkout session on Wix');
  }

  if (!createdCheckout.lineItems || createdCheckout.lineItems.length === 0) {
    throw new Error('The items in your cart could not be found in this Wix store catalogue.');
  }

  // 4. Generate the redirect session with postFlowUrl callback
  const postFlowUrl = window.location.origin + window.location.pathname + '#thank-you';
  const redirectResult = await wixClient.redirects.createRedirectSession({
    ecomCheckout: { checkoutId },
    callbacks: {
      postFlowUrl
    }
  });

  const redirectUrl = redirectResult?.redirectSession?.fullUrl || redirectResult?.fullUrl;
  if (!redirectUrl) {
    throw new Error('Wix did not return a valid redirect URL');
  }

  return redirectUrl;
}
