/*
 * Exploded view of the profile section — CSS + vanilla JS, no libraries. Plays ONCE:
 *   0–250ms     assembled profile appears                          (.is-visible)
 *   500ms →     layers separate, staggered (timing per layer in technicalProfile.layers)   (.is-exploded)
 *   ~1450ms     ghost of the assembled window, lines draw, labels appear                    (.is-labeled)
 *   then        hover a label (desktop) / tap a list item (touch) → focus one component;
 *               Exploded / Assembled switch                                                   (.is-interactive)
 * Lines are computed from the REAL position of each layer's dot, so they follow the layer wherever it is
 * (exploded, focus-lift, assembled). prefers-reduced-motion / no IntersectionObserver: final state at once.
 */
(function () {
  'use strict';
  const EO = window.EO;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- lines ---------- */
  function layoutLines(fig) {
    const svg = fig.querySelector('.pev__lines');
    const plate = fig.querySelector('.pev__plate');
    if (!svg || !plate || getComputedStyle(svg).display === 'none') return;
    const pr = plate.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${pr.width} ${pr.height}`);
    const gap = 8;
    $$('line', svg).forEach((line) => {
      const dot = fig.querySelector(`.pev__dot[data-id="${line.dataset.id}"]`);
      const label = fig.querySelector(`.pev__label[data-id="${line.dataset.id}"]`);
      if (!dot || !label) return;
      const d = dot.getBoundingClientRect(), l = label.getBoundingClientRect();
      const x1 = d.left + d.width / 2 - pr.left, y1 = d.top + d.height / 2 - pr.top;
      const L = l.left - pr.left, T = l.top - pr.top, R = l.right - pr.left, B = l.bottom - pr.top;
      const clampX = (x) => Math.min(Math.max(x, L + 12), R - 12);
      let x2, y2;
      if (x1 < L - gap) { x2 = L - gap; y2 = T + 8; }               // label to the right of the dot
      else if (x1 > R + gap) { x2 = R + gap; y2 = T + 8; }          // label to the left
      else if (y1 < T) { x2 = clampX(x1); y2 = T - gap; }           // label below
      else { x2 = clampX(x1); y2 = B + gap; }                       // label above
      line.setAttribute('x1', x1.toFixed(1)); line.setAttribute('y1', y1.toFixed(1));
      line.setAttribute('x2', x2.toFixed(1)); line.setAttribute('y2', y2.toFixed(1));
    });
  }
  function track(fig, ms) {                                          // keep lines glued to moving layers
    const end = performance.now() + ms;
    (function tick() { layoutLines(fig); if (performance.now() < end) requestAnimationFrame(tick); })();
  }

  /* ---------- focus ---------- */
  function setFocus(fig, id) {
    if (!fig.classList.contains('is-interactive') || (id && fig.dataset.view !== 'exploded')) return;
    const lab = id ? fig.querySelector(`.pev__label[data-id="${id}"]`) || fig.querySelector(`.pev__item[data-id="${id}"]`) : null;
    const layerId = lab ? lab.dataset.layer : null;
    fig.dataset.focus = id || '';
    fig.classList.toggle('has-focus', !!id);
    $$('.pev__layer[data-layer]', fig).forEach((l) => l.classList.toggle('is-focus', !!id && l.dataset.layer === layerId));
    $$('.pev__label', fig).forEach((l) => {
      const active = !!id && l.dataset.id === id;
      l.classList.toggle('is-active', active);
      l.setAttribute('aria-pressed', String(active));
    });
    $$('.pev__lines line', fig).forEach((l) => l.classList.toggle('is-active', !!id && l.dataset.id === id));
    $$('.pev__item[data-id]', fig).forEach((b) => b.setAttribute('aria-pressed', String(!!id && b.dataset.id === id)));
    if (!reduced()) track(fig, 800); else layoutLines(fig);
  }

  function setView(fig, view) {
    fig.dataset.view = view;
    $$('.pev__label', fig).forEach((l) => l.tabIndex = view === 'assembled' ? -1 : 0);
    if (view === 'assembled') setFocus(fig, null);
    $$('.pev__toggle button', fig).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    if (!reduced()) track(fig, 1100); else layoutLines(fig);
  }

  function bind(fig) {
    if (fig.dataset.bound) return;
    fig.dataset.bound = '1';
    const hover = matchMedia('(hover: hover) and (pointer: fine)');
    $$('.pev__label', fig).forEach((label) => {
      label.addEventListener('focus', () => setFocus(fig, label.dataset.id));
      label.addEventListener('blur', () => setFocus(fig, null));
      label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFocus(fig, fig.dataset.focus === label.dataset.id ? null : label.dataset.id); }
        if (e.key === 'Escape') setFocus(fig, null);
      });
      label.addEventListener('mouseenter', () => { if (hover.matches) setFocus(fig, label.dataset.id); });
      label.addEventListener('mouseleave', () => { if (hover.matches) setFocus(fig, null); });
      label.addEventListener('click', () => { if (!hover.matches) setFocus(fig, fig.dataset.focus === label.dataset.id ? null : label.dataset.id); });
    });
    $$('.pev__item[data-id]', fig).forEach((btn) => btn.addEventListener('click', () => setFocus(fig, fig.dataset.focus === btn.dataset.id ? null : btn.dataset.id)));
    $$('.pev__toggle button', fig).forEach((b) => b.addEventListener('click', () => setView(fig, b.dataset.view)));
  }

  function enable(fig) {
    fig.classList.add('is-interactive');
    $$('.pev__toggle button', fig).forEach((b) => { b.disabled = false; });
    bind(fig);
  }

  function finalState(fig) {
    fig.classList.add('is-visible', 'is-exploded', 'is-labeled');
    enable(fig);
    layoutLines(fig);
  }

  function play(fig) {
    const at = Number(fig.dataset.explodeAt) || 500;
    const ann = Number(fig.dataset.annotateAt) || 1450;
    fig.classList.add('is-visible');                                    // assembled profile fades in
    setTimeout(() => { fig.classList.add('is-exploded'); track(fig, ann - at + 900); }, at);
    setTimeout(() => { layoutLines(fig); fig.classList.add('is-labeled'); }, ann);
    setTimeout(() => enable(fig), ann + 900);
  }

  function setup(fig) {
    if (fig.dataset.pevReady) return;
    fig.dataset.pevReady = '1';
    if (fig.dataset.pev !== '1') return;                               // static fallback: nothing to animate
    fig.querySelector('.pev__plate').style.setProperty('--fade', (fig.dataset.fadeMs || 250) + 'ms');
    const plate = fig.querySelector('.pev__plate');
    if ('ResizeObserver' in window) new ResizeObserver(() => layoutLines(fig)).observe(plate);
    else window.addEventListener('resize', () => layoutLines(fig));
    if (reduced() || !('IntersectionObserver' in window)) { finalState(fig); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); play(fig); }
    }, { threshold: 0.4, rootMargin: '0px 0px -6% 0px' });
    io.observe(plate);
  }

  EO.profile = { init() { $$('.pev').forEach(setup); } };
})();
