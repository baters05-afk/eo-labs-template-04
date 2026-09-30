/*
 * Exploded view of the profile section (CSS + vanilla JS, no libraries).
 * Sequence, played once when ~45% of the plate is visible:
 *   0–300ms   assembled profile fades/scales in            (.is-visible)
 *   300ms →   layers separate with per-layer delay/duration  (.is-exploded, timing from technicalProfile.layers)
 *   after     dots appear, lines draw, labels fade in (staggered) (.is-labeled)
 *   then      hover a label → its layer lifts, the others recede (.is-interactive, fine pointers only)
 * prefers-reduced-motion / no IntersectionObserver: final state immediately. Layout, offsets and timing are data-driven.
 */
(function () {
  'use strict';
  const EO = window.EO;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function final(fig) { fig.classList.add('is-visible', 'is-exploded', 'is-labeled', 'is-interactive'); bindHover(fig); }

  function bindHover(fig) {
    if (fig.dataset.hoverBound) return;
    fig.dataset.hoverBound = '1';
    const layers = () => Array.from(fig.querySelectorAll('.pev__layer[data-layer]'));
    const set = (id) => {
      if (!matchMedia('(hover: hover) and (pointer: fine)').matches || !fig.classList.contains('is-interactive')) return;
      layers().forEach((l) => l.classList.toggle('is-hover', !!id && l.dataset.layer === id));
      fig.classList.toggle('has-hover', !!id && layers().some((l) => l.dataset.layer === id));
    };
    fig.querySelectorAll('.pev__label').forEach((label) => {
      label.addEventListener('mouseenter', () => set(label.dataset.layer));
      label.addEventListener('mouseleave', () => set(null));
    });
  }

  function play(fig) {
    fig.classList.add('is-visible');                       // 0–300ms
    setTimeout(() => {
      fig.classList.add('is-exploded');                    // layers move (their own delay/duration)
      const ms = Number(fig.dataset.explodeMs) || 1200;
      setTimeout(() => {
        fig.classList.add('is-labeled');                   // dots → lines → labels
        setTimeout(() => { fig.classList.add('is-interactive'); bindHover(fig); }, 900);
      }, ms + 40);
    }, 300);
  }

  function setup(fig) {
    if (fig.dataset.pevReady) return;
    fig.dataset.pevReady = '1';
    if (fig.dataset.pev !== '1') return;                   // static fallback: nothing to animate
    const plate = fig.querySelector('.pev__plate') || fig;
    if (reduced() || !('IntersectionObserver' in window)) { final(fig); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); play(fig); }
    }, { threshold: 0.45, rootMargin: '0px 0px -6% 0px' });
    io.observe(plate);
  }

  EO.profile = { init() { document.querySelectorAll('.pev').forEach(setup); } };
})();
