/* Configurator: 5 commercial choices → live summary → hand-over to the quote flow. */
(function () {
  'use strict';
  const EO = window.EO;
  const { esc, media, arrow, $, $$, t, tr } = EO.ui;
  const STEPS = ['product', 'material', 'finish', 'glass', 'project'];

  EO.state.selection = { product: null, material: null, finish: null, glass: null, project: null };
  EO.state.step = 0;
  const sel = () => EO.state.selection;
  const opts = () => EO.db.options;

  const findIn = (list, id) => (list || []).find((x) => x.id === id);
  const material = (id) => findIn(EO.data.materials(), id);

  function availableMaterials(productId) {
    const set = new Set();
    EO.data.products().filter((p) => p.category === productId).forEach((p) => (p.material || []).forEach((m) => set.add(m)));
    return set;
  }

  function valueLabel(step) {
    const s = sel();
    switch (step) {
      case 'product': { const c = findIn(EO.data.categories(), s.product); return c ? tr(c.title) : ''; }
      case 'material': { const m = material(s.material); return m ? tr(m.title) : ''; }
      case 'finish': { const m = material(s.material); const f = m && findIn(m.finishes, s.finish); return f ? tr(f.name) : ''; }
      case 'glass': { const g = findIn(opts().glass, s.glass); return g ? tr(g.title) : ''; }
      case 'project': { const p = findIn(opts().projectTypes, s.project); return p ? tr(p.title) : ''; }
      default: return '';
    }
  }

  const roving = (checked, first) => (checked || first ? 0 : -1);

  function stageOptions(step) {
    const s = sel();
    if (step === 'product') {
      const list = EO.data.categories();
      return `<div class="opt-media-grid" role="radiogroup" aria-labelledby="cfgPrompt">${list.map((c, i) => `
        <button type="button" class="opt-media" role="radio" aria-checked="${s.product === c.id}" tabindex="${roving(s.product === c.id, !s.product && i === 0)}" data-opt="product:${esc(c.id)}" data-focus="opt-${esc(c.id)}">
          ${media(c.image, '', { ratio: '4 / 3', sizes: '20vw' })}<span class="opt-media__title">${esc(tr(c.title))}</span></button>`).join('')}</div>`;
    }
    if (step === 'material') {
      if (!s.product) return `<p class="config__hint">${esc(t('config.chooseFirst'))}</p>`;
      const avail = availableMaterials(s.product);
      const list = EO.data.materials();
      const firstOk = list.find((m) => avail.has(m.id));
      return `<div class="option-grid" role="radiogroup" aria-labelledby="cfgPrompt">${list.map((m) => {
        const ok = avail.has(m.id);
        return `<button type="button" class="option" role="radio" aria-checked="${s.material === m.id}" tabindex="${roving(s.material === m.id, !s.material && firstOk && firstOk.id === m.id)}" ${ok ? '' : 'disabled'} data-opt="material:${esc(m.id)}" data-focus="opt-${esc(m.id)}">
          <span class="option__title">${esc(tr(m.title))}</span><span class="option__desc">${esc(ok ? tr(m.subtitle) : t('config.unavailable'))}</span></button>`;
      }).join('')}</div>`;
    }
    if (step === 'finish') {
      const m = material(s.material);
      if (!m) return `<p class="config__hint">${esc(t('config.chooseFirst'))}</p>`;
      return `<div class="finish-grid" role="radiogroup" aria-labelledby="cfgPrompt">${(m.finishes || []).map((f, i) => `
        <button type="button" class="finish" role="radio" aria-checked="${s.finish === f.id}" tabindex="${roving(s.finish === f.id, !s.finish && i === 0)}" data-opt="finish:${esc(f.id)}" data-focus="opt-${esc(f.id)}">
          <span class="swatch" style="--sw:${esc(f.color)}"></span><span class="finish__name">${esc(tr(f.name))}</span></button>`).join('')}</div>`;
    }
    const list = step === 'glass' ? opts().glass : opts().projectTypes;
    const cur = s[step];
    return `<div class="option-grid" role="radiogroup" aria-labelledby="cfgPrompt">${list.map((o, i) => `
      <button type="button" class="option" role="radio" aria-checked="${cur === o.id}" tabindex="${roving(cur === o.id, !cur && i === 0)}" data-opt="${step}:${esc(o.id)}" data-focus="opt-${esc(o.id)}">
        <span class="option__title">${esc(tr(o.title))}</span>${o.description ? `<span class="option__desc">${esc(tr(o.description))}</span>` : ''}</button>`).join('')}</div>`;
  }

  function summaryRow(step) {
    const s = sel();
    const label = valueLabel(step);
    let swatch = '';
    if (step === 'finish' && label) { const m = material(s.material); const f = m && findIn(m.finishes, s.finish); if (f) swatch = `<span class="swatch" style="--sw:${esc(f.color)}"></span>`; }
    return `<div class="summary__row"><dt>${esc(t('config.steps.' + step))}</dt><dd class="${label ? '' : 'is-empty'}"><button type="button" data-step="${STEPS.indexOf(step)}" data-focus="sum-${step}" aria-label="${esc(t('config.edit'))}: ${esc(t('config.steps.' + step))}">${swatch}<span>${esc(label || t('config.empty'))}</span></button></dd></div>`;
  }

  function render() {
    const host = $('#config');
    if (!host) return;
    const focusKey = document.activeElement && host.contains(document.activeElement) ? document.activeElement.dataset.focus : null;
    const s = sel();
    const stepId = STEPS[EO.state.step];
    const chosen = !!s[stepId];
    const last = EO.state.step === STEPS.length - 1;

    host.innerHTML = `
      <div class="config__main">
        <ol class="stepper" aria-label="${esc(t('config.eyebrow'))}">${STEPS.map((k, i) => `<li><button type="button" data-step="${i}" data-focus="st-${k}" ${i === EO.state.step ? 'aria-current="step"' : ''} data-done="${!!s[k] && i !== EO.state.step}"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="name">${esc(t('config.steps.' + k))}</span></button></li>`).join('')}</ol>
        <div class="config__stage">
          <div class="config__stage-head"><h3 class="config__prompt" id="cfgPrompt">${esc(t('config.prompts.' + stepId))}</h3><span class="config__hint">${esc(t('config.stepOf', { n: EO.state.step + 1, total: STEPS.length }))}</span></div>
          ${stageOptions(stepId)}
        </div>
        <div class="config__nav">
          <button type="button" class="btn btn--ghost" data-cfg-back data-focus="back" ${EO.state.step === 0 ? 'disabled' : ''}><span>${esc(t('btn.back'))}</span></button>
          ${last ? '' : `<button type="button" class="btn btn--primary" data-cfg-next data-focus="next" ${chosen ? '' : 'disabled'}><span>${esc(t('btn.next'))}</span>${arrow()}</button>`}
        </div>
      </div>
      <aside class="summary theme-dark" aria-labelledby="sumTitle">
        <p class="eyebrow summary__title" id="sumTitle">${esc(t('config.summary'))}</p>
        <dl class="summary__rows">${STEPS.map(summaryRow).join('')}</dl>
        <p class="config__hint" style="margin-top:1rem">${esc(t('config.hint'))}</p>
        <button type="button" class="btn btn--primary" data-cfg-continue data-focus="continue" ${s.product ? '' : 'disabled'}><span>${esc(t('btn.continue'))}</span>${arrow()}</button>
      </aside>`;

    if (focusKey) { const el = host.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`); if (el && !el.disabled) el.focus({ preventScroll: true }); }
  }

  function announce() {
    const live = $('#liveRegion');
    const id = STEPS[EO.state.step];
    if (live) live.textContent = `${t('config.stepOf', { n: EO.state.step + 1, total: STEPS.length })}: ${t('config.prompts.' + id)}`;
  }

  function choose(step, id) {
    const s = sel();
    s[step] = id;
    if (step === 'product') {
      if (s.material && !availableMaterials(id).has(s.material)) { s.material = null; s.finish = null; }
    }
    if (step === 'material') {
      const m = material(id);
      if (!m || !findIn(m.finishes, s.finish)) s.finish = null;
    }
    render();
  }

  function go(n) {
    EO.state.step = Math.max(0, Math.min(STEPS.length - 1, n));
    render(); announce();
  }

  EO.configurator = {
    render,
    /** { category, material } from the product range or materials section */
    preselect(o) {
      const s = sel();
      if (o.category) s.product = o.category;
      if (o.material) s.material = o.material;
      if (s.material && s.product && !availableMaterials(s.product).has(s.material)) s.material = null;
      const m = material(s.material);
      if (s.finish && !(m && findIn(m.finishes, s.finish))) s.finish = null;
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
        if (e.target.closest('[data-cfg-continue]')) EO.quote.open({ prefill: EO.state.selection });
      });
    }
  };
})();
