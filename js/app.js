/* Bootstrap + behaviour: events (delegated), header, reveal, parallax, accordion, language/preset switching. */
(function () {
  'use strict';
  const EO = window.EO;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let $, $$, t, tr;
  let menuOpen = false;

  function rerender(focusSel) {
    EO.render.all(menuOpen);
    EO.seo.apply();
    EO.gallery.refresh();
    EO.quote.refresh();
    observeReveal();
    if (focusSel) { const el = document.querySelector(focusSel); if (el) el.focus({ preventScroll: true }); }
  }

  function setMenu(open) {
    menuOpen = open;
    const header = $('#siteHeader');
    header.classList.toggle('is-open', open);
    const btn = $('#menuToggle');
    if (btn) { btn.setAttribute('aria-expanded', String(open)); btn.textContent = open ? t('nav.close') : t('nav.menu'); }
  }

  function scrollToEl(el) { if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }

  /* ---------- click delegation ---------- */
  function onClick(e) {
    const tgt = e.target;
    const lang = tgt.closest('[data-lang]');
    if (lang) {
      const zone = lang.closest('.mobile-nav, .site-footer, .header-tools');
      const zoneSel = zone ? (zone.classList.contains('mobile-nav') ? '.mobile-nav' : zone.classList.contains('site-footer') ? '.site-footer' : '.header-tools') : '';
      if (EO.i18n.set(lang.dataset.lang)) rerender(`${zoneSel} [data-lang="${lang.dataset.lang}"]`);
      return;
    }
    const preset = tgt.closest('button[data-preset]');
    if (preset) {
      EO.setPreset(preset.dataset.preset);
      $$('button[data-preset]').forEach((b) => b.setAttribute('aria-pressed', String(b === preset)));
      return;
    }
    if (tgt.closest('#menuToggle')) { setMenu(!menuOpen); return; }
    if (tgt.closest('.mobile-nav a')) setMenu(false);

    const quote = tgt.closest('[data-open-quote]');
    if (quote) { e.preventDefault(); setMenu(false); EO.quote.open({}); return; }

    const cat = tgt.closest('[data-category]');
    if (cat) {
      e.preventDefault(); setMenu(false);
      EO.state.filter.category = cat.dataset.category; EO.state.filter.material = 'all';
      EO.render.updateRange();
      scrollToEl($('#range'));
      return;
    }
    const chip = tgt.closest('[data-filter]');
    if (chip) { const [g, id] = chip.dataset.filter.split(':'); EO.state.filter[g] = id; EO.render.updateRange(); return; }

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

  /* radio-group keyboard support (arrows move + select) */
  function onKeydown(e) {
    if (e.key === 'Escape' && menuOpen) { setMenu(false); const b = $('#menuToggle'); if (b) b.focus(); return; }
    const r = e.target.closest && e.target.closest('[role="radio"]');
    if (!r || !['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
    const group = r.closest('[role="radiogroup"]');
    const items = $$('[role="radio"]:not(:disabled)', group);
    const i = items.indexOf(r);
    const next = items[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length];
    if (next) { e.preventDefault(); next.click(); const again = group.ownerDocument.querySelector(`[data-focus="${next.dataset.focus}"]`) || next; (again.isConnected ? again : next).focus(); }
  }

  /* ---------- header scroll, active nav, reveal, parallax ---------- */
  function initScroll() {
    const header = $('#siteHeader');
    const media = $('#heroMedia');
    const hero = $('#top');
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 40);
      if (!reduced && media && y < hero.offsetHeight) media.style.transform = `translate3d(0, ${(y * 0.14).toFixed(1)}px, 0)`;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();

    if ('IntersectionObserver' in window) {
      const map = new Map();
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => map.set(en.target.id, en.isIntersecting ? en.intersectionRatio : 0));
        let best = null, ratio = 0;
        map.forEach((v, k) => { if (v > ratio) { ratio = v; best = k; } });
        $$('.primary-nav a').forEach((a) => { if (best && a.getAttribute('href') === '#' + best) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.01, 1] });
      ['products', 'precision', 'projects', 'materials', 'configurator', 'about', 'faq'].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
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
    EO.db = EO.resolveData();
    EO.i18n.init(EO.db.translations);
    EO.render.all(false);
    EO.seo.apply();
    EO.gallery.init(); EO.configurator.init(); EO.quote.init();
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', () => { if (menuOpen && window.innerWidth > 960) setMenu(false); });
    initScroll();
    observeReveal();
    EO.app = { rerender };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
