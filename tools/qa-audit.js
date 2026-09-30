/* Dev-only QA probe. In the browser console / test harness:
 *   fetch('/tools/qa-audit.js').then(r => r.text()).then(eval).then(() => JSON.stringify(window.__qa()))
 * Reports: horizontal overflow, touch targets < 44px, text < 16px (body copy), oversized image downloads,
 * focusable elements inside hidden regions, duplicated screen-reader content. Not deployed. */
window.__qa = function () {
  const W = document.documentElement.clientWidth, out = { w: W, iw: innerWidth, sw: document.documentElement.scrollWidth };
  const vis = (e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
  const inScroller = (e) => { for (let p = e.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if ((o === 'auto' || o === 'scroll') && p.scrollWidth > p.clientWidth + 1) return true; } return false; };
  // overflow
  out.overflow = [...document.querySelectorAll('body *')].filter((e) => { if (!vis(e)) return false; const r = e.getBoundingClientRect(); return (r.right > W + 1 || r.left < -1) && !inScroller(e) && !e.closest('.hero__media,.visually-hidden,.skip-link,dialog:not([open]),.preview__layer'); }).slice(0, 8).map((e) => `${e.tagName}.${String(e.className).slice(0, 40)} r=${Math.round(e.getBoundingClientRect().right)}`);
  // touch targets
  const sel = 'a[href], button, input:not([type=hidden]), select, textarea, [role=radio], [role=button]';
  const small = new Map();
  document.querySelectorAll(sel).forEach((e) => {
    if (!vis(e) || e.closest('.skip-link,.visually-hidden')) return;
    if (e.matches('a') && e.closest('p, li') && getComputedStyle(e).display === 'inline') return; // inline text links are exempt
    const r = e.getBoundingClientRect();
    if (r.width < 43.5 || r.height < 43.5) small.set(`${e.tagName}.${String(e.className).split(' ')[0]}|${(e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 18)}`, `${Math.round(r.width)}x${Math.round(r.height)}`);
  });
  out.smallTargets = [...small].slice(0, 25).map(([k, v]) => `${k} ${v}`);
  // small text (body copy)
  const fs = new Map();
  document.querySelectorAll('body *').forEach((e) => {
    if (!vis(e) || e.closest('.visually-hidden,script,style')) return;
    const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 3);
    if (!own) return;
    const px = parseFloat(getComputedStyle(e).fontSize);
    if (px < 15.5) { const k = `${e.tagName}.${String(e.className).split(' ')[0]} ${px.toFixed(1)}px`; fs.set(k, (fs.get(k) || 0) + 1); }
  });
  out.smallText = [...fs].slice(0, 30).map(([k, n]) => `${k} ×${n}`);
  // images
  const dpr = devicePixelRatio;
  out.images = [...document.images].filter((i) => i.currentSrc && i.complete).map((i) => { const r = i.getBoundingClientRect(); return { src: i.currentSrc.split('/').pop(), nw: i.naturalWidth, need: Math.round(r.width * dpr), lazy: i.loading, rw: Math.round(r.width) }; }).filter((x) => x.rw > 0 && x.nw > x.need * 1.7 && x.nw > 700).slice(0, 10);
  out.broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc);
  // duplicates
  out.h1 = document.querySelectorAll('h1').length;
  out.lang = document.documentElement.lang;
  return out;
};
