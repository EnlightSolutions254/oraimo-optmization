/* =========================================================
   Oraimo Accessories Kenya — shared app logic
   Business details (WhatsApp number, name, etc.) live in ONE
   place: config.js (ORAIMO_CONFIG). Edit that file, not this one.
   ========================================================= */
const WHATSAPP_NUMBER = ORAIMO_CONFIG.whatsappNumber;
const STORE_NAME = ORAIMO_CONFIG.businessName;
/* Delivery fee depends on the zone the customer picks at checkout.
   The full list of zones (id, label, sub-label, fee) lives in ONE place —
   config.js — ORAIMO_CONFIG.delivery.zones. Add/remove/re-price zones
   there; this file just looks them up. */
function zoneList(){
  return ORAIMO_CONFIG.delivery.zones;
}
function zoneById(id){
  return zoneList().find(z => z.id === id) || zoneList()[0];
}
function deliveryFeeFor(zoneId){
  return zoneById(zoneId).fee;
}
function zoneLabelFor(zoneId){
  return zoneById(zoneId).label;
}
function selectedZone(){
  return document.querySelector('input[name="co-zone"]:checked')?.value || zoneList()[0].id;
}
/* Builds the zone-options radio list in the cart drawer from
   ORAIMO_CONFIG.delivery.zones, so the markup never has to be hand-edited
   when a zone is added, renamed, or re-priced. */
function renderZoneOptions(){
  const container = document.querySelector(".zone-options");
  if(!container) return;
  const zones = zoneList();
  const checkedId = document.querySelector('input[name="co-zone"]:checked')?.value || zones[0].id;
  container.innerHTML = zones.map(z => `
    <label class="zone-option${z.id===checkedId ? " active" : ""}" data-zone-option="${z.id}">
      <input type="radio" name="co-zone" value="${z.id}"${z.id===checkedId ? " checked" : ""}>
      <span class="zone-option-main">
        <span class="zone-option-title">${z.label}</span>
        <span class="zone-option-sub">${z.sub}</span>
      </span>
      <span class="zone-option-fee${z.fee===0 ? " zone-option-fee-free" : ""}">${z.fee===0 ? "Free" : "+ " + fmtKES(z.fee)}</span>
    </label>`).join("");
}

/* ---------------- Utilities ---------------- */
function fmtKES(n){
  return "KES " + Number(n).toLocaleString("en-KE", {maximumFractionDigits:0});
}
function byId(id){ return ORAIMO_DATA.products.find(p=>p.id===id); }
function bySlug(slug){ return ORAIMO_DATA.products.find(p=>p.slug===slug); }
function catMeta(key){ return ORAIMO_DATA.categories.find(c=>c.key===key); }
function qs(name){ return new URLSearchParams(location.search).get(name); }

/* Kenyan mobile numbers: 07XXXXXXXX / 01XXXXXXXX, or the same with a
   254 / +254 country code instead of the leading 0. Spaces and dashes
   in what the person typed are ignored before testing. */
function isValidKenyanPhone(v){
  const cleaned = String(v||"").replace(/[\s-]/g, "");
  return /^(?:\+254|254|0)(?:7\d{8}|1\d{8})$/.test(cleaned);
}

/* ---------------- Cart (localStorage) ---------------- */
const Cart = {
  KEY:"oraimo_cart_v1",
  read(){ try{ return JSON.parse(localStorage.getItem(this.KEY)) || []; }catch(e){ return []; } },
  write(items){ localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent("cart:change")); },
  count(){ return this.read().reduce((s,i)=>s+i.qty,0); },
  subtotal(){ return this.read().reduce((s,i)=>s+i.qty*i.price,0); },
  add(product, qty=1){
    const items = this.read();
    const existing = items.find(i=>i.id===product.id);
    if(existing){ existing.qty += qty; }
    else{ items.push({id:product.id, name:product.name, price:product.price, icon:product.icon, gradient:product.gradient, qty}); }
    this.write(items);
  },
  setQty(id, qty){
    let items = this.read();
    if(qty<=0){ items = items.filter(i=>i.id!==id); }
    else{ const it = items.find(i=>i.id===id); if(it) it.qty = qty; }
    this.write(items);
  },
  remove(id){ this.write(this.read().filter(i=>i.id!==id)); },
  clear(){ this.write([]); }
};

