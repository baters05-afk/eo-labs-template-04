/*
 * Hydration + interaction. The page arrives fully rendered (tools/build.js); this file only enhances it:
 * events, header, mobile menu, reveal, parallax, filters, accordion, dialogs.
 * If the live config differs from the prerendered HTML (admin preview / unbuilt edits) the page is re-rendered
 * from the same templates.
 */
(function () {
  'use strict';
  const EO = window.EO;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let $, $$, t, tr;
  let menuOpen = false;

  /* ---------- rendering ---------- */
  function renderAll() {
    $('#siteHeader').innerHTML = EO.tpl.headerInner();
    $('#main').innerHTML = EO.tpl.mainInner();
    $('#contact').innerHTML = EO.tpl.footerInner();
    document.documentElement.style.setProperty('--demo-bar-h', EO.site.demoMode ? '2rem' : '0px');
    EO.applyTheme();
    EO.seo.apply();
    observeReveal();
    initScroll();
  }

  function updateRange() {
    const f = EO.state.filter;
    $$('[data-filter]').forEach((b) => { const [g, id] = b.dataset.filter.split(':'); b.setAttribute('aria-pressed', String(f[g] === id)); });
    $('#rangeList').innerHTML = EO.tpl.rangeListHtml();
    $('#rangeCount').textContent = EO.tpl.rangeCount($$('#rangeList .range-item').length);
  }

  /* ---------- menu ---------- */
  function setMenu(open) {
    menuOpen = open;
    $('#siteHeader').classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const btn = $('#menuToggle');
    if (btn) { btn.setAttribute('aria-expanded', String(open)); btn.querySelector('.menu-toggle__label').textContent = open ? t('nav.close') : t('nav.menu'); }
    if (open) { const a = $('#mobileNav a'); if (a) a.focus({ preventScroll: true }); }
  }
  const scrollToEl = (el) => { if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); };

  /* ---------- click delegation ---------- */
  function onClick(e) {
    const tgt = e.target;
    const preset = tgt.closest('button[data-preset]');
    if (preset) {
      EO.setPreset(preset.dataset.preset);
      $$('button[data-preset]').forEach((b) => b.setAttribute('aria-pressed', String(b === preset)));
      return;
    }
    if (tgt.closest('#menuToggle')) { setMenu(!menuOpen); return; }
    if (tgt.closest('.mobile-nav a')) setMenu(false);

    if (tgt.closest('[data-open-quote]')) { e.preventDefault(); setMenu(false); EO.quote.open({}); return; }

    const cat = tgt.closest('[data-category]');
    if (cat) {
      e.preventDefault(); setMenu(false);
      EO.state.filter.category = cat.dataset.category; EO.state.filter.material = 'all';
      updateRange(); scrollToEl($('#range'));
      return;
    }
    const chip = tgt.closest('[data-filter]');
    if (chip) { const [g, id] = chip.dataset.filter.split(':'); EO.state.filter[g] = id; updateRange(); return; }

    const conf = tgt.closest('[data-configure]');
    if (conf) {
      const p = EO.data.products().find((x) => x.id === conf.dataset.configure);
      if (p) EO.configurator.preselect({ category: p.category, material: (p.material || [])[0] });
      return;
    }
    const confMat = tgt.closest('[data-configure-material]');
    if (confMat) { EO.configurator.preselect({ material: confMat.dataset.configureMaterial }); return; }

    const sw = tgt.closest('[data-swatch]');
    if (sw) {
      const [mid, fid] = sw.dataset.swatch.split(':');
      EO.state.finish[mid] = fid;
      const strip = sw.closest('.swatch-strip');
      $$('.swatch', strip).forEach((b) => b.setAttribute('aria-pressed', String(b === sw)));
      const m = EO.data.materials().find((x) => x.id === mid);
      const f = m && m.finishes.find((x) => x.id === fid);
      const cap = strip.parentElement.querySelector('.material__caption');
      if (cap && f) cap.textContent = `${t('materials.swatchLabel')} — ${tr(f.name)}`;
      return;
    }

    const proj = tgt.closest('[data-project]');
    if (proj) { EO.gallery.open(proj.dataset.project); return; }
    if (tgt.closest('[data-gallery-all]')) { EO.gallery.open(null); return; }
    if (tgt.closest('[data-gallery-close]')) { EO.gallery.close(); return; }
    const gs = tgt.closest('[data-gallery-step]');
    if (gs) { EO.gallery.step(Number(gs.dataset.galleryStep)); return; }

    const trig = tgt.closest('.accordion__trigger');
    if (trig) {
      const panel = document.getElementById(trig.getAttribute('aria-controls'));
      const willOpen = trig.getAttribute('aria-expanded') !== 'true';
      $$('.accordion__trigger').forEach((b) => { b.setAttribute('aria-expanded', 'false'); document.getElementById(b.getAttribute('aria-controls')).classList.remove('is-open'); });
      trig.setAttribute('aria-expanded', String(willOpen));
      panel.classList.toggle('is-open', willOpen);
      EO.state.faqOpen = willOpen ? trig.id.replace('faq-t-', '') : null;
    }
  }

  /* radio groups: arrows move + select; Esc closes the mobile menu */
  function onKeydown(e) {
    if (e.key === 'Escape' && menuOpen) { setMenu(false); const b = $('#menuToggle'); if (b) b.focus(); return; }
    const r = e.target.closest && e.target.closest('[role="radio"]');
    if (!r || !['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
    const group = r.closest('[role="radiogroup"]');
    const items = $$('[role="radio"]:not(:disabled)', group);
    const i = items.indexOf(r);
    const next = items[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length];
    if (next) { e.preventDefault(); next.click(); const key = next.dataset.focus; const again = key ? document.querySelector(`[data-focus="${key}"]`) : null; (again || next).focus(); }
  }

  /* ---------- header, active nav, parallax ---------- */
  let scrollBound = false, navIO;
  function initScroll() {
    const header = $('#siteHeader');
    const media = $('#heroMedia');
    const hero = $('#top');
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 40);
      if (!reduced && media && hero && y < hero.offsetHeight) media.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0)`;
    };
    if (!scrollBound) { window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true }); scrollBound = true; }
    update();

    if ('IntersectionObserver' in window) {
      if (navIO) navIO.disconnect();
      const map = new Map();
      navIO = new IntersectionObserver((entries) => {
        entries.forEach((en) => map.set(en.target.id, en.isIntersecting ? en.intersectionRatio : 0));
        let best = null, ratio = 0;
        map.forEach((v, k) => { if (v > ratio) { ratio = v; best = k; } });
        $$('.primary-nav a').forEach((a) => { if (best && a.getAttribute('href') === '#' + best) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.01, 1] });
      ['products', 'precision', 'projects', 'materials', 'configurator', 'about', 'faq'].forEach((id) => { const el = document.getElementById(id); if (el) navIO.observe(el); });
    }
  }

  let revealIO;
  function observeReveal() {
    const els = $$('[data-reveal]:not(.in)');
    if (!('IntersectionObserver' in window) || reduced) { els.forEach((el) => el.classList.add('in')); return; }
    if (!revealIO) revealIO = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); } }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => revealIO.observe(el));
  }

  function init() {
    ({ $, $$, t, tr } = EO.ui);
    EO.root = document.documentElement.dataset.root || '';
    EO.resolve(true);
    EO.i18n.init(EO.db.translations, document.documentElement.lang);
    if (document.documentElement.dataset.hash !== EO.tpl.hash()) renderAll();   // live config differs from prerender
    else {
      const sw = document.documentElement.dataset.preset;
      $$('button[data-preset]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.preset === sw)));
      observeReveal(); initScroll();
    }
    EO.gallery.init(); EO.configurator.init(); EO.quote.init();
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', () => { if (menuOpen && window.innerWidth > 960) setMenu(false); });
    EO.app = { renderAll };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
