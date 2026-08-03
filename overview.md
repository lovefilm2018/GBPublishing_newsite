# 📐 GB Publishing Modernization: Technical & Architectural Overview

## 1. Executive Summary & Strategy
The **GB Publishing** project uses a **Dual Champion / Challenger Architecture Strategy**:
* **Challenger Storefront (`GBPublishing_newsite`)**: A custom, ultra-fast React/Vite single-page web application (SPA) hosted on **GitHub Pages**. Designed to maximize direct-to-consumer (DTC) book sales, bypass 3rd-party distributor fees, and deliver instant sub-100ms page load speeds.
* **Champion Site (Wix Legacy)**: The original Wix site (`gbpublishing.co.uk`) retained by the store owner for legacy blogging (`/blog`) and backend store management.

---

## 2. System Architecture & Tech Stack

```
 ┌─────────────────────────────────────────────────────────┐
 │                   GITHUB PAGES (HOST)                   │
 │   Challenger Storefront SPA (Vite + React + Tailwind)   │
 └─────────────┬─────────────────────────────▲─────────────┘
               │ Live REST Data Sync         │ Auto CI/CD Build & Deploy
               ▼                             │
 ┌───────────────────────────┐ ┌─────────────┴─────────────┐
 │    WIX STORES HEADLESS    │ │       GITHUB REPO         │
 │     REST API / BACKEND    │ │ lovefilm2018/             │
 │ (Products, Inventory,     │ │  GBPublishing_newsite     │
 │  Collections, Dashboard)  │ └───────────────────────────┘
 └───────────────────────────┘
```

### Core Technologies
1. **Frontend Framework:** React 18 + Vite
2. **Styling & Design System:** Tailwind CSS v3 + Lucide Icons + Google Fonts (Playfair Display serif headlines & Inter body font)
3. **Hosting & Deployment:** GitHub Pages with automated GitHub Actions workflow (`.github/workflows/deploy.yml`) on every push to `main`
4. **Data Engine / CMS Integration:** Wix Stores REST API (Headless Query Mode) with local JSON caching fallback

---

## 3. Data Integration & Headless API Pipeline

### Live Wix REST API Connection (`src/services/wixClient.js`)
* **Product Data Endpoint:** `POST https://www.wixapis.com/stores/v1/products/query`
* **Collections Endpoint:** `POST https://www.wixapis.com/stores/v1/collections/query`
* **Authentication:** Authenticates securely via `WIX_API_KEY` and `WIX_SITE_ID` headers.

### Collection & Imprint Mapping Logic
Wix REST products return array lists of internal collection UUIDs (e.g., `collectionIds: ["5499654e-a861..."]`).
1. `wixClient.js` fetches all Wix Collections in parallel to construct a `{ [uuid]: "Collection Name" }` dictionary.
2. Collection names are dynamically mapped into the storefront’s **5 Core Imprints**:
   * 🍳 `Cookbooks & Food`
   * 🎨 `Children's & Picture Books`
   * 🌌 `Fiction, Young Adult & Sci-Fi`
   * 📖 `Non-Fiction & Memoir`
   * ✒️ `Poetry & Fine Art`
3. Includes a fallback `PRODUCT_NAME_OVERRIDES` layer to fix books miscategorised in Wix Dashboard data.

### Offline & Resilience Strategy
* If the Wix API is unreachable, offline, or rate-limited, the application seamlessly falls back to a pre-built static dataset (`catalog.json`) containing all **100+ titles and 300+ variants**, ensuring 100% uptime.

---

## 4. Key E-Commerce & UX Features

1. **Direct DTC Conversion Boosters:**
   * **Perks Ribbon:** Highlights direct-buy incentives (author-signed copies, free custom bookmarks, free UK shipping on £25+).
   * **Custom Shopping Cart Drawer (`CartDrawer.jsx`):** Slide-over cart supporting multi-format choices (Hardcover, Paperback, Collector Signed Edition).
2. **Interactive Media & Reading Features:**
   * **Sample Reader Modal (`SampleReaderModal.jsx`):** Lets users preview sample chapter excerpts directly inside the browser.
   * **Detail Modal (`BookModal.jsx`):** Displays full high-res galleries, ISBNs, author bios, and related title recommendations.
3. **Dedicated Views:**
   * **Art Gallery View (`ArtGalleryView.jsx`):** Dedicated showcase for fine art prints, A2/A3 illustrations, and coffee table art books.
   * **About View (`AboutView.jsx`):** Company background, publishing mission, and submission guidelines for new indie authors.
4. **Wix Blog Integration:**
   * The top navbar contains a direct link to `https://www.gbpublishing.co.uk/blog`, opening the Wix journal so the owner can keep posting blog articles on Wix without needing a separate CMS.

---

## 5. Repository & Live URLs

* **Live Mockup Site URL:** [https://lovefilm2018.github.io/GBPublishing_newsite/](https://lovefilm2018.github.io/GBPublishing_newsite/)
* **Challenger GitHub Repo:** `lovefilm2018/GBPublishing_newsite`
* **Champion Wix Staging Dashboard:** `https://manage.wix.com/dashboard/dd68067c-f9a8-445f-bc9c-e35dff588dd2`

---

## 6. Next Steps for Final Production Cutover

1. **Payment Gateway Integration:** Wire the shopping cart drawer to Wix Headless Checkout, Shopify Buy Button, or Stripe/PayPal for live payment processing.
2. **Domain Cutover:** Point the custom domain (`gbpublishing.co.uk` or a secondary domain) to GitHub Pages and enable automatic HTTPS.