/* ---------------- Wishlist (localStorage) ---------------- */
const Wishlist = {
  KEY:"oraimo_wishlist_v1",
  read(){ try{ return JSON.parse(localStorage.getItem(this.KEY)) || []; }catch(e){ return []; } },
  toggle(id){
    let items = this.read();
    if(items.includes(id)) items = items.filter(x=>x!==id); else items.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent("wishlist:change"));
    return items.includes(id);
  },
  has(id){ return this.read().includes(id); }
};

/* ---------------- Recently viewed ---------------- */
const Recent = {
  KEY:"oraimo_recent_v1",
  add(id){
    let items = JSON.parse(localStorage.getItem(this.KEY) || "[]");
    items = items.filter(x=>x!==id);
    items.unshift(id);
    items = items.slice(0,8);
    localStorage.setItem(this.KEY, JSON.stringify(items));
  },
  read(){ try{ return JSON.parse(localStorage.getItem(this.KEY)) || []; }catch(e){ return []; } }
};

/* ---------------- Toast ---------------- */
function toast(msg){
  let el = document.querySelector(".toast");
  if(!el){
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.innerHTML = icon("check") + "<span>"+msg+"</span>";
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(()=>el.classList.remove("show"), 2400);
}

/* ---------------- WhatsApp message builder ----------------
   Plain, comma-free numbers and no emoji: some phones render
   emoji as a broken "?" box in a wa.me prefilled message, and
   thousands-comma formatting reads oddly once URL-encoded. */
function fmtKESPlain(n){
  return "KES " + Math.round(Number(n));
}
function buildWhatsAppMessage({name, phone, location:loc, zone, items}){
  let lines = [];
  lines.push(`Hello ${STORE_NAME}`);
  lines.push("I would like to place the following order.");
  lines.push("");
  lines.push("*ORDER SUMMARY*");
  items.forEach((it,i)=>{
    lines.push(`${i+1}. ${it.name}`);
    lines.push(`Quantity: ${it.qty}`);
    lines.push(`Price: ${fmtKESPlain(it.price)}`);
    lines.push(`Subtotal: ${fmtKESPlain(it.qty*it.price)}`);
    lines.push("");
  });
  const subtotal = items.reduce((s,i)=>s+i.qty*i.price,0);
  const deliveryFee = deliveryFeeFor(zone);
  const zoneLabel = zoneLabelFor(zone);
  lines.push(`Subtotal: ${fmtKESPlain(subtotal)}`);
  lines.push(`Delivery (${zoneLabel}): ${deliveryFee ? fmtKESPlain(deliveryFee) : "Free"}`);
  lines.push(`*TOTAL: ${fmtKESPlain(subtotal + deliveryFee)}*`);
  lines.push("");
  lines.push("*DELIVERY DETAILS*");
  lines.push(`Name: ${name || "Not provided"}`);
  lines.push(`Phone: ${phone || "Not provided"}`);
  lines.push(`Location: ${loc || "Not provided"}`);
  lines.push(`Zone: ${zoneLabel}`);
  lines.push("");
  lines.push("Thank you.");
  return lines.join("\n");
}
function waLink(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ---------------- Product photo path ----------------
   Real photos live at images/products/<category>/<slug>.webp.
   Until a real photo is dropped in, the placeholder generated during
   the site audit sits there; if a file is ever missing, onerror removes
   the <img> so the icon tile shows through cleanly instead of a broken
   image icon. */
function productPhotoPath(p){
  return "images/products/" + p.category + "/" + p.slug + ".webp";
}

/* ---------------- Product card markup ---------------- */
function productCard(p){
  const badgeHtml = p.badge==="new" ? `<span class="badge new">New</span>` : (p.badge==="popular" ? `<span class="badge popular">Bestseller</span>` : "");
  const wished = Wishlist.has(p.id) ? "active" : "";
  return `
  <article class="product-card" data-reveal="zoom">
    <div class="product-media ${p.gradient}">
      ${badgeHtml}
      <button class="wishlist-btn ${wished}" data-wish="${p.id}" aria-label="Toggle wishlist">${icon("heart")}</button>
      ${icon(p.icon)}
      <img class="product-photo" src="${productPhotoPath(p)}" alt="${p.name}" loading="lazy" decoding="async" onerror="this.remove()">
      <a href="product.html?slug=${p.slug}" class="quick-view-btn">Quick view</a>
    </div>
    <div class="product-info">
      <span class="product-cat">${p.categoryName}</span>
      <a href="product.html?slug=${p.slug}"><h3 class="product-name">${p.name}</h3></a>
      <div class="product-rating">${icon("star")} ${p.rating} <span style="color:var(--stone-light)">(${p.reviews})</span></div>
      <div class="product-price-row">
        <span class="price">${fmtKES(p.price)}</span>
        ${p.oldPrice ? `<span class="old-price">${fmtKES(p.oldPrice)}</span>` : ""}
      </div>
      <span class="stock-badge">${p.stock>0 ? "In stock" : "Out of stock"}</span>
      <button class="add-btn" data-add="${p.id}">${icon("bag")} Buy Now</button>
    </div>
  </article>`;
}

function renderGrid(container, products){
  if(!container) return;
  if(products.length===0){
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--stone)">
      <p style="font-weight:600;font-size:1.05rem;color:var(--charcoal)">No products match those filters</p>
      <p>Try widening your price range or clearing a filter.</p>
    </div>`;
    return;
  }
  container.innerHTML = products.map(productCard).join("");
  observeReveals();
}

/* ---------------- Scroll reveal ---------------- */
function observeReveals(){
  const els = document.querySelectorAll("[data-reveal]:not(.in)");
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, {threshold:.12});
  els.forEach(el=>io.observe(el));
}

/* ---------------- Header / nav wiring ---------------- */
function initHeader(){
  const header = document.querySelector(".site-header");
  const onScroll = ()=>{
    if(!header) return;
    if(window.scrollY > 12) header.classList.add("solid"); else header.classList.remove("solid");
    const bt = document.querySelector(".back-top");
    if(bt){ if(window.scrollY>600) bt.classList.add("show"); else bt.classList.remove("show"); }
  };
  document.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mobileNav = document.querySelector(".mobile-nav");
  const scrim = document.querySelector(".scrim");
  function closeMobile(){ mobileNav?.classList.remove("open"); scrim?.classList.remove("open"); }
  hamburgerBtn?.addEventListener("click", ()=>{
    mobileNav?.classList.toggle("open");
    scrim?.classList.toggle("open");
  });
  scrim?.addEventListener("click", closeMobile);
  document.querySelectorAll(".mobile-nav a").forEach(a=>a.addEventListener("click", closeMobile));

  // search overlay
  const searchBtns = document.querySelectorAll("[data-open-search]");
  const searchOverlay = document.querySelector(".search-overlay");
  const searchInput = document.querySelector(".search-input-row input");
  const searchResults = document.querySelector(".search-results");
  function openSearch(){ searchOverlay?.classList.add("open"); setTimeout(()=>searchInput?.focus(),150); }
  function closeSearch(){ searchOverlay?.classList.remove("open"); }
  searchBtns.forEach(b=>b.addEventListener("click", openSearch));
  searchOverlay?.addEventListener("click", (e)=>{ if(e.target===searchOverlay) closeSearch(); });
  document.querySelector(".search-close")?.addEventListener("click", closeSearch);
  document.addEventListener("keydown", (e)=>{
    if(e.key==="/" && document.activeElement.tagName!=="INPUT"){ e.preventDefault(); openSearch(); }
    if(e.key==="Escape"){ closeSearch(); closeMobile(); closeCart(); }
  });
  searchInput?.addEventListener("input", ()=>{
    const term = searchInput.value.trim().toLowerCase();
    if(term.length<1){ searchResults.innerHTML = `<div class="search-hint">Try "powerbank", "earbuds", "watch"...</div>`; return; }
    const matches = ORAIMO_DATA.products.filter(p=>p.name.toLowerCase().includes(term) || p.categoryName.toLowerCase().includes(term)).slice(0,8);
    if(matches.length===0){ searchResults.innerHTML = `<div class="search-hint">No products found for "${searchInput.value}"</div>`; return; }
    searchResults.innerHTML = matches.map(p=>`
      <a href="product.html?slug=${p.slug}" class="search-result-item">
        <div class="tile ${p.gradient}" style="position:relative;overflow:hidden;width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="width:20px;height:20px;display:block">${icon(p.icon)}</span>
          <img class="product-photo" src="${productPhotoPath(p)}" alt="" loading="lazy" decoding="async" onerror="this.remove()">
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;font-size:.85rem;">${p.name}</div>
          <div style="font-size:.76rem;color:var(--stone-light)">${p.categoryName}</div>
        </div>
        <div style="font-weight:700;font-size:.85rem;">${fmtKES(p.price)}</div>
      </a>`).join("");
  });

  // back to top
  document.querySelector(".back-top")?.addEventListener("click", ()=>window.scrollTo({top:0,behavior:"smooth"}));

  updateCartBadges();
  document.addEventListener("cart:change", updateCartBadges);
}

function updateCartBadges(){
  const n = Cart.count();
  document.querySelectorAll(".cart-count, .bn-cart-badge").forEach(el=>{
    el.textContent = n;
    el.style.display = n>0 ? "flex" : "none";
  });
}

/* ---------------- Cart drawer ---------------- */
function renderCartDrawer(){
  const itemsEl = document.querySelector(".cart-items");
  const summaryEl = document.querySelector(".cart-summary");
  if(!itemsEl) return;
  const items = Cart.read();
  if(items.length===0){
    itemsEl.innerHTML = `<div class="cart-empty">${icon("bag")}<p style="font-weight:600;color:var(--charcoal)">Your order list is empty</p><p>Browse the shop and add products you love.</p><a href="shop.html" class="btn btn-primary btn-sm">Start shopping</a></div>`;
    if(summaryEl) summaryEl.style.display = "none";
    setCartStep("review");
    return;
  }
  if(summaryEl) summaryEl.style.display = "block";
  itemsEl.innerHTML = items.map(it=>`
    <div class="cart-item" data-item="${it.id}">
      <div class="tile ${it.gradient}">${icon(it.icon)}</div>
      <div class="cart-item-info">
        <div class="name">${it.name}</div>
        <div class="unit">${fmtKES(it.price)} each</div>
        <div class="qty-row">
          <button class="qty-btn" data-qty-dec="${it.id}">−</button>
          <span class="qty-val">${it.qty}</span>
          <button class="qty-btn" data-qty-inc="${it.id}">+</button>
          <button class="remove-btn" data-remove="${it.id}">Remove</button>
        </div>
      </div>
      <div class="cart-line-total">${fmtKES(it.price*it.qty)}</div>
    </div>`).join("");

  const subtotal = Cart.subtotal();
  const zone = selectedZone();
  const deliveryFee = deliveryFeeFor(zone);
  const deliveryRow = document.querySelector(".summary-delivery-row");
  if(deliveryRow){
    deliveryRow.style.display = deliveryFee > 0 ? "flex" : "none";
    const feeEl = document.querySelector(".summary-delivery");
    if(feeEl) feeEl.textContent = deliveryFee ? fmtKES(deliveryFee) : "Free";
  }
  document.querySelector(".summary-subtotal").textContent = fmtKES(subtotal);
  document.querySelector(".summary-total").textContent = fmtKES(subtotal + deliveryFee);

}

function setCartStep(step){
  document.querySelector(".cart-drawer")?.setAttribute("data-step", step);
  if(step === "review"){
    // scroll the item list back to top when returning from the details step
    document.querySelector(".cart-items")?.scrollTo({top:0});
  }
}

function openCart(){ document.querySelector(".cart-drawer")?.classList.add("open"); document.querySelector(".scrim-cart")?.classList.add("open"); setCartStep("review"); renderCartDrawer(); }
function closeCart(){ document.querySelector(".cart-drawer")?.classList.remove("open"); document.querySelector(".scrim-cart")?.classList.remove("open"); }

function initCart(){
  document.querySelectorAll("[data-open-cart]").forEach(b=>b.addEventListener("click", openCart));
  document.querySelector(".cart-close")?.addEventListener("click", closeCart);
  document.querySelector(".scrim-cart")?.addEventListener("click", closeCart);

  document.querySelector("#proceed-checkout-btn")?.addEventListener("click", ()=>{
    if(Cart.read().length===0){ toast("Your order list is empty"); return; }
    setCartStep("details");
    setTimeout(()=>document.querySelector("#co-name")?.focus(), 300);
  });
  document.querySelector("#cart-back-btn")?.addEventListener("click", ()=> setCartStep("review"));

  renderZoneOptions();
  document.querySelector(".zone-options")?.addEventListener("change", (e)=>{
    if(e.target.name !== "co-zone") return;
    document.querySelectorAll(".zone-option").forEach(opt=>{
      opt.classList.toggle("active", opt.querySelector('input[name="co-zone"]').checked);
    });
    renderCartDrawer();
  });

  document.body.addEventListener("click", (e)=>{
    const addBtn = e.target.closest("[data-add]");
    if(addBtn){
      const p = byId(addBtn.dataset.add);
      if(p){
        Cart.add(p,1);
        toast(`Added ${p.name} to your order list`);
        addBtn.classList.add("added");
        addBtn.innerHTML = icon("check") + " Added";
        setTimeout(()=>{ addBtn.classList.remove("added"); addBtn.innerHTML = icon("bag") + " Buy Now"; },1400);
      }
    }
    const wishBtn = e.target.closest("[data-wish]");
    if(wishBtn){
      const active = Wishlist.toggle(wishBtn.dataset.wish);
      wishBtn.classList.toggle("active", active);
      toast(active ? "Saved to wishlist" : "Removed from wishlist");
    }
    const incBtn = e.target.closest("[data-qty-inc]");
    if(incBtn){ const it = Cart.read().find(i=>i.id===incBtn.dataset.qtyInc); if(it) Cart.setQty(it.id, it.qty+1); renderCartDrawer(); }
    const decBtn = e.target.closest("[data-qty-dec]");
    if(decBtn){ const it = Cart.read().find(i=>i.id===decBtn.dataset.qtyDec); if(it) Cart.setQty(it.id, it.qty-1); renderCartDrawer(); }
    const remBtn = e.target.closest("[data-remove]");
    if(remBtn){ Cart.remove(remBtn.dataset.remove); renderCartDrawer(); toast("Removed from order list"); }
  });

  ["input"].forEach(evt=>{
    document.querySelector("#co-name")?.addEventListener(evt, renderCartDrawer);
    document.querySelector("#co-phone")?.addEventListener(evt, renderCartDrawer);
    document.querySelector("#co-location")?.addEventListener(evt, renderCartDrawer);
  });

  const phoneInput = document.querySelector("#co-phone");
  const phoneError = document.querySelector("#co-phone-error");
  function validatePhoneField(showValid){
    if(!phoneInput) return true;
    const val = phoneInput.value.trim();
    if(val === ""){
      phoneInput.classList.remove("invalid");
      phoneError?.classList.remove("show");
      return false;
    }
    const ok = isValidKenyanPhone(val);
    phoneInput.classList.toggle("invalid", !ok);
    phoneError?.classList.toggle("show", !ok);
    return ok;
  }
  phoneInput?.addEventListener("input", ()=>validatePhoneField());
  phoneInput?.addEventListener("blur", ()=>validatePhoneField());

  document.querySelector("#checkout-btn")?.addEventListener("click", (e)=>{
    e.preventDefault();
    const items = Cart.read();
    if(items.length===0){ toast("Your order list is empty"); return; }
    const name = document.querySelector("#co-name")?.value.trim();
    const phone = document.querySelector("#co-phone")?.value.trim();
    const loc = document.querySelector("#co-location")?.value.trim();
    if(!name || !loc){
      toast("Please fill in your name & delivery location");
      document.querySelector(!name ? "#co-name" : "#co-location")?.focus();
      return;
    }
    if(!isValidKenyanPhone(phone)){
      toast("Please enter a valid Kenyan mobile number");
      phoneInput?.classList.remove("invalid");
      void phoneInput?.offsetWidth; // restart the shake animation even if already marked invalid
      phoneInput?.classList.add("invalid");
      phoneError?.classList.add("show");
      phoneInput?.focus();
      return;
    }
    const zone = selectedZone();
    const msg = buildWhatsAppMessage({name,phone,location:loc,zone,items});
    window.open(waLink(msg), "_blank");

    Cart.clear();
    const nameInput = document.querySelector("#co-name");
    const locInput = document.querySelector("#co-location");
    if(nameInput) nameInput.value = "";
    if(phoneInput) phoneInput.value = "";
    if(locInput) locInput.value = "";
    phoneInput?.classList.remove("invalid");
    phoneError?.classList.remove("show");
    const defaultZoneId = zoneList()[0].id;
    const defaultRadio = document.querySelector(`input[name="co-zone"][value="${defaultZoneId}"]`);
    if(defaultRadio){
      defaultRadio.checked = true;
      document.querySelectorAll(".zone-option").forEach(opt=>{
        opt.classList.toggle("active", opt.dataset.zoneOption === defaultZoneId);
      });
    }
    toast("Order sent! Your order list has been cleared.");
  });

  document.addEventListener("cart:change", renderCartDrawer);
}

/* ---------------- Newsletter (no backend — friendly confirmation) ---------------- */
function initNewsletter(){
  document.querySelectorAll(".newsletter-form").forEach(form=>{
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      toast("Thanks! You're subscribed to Oraimo Kenya deals.");
      form.reset();
    });
  });
}

/* ---------------- Contact form -> WhatsApp ---------------- */
function initContactForm(){
  const form = document.querySelector("#contact-form");
  form?.addEventListener("submit", (e)=>{
    e.preventDefault();
    const name = form.querySelector("#c-name").value.trim();
    const email = form.querySelector("#c-email").value.trim();
    const msg = form.querySelector("#c-message").value.trim();
    const text = `Hello ${STORE_NAME}!\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`;
    window.open(waLink(text), "_blank");
  });
}

/* ---------------- FAQ accordion ---------------- */
function initFaq(){
  document.querySelectorAll(".faq-item").forEach(item=>{
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q?.addEventListener("click", ()=>{
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(o=>{ o.classList.remove("open"); o.querySelector(".faq-a").style.maxHeight=null; });
      if(!isOpen){ item.classList.add("open"); a.style.maxHeight = a.scrollHeight+"px"; }
    });
  });
}

/* ---------------- Init on every page ---------------- */
document.addEventListener("DOMContentLoaded", ()=>{
  applyConfig();
  document.querySelectorAll(".delivery-note").forEach(el=>{ el.innerHTML = ORAIMO_CONFIG.delivery.noteHtml; });
  initHeader();
  initCart();
  initNewsletter();
  initContactForm();
  initFaq();
  observeReveals();
  updateCartBadges();

  // ripple effect on buttons
  document.body.addEventListener("click", (e)=>{
    const btn = e.target.closest(".btn");
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size+"px";
    ripple.style.left = (e.clientX-rect.left-size/2)+"px";
    ripple.style.top = (e.clientY-rect.top-size/2)+"px";
    btn.appendChild(ripple);
    setTimeout(()=>ripple.remove(),650);
  });

  // animated counters
  document.querySelectorAll("[data-count]").forEach(el=>{
    const target = parseInt(el.dataset.count,10);
    const io = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          let cur = 0; const step = Math.max(1, Math.round(target/60));
          const t = setInterval(()=>{ cur += step; if(cur>=target){ cur=target; clearInterval(t);} el.textContent = cur.toLocaleString(); }, 20);
          io.unobserve(el);
        }
      });
    }, {threshold:.4});
    io.observe(el);
  });
});