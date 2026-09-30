/*
 * Configurator: 5 commercial choices → live preview + summary → hand-over to the quote flow.
 * All options come from data (categories / materials / options). Availability is data-driven:
 *   category.availableMaterials, category.availableFinishes { materialId: [finishIds] }, category.availableGlass
 * (omitted = derived from products / everything). markup() is pure so the build can prerender step 1.
 */
(function () {
  'use strict';
  const EO = window.EO;
  const { esc, media, arrow, $, t, tr } = EO.ui;
  const STEPS = ['product', 'material', 'finish', 'glass', 'projectType'];
  const LABEL = (k) => (k === 'projectType' ? 'project' : k); // translation key
  const S = () => EO.state.configuratorState;
  const opts = () => EO.db.options;
  const findIn = (list, id) => (list || []).find((x) => x.id === id);
  const material = (id) => findIn(EO.data.materials(), id);
  const category = (id) => findIn(EO.data.categories(), id);

  /** What can be combined with the chosen product. */
  function availability(productId) {
    const c = category(productId) || {};
    let mats;
    if (c.availableMaterials) mats = new Set(c.availableMaterials);
    else { mats = new Set(); EO.data.products().filter((p) => p.category === productId).forEach((p) => (p.material || []).forEach((m) => mats.add(m))); }
    return {
      materials: mats,
      finishes: (matId) => {
        const m = material(matId);
        const all = ((m && m.finishes) || []);
        const only = c.availableFinishes && c.availableFinishes[matId];
        return only ? all.filter((f) => only.indexOf(f.id) > -1) : all;
      },
      glass: c.availableGlass ? new Set(c.availableGlass) : new Set((opts().glass || []).map((g) => g.id))
    };
  }

  function valueLabel(step) {
    const s = S();
    switch (step) {
      case 'product': { const c = category(s.product); return c ? tr(c.title) : ''; }
      case 'material': { const m = material(s.material); return m ? tr(m.title) : ''; }
      case 'finish': { const m = material(s.material); const f = m && findIn(m.finishes, s.finish); return f ? tr(f.name) : ''; }
      case 'glass': { const g = findIn(opts().glass, s.glass); return g ? tr(g.title) : ''; }
      case 'projectType': { const p = findIn(opts().projectTypes, s.projectType); return p ? tr(p.title) : ''; }
      default: return '';
    }
  }
  const finishObj = () => { const m = material(S().material); return m && findIn(m.finishes, S().finish); };

  const roving = (checked, first) => (checked || first ? 0 : -1);

  function glassGlyph(v = {}) {
    const panes = v.panes || 2;
    let x = 8, out = '';
    for (let i = 0; i < panes; i++) { out += `<rect x="${x}" y="4" width="4" height="32" fill="${v.tint || 'rgba(160,190,190,.28)'}" stroke="currentColor" stroke-width="1"/>`; x += 12; }
    if (v.coating) out += `<line x1="${x - 8.5}" y1="6" x2="${x - 8.5}" y2="34" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2"/>`;
    return `<svg class="glyph" viewBox="0 0 ${x + 4} 40" aria-hidden="true" focusable="false">${out}</svg>`;
  }

  function stageOptions(step) {
    const s = S();
    if (step === 'product') {
      const list = EO.data.categories();
      return `<div class="opt-media-grid" role="radiogroup" aria-labelledby="cfgPrompt">${list.map((c, i) => `
        <button type="button" class="opt-media" role="radio" aria-checked="${s.product === c.id}" tabindex="${roving(s.product === c.id, !s.product && i === 0)}" data-opt="product:${esc(c.id)}" data-focus="opt-${esc(c.id)}">
          ${media(c.image, '', { ratio: '4 / 3', sizes: '(min-width: 961px) 14vw, 40vw' })}<span class="opt-media__title">${esc(tr(c.title))}</span></button>`).join('')}</div>`;
    }
    if (step === 'material') {
      if (!s.product) return `<p class="config__hint">${esc(t('config.chooseFirst'))}</p>`;
      const av = availability(s.product);
      const list = EO.data.materials();
      const firstOk = list.find((m) => av.materials.has(m.id));
      return `<div class="option-grid option-grid--material" role="radiogroup" aria-labelledby="cfgPrompt">${list.map((m) => {
        const ok = av.materials.has(m.id);
        const fins = av.finishes(m.id).slice(0, 5);
        return `<button type="button" class="option option--material" role="radio" aria-checked="${s.material === m.id}" tabindex="${roving(s.material === m.id, !s.material && firstOk && firstOk.id === m.id)}" ${ok ? '' : 'disabled'} data-opt="material:${esc(m.id)}" data-focus="opt-${esc(m.id)}">
          <span class="mini-swatches" aria-hidden="true">${fins.map((f) => `<i style="--sw:${esc(f.color)}"></i>`).join('')}</span>
          <span class="option__title">${esc(tr(m.title))}</span><span class="option__desc">${esc(ok ? tr(m.subtitle) : t('config.unavailable'))}</span></button>`;
      }).join('')}</div>`;
    }
    if (step === 'finish') {
      const m = material(s.material);
      if (!m) return `<p class="config__hint">${esc(t('config.chooseFirst'))}</p>`;
      const fins = availability(s.product).finishes(m.id);
      return `<div class="finish-grid" role="radiogroup" aria-labelledby="cfgPrompt">${fins.map((f, i) => `
        <button type="button" class="finish" role="radio" aria-checked="${s.finish === f.id}" tabindex="${roving(s.finish === f.id, !s.finish && i === 0)}" data-opt="finish:${esc(f.id)}" data-focus="opt-${esc(f.id)}">
          <span class="swatch" style="--sw:${esc(f.color)}"></span><span class="finish__name">${esc(tr(f.name))}</span></button>`).join('')}</div>`;
    }
    if (step === 'glass') {
      const av = s.product ? availability(s.product).glass : null;
      const list = opts().glass;
      const firstOk = list.find((g) => !av || av.has(g.id));
      return `<div class="option-grid" role="radiogroup" aria-labelledby="cfgPrompt">${list.map((g) => {
        const ok = !av || av.has(g.id);
        return `<button type="button" class="option option--glass" role="radio" aria-checked="${s.glass === g.id}" tabindex="${roving(s.glass === g.id, !s.glass && firstOk && firstOk.id === g.id)}" ${ok ? '' : 'disabled'} data-opt="glass:${esc(g.id)}" data-focus="opt-${esc(g.id)}">
          ${glassGlyph(g.visual)}<span class="option__title">${esc(tr(g.title))}</span><span class="option__desc">${esc(ok ? tr(g.description) : t('config.unavailable'))}</span></button>`;
      }).join('')}</div>`;
    }
    const cur = s.projectType;
    return `<div class="option-grid" role="radiogroup" aria-labelledby="cfgPrompt">${opts().projectTypes.map((o, i) => `
      <button type="button" class="option" role="radio" aria-checked="${cur === o.id}" tabindex="${roving(cur === o.id, !cur && i === 0)}" data-opt="projectType:${esc(o.id)}" data-focus="opt-${esc(o.id)}">
        <span class="option__title">${esc(tr(o.title))}</span></button>`).join('')}</div>`;
  }

  function summaryRow(step) {
    const label = valueLabel(step);
    const f = step === 'finish' ? finishObj() : null;
    const swatch = f ? `<span class="swatch" style="--sw:${esc(f.color)}"></span>` : '';
    return `<div class="summary__row"><dt>${esc(t('config.steps.' + LABEL(step)))}</dt><dd class="${label ? '' : 'is-empty'}"><button type="button" data-step="${STEPS.indexOf(step)}" data-focus="sum-${step}" aria-label="${esc(t('config.edit'))}: ${esc(t('config.steps.' + LABEL(step)))}">${swatch}<span>${esc(label || t('config.empty'))}</span></button></dd></div>`;
  }

  function previewHtml() {
    const s = S();
    const cats = EO.data.categories();
    const c = category(s.product) || cats[0];
    const f = finishObj();
    const caption = [valueLabel('product'), valueLabel('material'), valueLabel('finish')].filter(Boolean).join(' · ');
    return `<div class="preview__frame">${c ? media(c.image, s.product ? tr(c.alt) || tr(c.title) : '', { ratio: '4 / 3', sizes: '(min-width: 961px) 34vw, 100vw' }) : ''}
      ${f ? `<span class="preview__finish" style="--sw:${esc(f.color)}" aria-hidden="true"></span>` : ''}</div>
      <p class="preview__caption" aria-live="polite">${esc(caption || t('config.previewEmpty'))}</p>`;
  }

  /** Inner markup of #config (pure). */
  function markup() {
    const s = S();
    const stepId = STEPS[EO.state.step];
    const chosen = !!s[stepId];
    const last = EO.state.step === STEPS.length - 1;
    return `
      <div class="config__main">
        <ol class="stepper" aria-label="${esc(t('config.eyebrow'))}">${STEPS.map((k, i) => `<li><button type="button" data-step="${i}" data-focus="st-${k}" ${i === EO.state.step ? 'aria-current="step"' : ''} data-done="${!!s[k] && i !== EO.state.step}"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="name">${esc(t('config.steps.' + LABEL(k)))}</span></button></li>`).join('')}</ol>
        <div class="config__stage">
          <div class="config__stage-head"><h3 class="config__prompt" id="cfgPrompt">${esc(t('config.prompts.' + LABEL(stepId)))}</h3><span class="config__hint">${esc(t('config.stepOf', { n: EO.state.step + 1, total: STEPS.length }))}</span></div>
          ${stageOptions(stepId)}
        </div>
        <div class="config__nav">
          <button type="button" class="btn btn--ghost" data-cfg-back data-focus="back" ${EO.state.step === 0 ? 'disabled' : ''}><span>${esc(t('btn.back'))}</span></button>
          ${last ? '' : `<button type="button" class="btn btn--primary" data-cfg-next data-focus="next" ${chosen ? '' : 'disabled'}><span>${esc(t('btn.next'))}</span>${arrow()}</button>`}
        </div>
      </div>
      <div class="config__preview preview" aria-label="${esc(t('config.preview'))}">${previewHtml()}</div>
      <aside class="config__summary summary theme-dark" aria-labelledby="sumTitle">
        <p class="eyebrow summary__title" id="sumTitle">${esc(t('config.summary'))}</p>
        <dl class="summary__rows">${STEPS.map(summaryRow).join('')}</dl>
        <button type="button" class="btn btn--primary" data-cfg-continue data-focus="continue" ${s.product ? '' : 'disabled'}><span>${esc(t('btn.continue'))}</span>${arrow()}</button>
        <p class="config__hint">${esc(t('config.hint'))}</p>
      </aside>`;
  }

  function render() {
    const host = $('#config');
    if (!host) return;
    const focusKey = document.activeElement && host.contains(document.activeElement) ? document.activeElement.dataset.focus : null;
    host.innerHTML = markup();
    if (focusKey) { const el = host.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`); if (el && !el.disabled) el.focus({ preventScroll: true }); }
  }

  function announce() {
    const live = $('#liveRegion');
    const id = STEPS[EO.state.step];
    if (live) live.textContent = `${t('config.stepOf', { n: EO.state.step + 1, total: STEPS.length })}: ${t('config.prompts.' + LABEL(id))}`;
  }

  /** Drop any choice that the current product/material no longer supports. */
  function reconcile() {
    const s = S();
    if (!s.product) { s.material = s.finish = s.glass = null; return; }
    const av = availability(s.product);
    if (s.material && !av.materials.has(s.material)) { s.material = null; s.finish = null; }
    if (s.material && s.finish && !av.finishes(s.material).some((f) => f.id === s.finish)) s.finish = null;
    if (s.glass && !av.glass.has(s.glass)) s.glass = null;
  }

  function choose(step, id) {
    S()[step] = id;
    if (step === 'material') S().finish = null;
    reconcile();
    render();
  }
  function go(n) { EO.state.step = Math.max(0, Math.min(STEPS.length - 1, n)); render(); announce(); }

  EO.configurator = {
    markup, render, availability,
    /** { category, material } from the range list or the materials section */
    preselect(o) {
      const s = S();
      if (o.category) s.product = o.category;
      if (o.material) s.material = o.material;
      reconcile();
      EO.state.step = !s.product ? 0 : !s.material ? 1 : !s.finish ? 2 : 3;
      render(); announce();
      const el = document.getElementById('configurator');
      if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    },
    init() {
      const host = $('#config');
      if (!host) return;
      host.addEventListener('click', (e) => {
        const opt = e.target.closest('[data-opt]');
        if (opt && !opt.disabled) { const [step, id] = opt.dataset.opt.split(':'); choose(step, id); return; }
        const st = e.target.closest('[data-step]');
        if (st) { go(Number(st.dataset.step)); return; }
        if (e.target.closest('[data-cfg-next]')) { go(EO.state.step + 1); return; }
        if (e.target.closest('[data-cfg-back]')) { go(EO.state.step - 1); return; }
        if (e.target.closest('[data-cfg-continue]')) EO.quote.open({ prefill: EO.state.configuratorState });
      });
    }
  };
})();
