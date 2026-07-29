/* =========================================================
   Oraimo Accessories Kenya — SITE CONFIGURATION
   ---------------------------------------------------------
   This is the ONLY file that should contain business details
   (name, contact numbers, address, hours, warranty, delivery,
   payment, socials, domain). Every page and script reads from
   this object at runtime — change a value here once and it
   updates the header, footer, contact page, checkout messages,
   structured data and more across the whole site.

   NOTE (static-site limitation): search engine crawlers read the
   raw HTML <head> (canonical/OG/Twitter/JSON-LD tags), which is
   generated ahead of time rather than rendered by this script.
   If you change WHATSAPP_NUMBER, PHONE_NUMBER or DOMAIN below,
   also re-run `python3 scripts/apply_config.py` (see /scripts)
   to regenerate those tags across every HTML file + sitemap.xml
   + robots.txt so search engines see the same values too.
   ========================================================= */
const ORAIMO_CONFIG = {
  businessName: "Oraimo Accessories Kenya",
  legalName: "Oraimo Accessories Kenya",
  shortName: "Oraimo Accessories",
  tagline: "Original Oraimo Accessories & Appliances",
  description: "We sell genuine Oraimo chargers, power banks, earbuds, headphones, smartwatches, home appliances, grooming products, speakers and accessories.",

  // Domain WITHOUT trailing slash
  domain: "https://oraimoaccessories.co.ke",

  // Digits only, international format, no + or spaces (used for wa.me and tel: links)
  whatsappNumber: "254712587876",
  phoneNumber: "254712587876",
  phoneDisplay: "+254 712 587 876",
  email: "info@oraimoaccessories.co.ke",

  address: {
    line1: "Information House",
    line2: "Mfangano Street",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
    full: "Information House, Mfangano Street, Nairobi, Kenya",
    short: "Information House, Mfangano Street, Nairobi"
  },

  hours: {
    weekday: "Mon–Sat: 9:00 AM – 7:00 PM",
    sunday: "Sunday: 11:00 AM – 5:00 PM",
    // machine-readable, used in LocalBusiness structured data
    schema: ["Mo-Sa 09:00-19:00", "Su 11:00-17:00"]
  },

  warranty: {
    short: "Up to 1 Year Warranty",
    badge: "Up to 1-Year Warranty",
    full: "Every product carries up to 1 year of official Oraimo warranty against manufacturing defects, excluding accidental damage, water damage and normal wear and tear."
  },

  delivery: {
    short: "Free Nairobi CBD Delivery",
    badge: "Free CBD delivery within 24hrs",
    full: "Free delivery within Nairobi CBD, delivered within 24 hours. Other Nairobi areas attract a delivery fee based on the zone you select at checkout, added to your total below.",
    // Rendered as real HTML (bold + bullet list) wherever .delivery-note
    // appears — see initFaq/DOMContentLoaded in app.js. Edit the wording
    // here; app.js just injects it as-is.
    noteHtml: "<ul>"
      + "<li><strong>FREE</strong> delivery within Nairobi CBD.</li>"
      + "<li>Nairobi (outside CBD): KSh 200\u2013500 depending on location.</li>"
      + "<li>Outside Nairobi: Delivery via courier at the customer's cost.</li>"
      + "<li>Same-day delivery within Nairobi.</li>"
      + "<li>1\u20132 days outside Nairobi.</li>"
      + "</ul>",
    // Delivery zones offered at checkout (cart drawer > Delivery Details).
    // Rendered top-to-bottom by app.js as radio options, in this order.
    //   id    — internal key, used by app.js and included in the WhatsApp order (don't change once live, or old habits/links referencing it break)
    //   label — what the customer sees as the zone name
    //   sub   — small helper text under the label
    //   fee   — delivery fee in KES. 0 = shown as "Free"
    //
    // PLACEHOLDER — every fee below except "cbd" is an estimate. Adjust,
    // rename, add, or remove zones freely to match your real rider rates
    // and the areas you actually deliver to. Keep "custom" LAST — it's the
    // catch-all fee for any area not covered by the zones above it; the
    // customer types their exact location separately in "Delivery location".
    zones: [
      { id: "cbd", label: "Nairobi CBD", sub: "Delivered within 24 hours", fee: 0 },
      { id: "near", label: "Westlands, Upperhill, South B / South C, Ngara", sub: "Delivery fee confirmed on WhatsApp", fee: 150 },
      { id: "mid", label: "Kilimani, Lavington, Eastleigh, Kasarani, Embakasi", sub: "Delivery fee confirmed on WhatsApp", fee: 200 },
      { id: "outer", label: "Karen, Langata, Runda, Ruaka, Roysambu, Donholm", sub: "Delivery fee confirmed on WhatsApp", fee: 300 },
      { id: "satellite", label: "Ngong, Rongai, Kikuyu, Ruiru, Kitengela, Athi River", sub: "Delivery fee confirmed on WhatsApp", fee: 400 },
      { id: "custom", label: "Other location", sub: "Not listed above? Add it under Delivery location below", fee: 500 }
    ]
  },

  payment: {
    methods: ["Pay on Delivery", "M-Pesa"],
    short: "Pay on Delivery Available",
    full: "Pay on Delivery is available within Nairobi. For other orders, payment is arranged directly with our team — commonly via M-Pesa — once your order is confirmed on WhatsApp. We do not process card payments on this website."
  },

  social: {
    instagram: "https://instagram.com/oraimoaccessorieske",
    facebook: "https://facebook.com/oraimoaccessorieske",
    tiktok: "https://tiktok.com/@oraimoaccessorieske"
  },

  googleMaps: {
    query: "-1.2870445,36.8281673",
    embedUrl: "https://www.google.com/maps?q=loc:-1.2870445,36.8281673&output=embed",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=-1.2870445,36.8281673"
  },

  priceRange: "KES 250 - KES 9000",

  // Shown in the "Google reviews" badge on the homepage.
  // rating/count: update these to match your real Google Business Profile numbers.
  // googleReviewUrl: the short share-link Google gives you under
  // Google Business Profile > "Get more reviews" (looks like
  // https://g.page/r/XXXXXXXXXXXXXXXX/review). Paste your real one in below —
  // until you do, this falls back to your Maps listing, which still lets
  // people find you and leave a review, just with one extra click.
  reviews: {
    rating: "4.9",
    count: 240,
    googleReviewUrl: "https://g.page/r/REPLACE-WITH-YOUR-CODE/review"
  },

  // Open Graph image dimensions (all og images are generated to this size)
  ogImage: { width: 1200, height: 630 }
};

