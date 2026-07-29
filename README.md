# Oraimo Accessories Kenya — Static Site

A premium, mobile-first static ecommerce site for an authorized Oraimo accessories
dealer in Kenya. No backend, no database server, no payment gateway — checkout
happens through a prefilled WhatsApp message.

## Quick start

Open `index.html` in a browser, or deploy the whole folder as-is to:

- **Cloudflare Pages** — drag & drop the folder, or connect a git repo
- **Netlify** — drag & drop the folder into the Netlify dashboard
- **Vercel** — `vercel deploy` from this folder
- **GitHub Pages** — push to a repo and enable Pages on the `main` branch

No build step is required. Every file is plain HTML/CSS/JS.

## The one file you'll actually edit: `js/config.js`

Business details (name, WhatsApp/phone number, address, hours, warranty,
delivery, payment methods, socials, domain) live in **one object**,
`ORAIMO_CONFIG`, in `js/config.js`. Everything user-visible — the header,
footer, contact page, cart checkout message, and structured data — reads
from it at runtime via `data-cfg="..."` / `data-cfg-href="..."` attributes,
so changing a value there updates the whole storefront.

```js
const ORAIMO_CONFIG = {
  businessName: "Oraimo Accessories Kenya",
  domain: "https://oraimoaccessories.co.ke",
  whatsappNumber: "254794861886",   // digits only, no + or spaces
  phoneNumber: "254794861886",
  address: { short: "Information House, Mfangano Street, Nairobi", ... },
  warranty: { short: "Up to 1 Year Warranty", ... },
  delivery: { short: "Free Nairobi CBD Delivery", ... },
  payment:  { short: "Pay on Delivery Available", ... },
  social: { instagram: "...", facebook: "...", tiktok: "..." },
  ...
};
```

**Important static-site caveat:** search engines read the raw HTML `<head>`
(canonical URL, Open Graph tags, JSON-LD) directly — they don't execute your
JS the same way a browser does for every crawler. So if you change
`whatsappNumber`, `phoneNumber`, or `domain` in `config.js`, also find &
replace the same values across the HTML `<head>` blocks (canonical, og:url,
og:title/description, JSON-LD in `index.html`) and in `sitemap.xml` /
`robots.txt`, so crawlers and social-share previews see the same values as
your visitors. Everything *inside* the page body (footer, header, contact
info, checkout messages) is already single-sourced from `config.js` and
needs no manual edit.

## Product photos — `images/products/<category>/<slug>.webp`

Every product now has a dedicated photo slot, organized by category:

```
images/products/
  powerbanks/oraimo-power-nova-q31-powerbank.webp
  powerbanks/oraimo-powerbank-traveller-15-15w.webp
  earbuds/...
  smartwatches/...
  chargers/...
  ... (16 category folders, 71 files total — one per product)
```

**To add a real photo:** just overwrite the matching file with a real
product photo, saved as **.webp**, same filename, same folder. No code
change needed — the path is derived automatically from each product's
`category` and `slug` in `products-data.js`
(`images/products/{category}/{slug}.webp`), so adding a new product to the
catalog and dropping a same-named `.webp` file into its category folder is
enough to give it a photo too.

Recommended source size: roughly **800×800px, square, under ~150KB**, plain
or lightly-shadowed background so it sits well on the site's tinted tile
backgrounds. If a file is ever missing or fails to load, the page falls
back cleanly to the existing icon-tile artwork (`onerror="this.remove()"`
on the `<img>`) — so nothing breaks if a photo hasn't been added yet.

Every product currently has a **placeholder image** in place (branded
gradient tile + category label + "Product photo coming soon" caption) —
generated during this audit so the catalog isn't full of broken image
icons while real photography is being gathered. Replace them at your own
pace; nothing else needs to change.

## Product catalog

Everything customers see is generated from **`js/products-data.js`** — a
single JS file holding one big `ORAIMO_DATA` object with `categories` and
`products`. To add, remove, or update a product, edit the array in that
file. Each product looks like:

```js
{
  "id": "powerbanks-08",
  "sku": "ORM-POW-008",
  "slug": "oraimo-power-nova-q31-powerbank",
  "name": "Oraimo Power Nova Q31 Power Bank",
  "brand": "Oraimo",
  "category": "powerbanks",
  "categoryName": "Power Banks",
  "icon": "powerbank",
  "gradient": "g-lime",
  "price": 4300,
  "oldPrice": 5200,
  "description": "...",
  "features": ["...", "..."],
  "specifications": {"Brand":"Oraimo", "Warranty":"Up to 1 Year Official Warranty"},
  "stock": 14,
  "rating": 4.7,
  "reviews": 52,
  "badge": "popular",
  "featured": true,
  "popular": true,
  "newArrival": false,
  "color": "Black",
  "relatedProducts": ["powerbanks-01","powerbanks-06"]
}
```

