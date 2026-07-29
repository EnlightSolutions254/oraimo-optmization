// Central icon library — inline line-art SVGs (no external images / no copyrighted assets)
const ICONS = {
  powerbank:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h2l-2 4h3l-2 5"/><path d="M10 3v-1.5M14 3v-1.5"/></svg>`,
  watch:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="2.5"/><path d="M9 7V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V7M9 17v2.5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V17"/><path d="M12 10v2l1.3 1.3"/></svg>`,
  earbud:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4c-2 0-3 1.3-3 3.2 0 2 1.3 2.6 1.3 4.6V16a2.7 2.7 0 1 0 5.4 0V9"/><circle cx="8" cy="6.2" r="2.2"/><path d="M16 4c2 0 3 1.3 3 3.2 0 2-1.3 2.6-1.3 4.6V16a2.7 2.7 0 1 1-5.4 0V9"/><circle cx="16" cy="6.2" r="2.2"/></svg>`,
  openear:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5c-2.2 1-3 3-2.6 6 .3 2.6 2 3 2 5.3a2.6 2.6 0 0 0 5.2 0V9.4"/><circle cx="7.6" cy="6" r="2"/><path d="M18 5c2.2 1 3 3 2.6 6-.3 2.6-2 3-2 5.3a2.6 2.6 0 0 1-5.2 0V9.4"/><circle cx="16.4" cy="6" r="2"/></svg>`,
  headphone:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/></svg>`,
  neckband:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4c0 6 3 9 8 9s8-3 8-9"/><rect x="2.4" y="12.5" width="4" height="6" rx="1.4"/><rect x="17.6" y="12.5" width="4" height="6" rx="1.4"/></svg>`,
  cable:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v5a3 3 0 0 0 3 3v0a3 3 0 0 0 3-3V3M9 11v4c0 3.5 2.7 6 6 6"/><path d="M4 3h4M17 3h4"/></svg>`,
  charger:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="7" rx="2"/><path d="M9 9v2M15 9v2"/><path d="M12 11v3l-2 3h4l-2 4"/></svg>`,
  carcharger:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l1.5-6A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 16"/><path d="M4 16v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h10v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3"/><circle cx="7.5" cy="16" r="1"/><circle cx="16.5" cy="16" r="1"/></svg>`,
  powerstation:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M13 9l-3 4h3l-3 4"/><path d="M7 9v6M17 9v6"/></svg>`,
  speaker:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2.5" width="14" height="19" rx="3"/><circle cx="12" cy="9" r="3"/><circle cx="12" cy="16.5" r="1.4"/></svg>`,
  wifi:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a13 13 0 0 1 18 0"/><path d="M6.3 12.6a8.5 8.5 0 0 1 11.4 0"/><path d="M9.5 16a4 4 0 0 1 5 0"/><circle cx="12" cy="19" r="1"/></svg>`,
  trimmer:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="3" width="8" height="10" rx="2"/><path d="M9 13v6a3 3 0 0 0 6 0v-6"/><path d="M10 6h4M10 8.5h4"/></svg>`,
  thermos:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="4" rx="1"/><path d="M6 6h12l-1 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/><path d="M9 11h6"/></svg>`,
  vacuum:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6l-3 3v7a2 2 0 0 0 2 2h2"/><circle cx="9" cy="21" r="1"/><path d="M9 9h6a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-1"/><circle cx="18" cy="17" r="1"/></svg>`,

  // UI icons
  search:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
  cart:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/><path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6"/></svg>`,
  heart:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.5-9.3 9-9.3 9z"/></svg>`,
  star:`<svg viewBox="0 0 24 24"><path d="M12 2l3 6.5 7 1-5.2 5 1.4 7-6.2-3.5L5.8 21.5l1.4-7L2 9.5l7-1z"/></svg>`,
  close:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l16 16M20 4L4 20"/></svg>`,
  arrow:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  check:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>`,
  bag:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`,
  home:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>`,
  grid:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>`,
  user:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6"/></svg>`,
  whatsapp:`<svg viewBox="0 0 24 24"><path d="M17 14.3c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  truck:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="7" width="12" height="9" rx="1.5"/><path d="M13.5 10h4l3 3v3h-7z"/><circle cx="6" cy="18.5" r="1.6"/><circle cx="16.5" cy="18.5" r="1.6"/></svg>`,
  shield:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>`,
  badge:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14.5L7 21l5-2.5L17 21l-1.5-6.5"/></svg>`,
  refresh:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v5h5M20 20v-5h-5"/><path d="M5.5 9A7 7 0 0 1 19 9M18.5 15A7 7 0 0 1 5 15"/></svg>`,
  plus:`<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,
  minus:`<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`,
  share:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.3 10.7l7.4-4.4M8.3 13.3l7.4 4.4"/></svg>`,
  up:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
};

function icon(name){
  const svg = ICONS[name] || ICONS.bag;
  // Every icon here is purely decorative (its meaning is carried by adjacent
  // text or an aria-label on the parent button/link), so mark it hidden to
  // assistive tech and remove it from the tab order.
  return svg.replace("<svg ", '<svg aria-hidden="true" focusable="false" ');
}