/* Convenience helpers built from the config above */
ORAIMO_CONFIG.whatsappLink = function (message) {
  var text = message ? "?text=" + encodeURIComponent(message) : "";
  return "https://wa.me/" + ORAIMO_CONFIG.whatsappNumber + text;
};
ORAIMO_CONFIG.telLink = "tel:+" + ORAIMO_CONFIG.phoneNumber;

/* ---------------------------------------------------------
   Apply config-driven values to any element in the DOM that
   opts in via data-cfg / data-cfg-href attributes, e.g.:
     <span data-cfg="address.short"></span>
     <a data-cfg-href="whatsapp" href="#">Chat</a>
   Runs automatically on every page (see app.js initConfig()).
   --------------------------------------------------------- */
function cfgGet(path) {
  return path.split(".").reduce(function (o, k) { return (o == null ? o : o[k]); }, ORAIMO_CONFIG);
}
function applyConfig(root) {
  root = root || document;
  root.querySelectorAll("[data-cfg]").forEach(function (el) {
    var val = cfgGet(el.getAttribute("data-cfg"));
    if (val != null) el.textContent = val;
  });
  root.querySelectorAll("[data-cfg-href]").forEach(function (el) {
    var key = el.getAttribute("data-cfg-href");
    if (key === "whatsapp") el.setAttribute("href", ORAIMO_CONFIG.whatsappLink());
    else if (key === "tel") el.setAttribute("href", ORAIMO_CONFIG.telLink);
    else if (key === "email") el.setAttribute("href", "mailto:" + ORAIMO_CONFIG.email);
    else if (key === "maps") el.setAttribute("href", ORAIMO_CONFIG.googleMaps.directionsUrl);
    else if (key === "googleReview") {
      var reviewUrl = ORAIMO_CONFIG.reviews.googleReviewUrl;
      var isPlaceholder = !reviewUrl || reviewUrl.indexOf("REPLACE-WITH-YOUR-CODE") !== -1;
      el.setAttribute("href", isPlaceholder ? ORAIMO_CONFIG.googleMaps.directionsUrl : reviewUrl);
    }
    else {
      var val = cfgGet(key);
      if (val != null) el.setAttribute("href", val);
    }
  });
}