`icon` must match one of the keys in `js/icons.js`. `sku` prefixes must be
**unique per category** — each category has its own 3-letter code (see the
list inside `products-data.js`); reusing a prefix across two categories
causes duplicate SKUs (this was audited and fixed — see below).
`gradient` picks the tile color theme (`g-lime`, `g-mint`, `g-emerald`,
`g-teal`, `g-forest`, `g-olive`, `g-slate`, `g-amber`). No product photos
are required — every product renders as a clean abstract icon tile.

Homepage "Top 2 best sellers" spotlight (Power Nova Q31 + Traveller 15) is
driven by the `spotlightSlugs` array inside `index.html`'s inline script —
change the two slugs there to feature different products.

## Structure

```
index.html          Home (incl. bestseller spotlight, Organization/LocalBusiness schema)
shop.html            Full catalog with filters, sorting, search
product.html         Dynamic product detail page (?slug=...), incl. Product + Breadcrumb schema
about.html           About the shop
contact.html         Contact form + WhatsApp + map
faq.html             Accordion FAQ
privacy.html         Privacy policy
terms.html           Terms of service
404.html             Custom not-found page (noindex, follow)
robots.txt           Search engine crawl rules
sitemap.xml          Every static page, category and product URL, with lastmod/priority/changefreq
manifest.json        PWA web app manifest
browserconfig.xml    Windows tile config
css/style.css        Design system (colors, type, components, animations)
js/config.js         ⭐ Single source of truth for all business info
js/products-data.js  Product database (edit this to manage the catalog)
js/icons.js          Icon library used for category/product art
js/app.js            Cart, wishlist, search, WhatsApp checkout, all shared logic
images/              Favicons, PWA icons, mstile, and generated Open Graph images
images/products/     Product photos, one .webp per product, organized by category
                     folder (see "Product photos" section above)
partials/            Reference copies of the header/footer/cart-drawer markup
                     (kept in sync with the identical markup duplicated into
                     every page — this is a static site with no server-side
                     includes, so header/footer edits must be applied to
                     each HTML page individually; partials/ is the reference
                     copy to diff against)
```

## How checkout works

1. Visitor adds products to the cart (stored in `localStorage`, so it survives
   page reloads and closing the tab).
2. The cart drawer shows a **live preview** of the WhatsApp message as it's
   built.
3. Visitor fills in name, phone and delivery location, then taps **Checkout
   via WhatsApp**.
4. `js/app.js`'s `buildWhatsAppMessage()` formats everything (products, qty,
   price, subtotal, total, customer details) into one message and opens
   `https://wa.me/<number>?text=<message>` (number from `ORAIMO_CONFIG`).

## Open Graph / social sharing images

`images/og-home.png`, `images/og-product.png` and `images/og-category.png`
are static, pre-rendered 1200×630 branded images referenced from each
page's `<head>`. Product pages currently share the generic `og-product.png`
template rather than a per-product render — true per-product OG images
(with the product name/price baked into the image) require server-side
image generation, which isn't possible on a plain static host. If you later
move to Cloudflare Pages Functions or a similar edge runtime, a function
that renders `og-product.png?slug=...` on the fly is the natural upgrade
path; until then, `product.html` still updates its canonical URL, OG/Twitter
title & description, and Product + BreadcrumbList JSON-LD dynamically per
product — only the image stays generic.

## Performance & SEO notes

- No image downloads for products — the whole catalog renders from inline SVG
  + CSS gradients, keeping the site extremely light and fast.
- Fonts are loaded from Google Fonts with `preconnect`; you can self-host them
  for an even faster first paint if you prefer zero third-party requests.
- Each page carries its own meta description, canonical URL, Open Graph
  (incl. og:image) and Twitter Card tags. `index.html` includes Organization +
  LocalBusiness schema; `product.html` injects Product + BreadcrumbList schema
  per item at runtime.
- `sitemap.xml` lists every static page, every category filter URL and every
  product URL (94 entries) with `lastmod`/`changefreq`/`priority` — regenerate
  it whenever you add products (there's no script bundled for this by
  default; regenerate by hand or ask your developer to script it from
  `products-data.js`, the same way it was built during this audit).
- All decorative SVG icons are marked `aria-hidden="true" focusable="false"`
  (via `js/icons.js`'s `icon()` helper) so screen readers don't announce raw
  path data — their meaning is carried by adjacent text or a parent
  `aria-label`.
- Icon buttons use 44×44px touch targets (WCAG 2.5.5).

## Known limitation: duplicated header/footer markup

Because this is a zero-build static site, the header, footer, cart drawer
and search overlay markup is duplicated verbatim into all 9 pages rather
than included from `partials/`. This keeps the site fast and crawlable with
no build step, at the cost of needing to apply markup changes (not content —
content is config-driven) to each page. `partials/header.html`,
`partials/footer.html` and `partials/cart-drawer.html` are kept as the
reference copies — diff a page against them if you're unsure whether it's
drifted.
