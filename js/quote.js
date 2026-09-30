/*
 * Quote wizard (8 steps) in a native <dialog>.
 * demoMode:true  → fully interactive, but nothing is ever sent or stored (no fetch, no storage).
 * demoMode:false → POST JSON to siteConfig.quote.endpoint, or prepare a mailto: message.
 * Personal data lives only in this object, in memory, and is wiped on close / after demo submit.
 */
(function () {
  'use strict';
  const EO = window.EO;
  const { esc, arrow, $, $$, t, tr } = EO.ui;
  const STEPS = ['product', 'material', 'project', 'size', 'quantity', 'installation', 'location', 'contact'];
  const PERSONAL = ['name', 'email', 'phone', 'message', 'consent'];

  const fresh = () => ({
    step: 0, done: null, mailto: '', errors: {},
    data: { product: '', material: '', project: '', width: '', height: '', sizeUnknown: false, quantity: 1, installation: '', postcode: '', country: '', name: '', email: '', phone: '', message: '', consent: false, glass: '', finish: '' }
  });
  let S = fresh();
  const demo = () => !!EO.site.demoMode;
  const opts = () => EO.db.options;
  const byId = (list, id) => (list || []).find((x) => x.id === id);

  const label = {
    product: (v) => { const c = byId(EO.data.categories(), v); return c ? tr(c.title) : ''; },
    material: (v) => (v === 'unsure' ? t('quote.notSure') : (byId(EO.data.materials(), v) ? tr(byId(EO.data.materials(), v).title) : '')),
    project: (v) => { const p = byId(opts().projectTypes, v); return p ? tr(p.title) : ''; },
    installation: (v) => ({ yes: t('quote.yes'), no: t('quote.no'), undecided: t('quote.undecided') }[v] || ''),
    glass: (v) => { const g = byId(opts().glass, v); return g ? tr(g.title) : ''; },
    finish: (v) => { const m = byId(EO.data.materials(), S.data.material); const f = m && byId(m.finishes, v); return f ? tr(f.name) : ''; },
    country: (v) => { const c = byId(opts().countries, v); return c ? tr(c.title) : v; }
  };

  function recapValue(k) {
    const d = S.data;
    switch (k) {
      case 'size': return d.sizeUnknown ? t('quote.sizeUnknown') : (d.width && d.height ? `${d.width} × ${d.height} mm` : '');
      case 'quantity': return d.quantity ? String(d.quantity) : '';
      case 'location': return [d.postcode, d.country && label.country(d.country)].filter(Boolean).join(', ');
      default: return label[k] ? label[k](d[k]) : d[k];
    }
  }

  function recapHtml() {
    const keys = ['product', 'material', 'finish', 'glass', 'project', 'size', 'quantity', 'installation', 'location'];
    return keys.map((k) => { const v = recapValue(k); return `<div><dt>${esc(t('quote.short.' + k))}</dt><dd class="${v ? '' : 'is-empty'}">${esc(v || '—')}</dd></div>`; }).join('');
  }
  const updateRecap = () => { const el = $('#quoteRecap'); if (el) el.innerHTML = recapHtml(); };

  /* ---------- step markup ---------- */
  const err = (k) => `<p class="field__error" id="err-${k}" role="alert">${esc(S.errors[k] || '')}</p>`;
  const rovingIdx = (list, cur) => { const i = list.findIndex((x) => x.id === cur); return i < 0 ? 0 : i; };

  function choiceGroup(key, list, current, withDesc) {
    const ri = rovingIdx(list, current);
    return `<div class="option-grid" role="radiogroup" aria-labelledby="quoteLegend" aria-describedby="err-${key}">${list.map((o, i) => `
      <button type="button" class="option" role="radio" aria-checked="${current === o.id}" tabindex="${i === ri ? 0 : -1}" data-q="${key}:${esc(o.id)}">
        <span class="option__title">${esc(o.title)}</span>${withDesc && o.desc ? `<span class="option__desc">${esc(o.desc)}</span>` : ''}</button>`).join('')}</div>${err(key)}`;
  }

  function stepHtml(id) {
    const d = S.data;
    switch (id) {
      case 'product': return choiceGroup('product', EO.data.categories().map((c) => ({ id: c.id, title: tr(c.title) })), d.product);
      case 'material': return choiceGroup('material', EO.data.materials().map((m) => ({ id: m.id, title: tr(m.title), desc: tr(m.subtitle) })).concat([{ id: 'unsure', title: t('quote.notSure') }]), d.material, true);
      case 'project': return choiceGroup('project', opts().projectTypes.map((p) => ({ id: p.id, title: tr(p.title) })), d.project);
      case 'installation': return choiceGroup('installation', [{ id: 'yes', title: t('quote.yes') }, { id: 'no', title: t('quote.no') }, { id: 'undecided', title: t('quote.undecided') }], d.installation);
      case 'size': return `<div class="quote__fields"><div class="quote__row">
          <div class="field"><label for="qWidth">${esc(t('quote.width'))}</label><input class="input" id="qWidth" name="width" inputmode="numeric" pattern="[0-9]*" autocomplete="off" value="${esc(d.width)}" ${d.sizeUnknown ? 'disabled' : ''} placeholder="1200"></div>
          <div class="field"><label for="qHeight">${esc(t('quote.height'))}</label><input class="input" id="qHeight" name="height" inputmode="numeric" pattern="[0-9]*" autocomplete="off" value="${esc(d.height)}" ${d.sizeUnknown ? 'disabled' : ''} placeholder="1400"></div></div>
          <label class="check"><input type="checkbox" name="sizeUnknown" ${d.sizeUnknown ? 'checked' : ''}><span>${esc(t('quote.sizeUnknown'))}</span></label>${err('size')}</div>`;
      case 'quantity': return `<div class="field"><span class="field__label" id="qQtyLabel">${esc(t('quote.quantityLabel'))}</span>
          <div class="qty" role="group" aria-labelledby="qQtyLabel"><button type="button" data-qty="-1" aria-label="${esc(t('quote.decrease'))}">−</button><input class="input" id="qQty" name="quantity" inputmode="numeric" pattern="[0-9]*" value="${esc(d.quantity)}" aria-labelledby="qQtyLabel"><button type="button" data-qty="1" aria-label="${esc(t('quote.increase'))}">+</button></div>${err('quantity')}</div>`;
      case 'location': {
        const svc = EO.site.serviceAreas || [];
        const list = opts().countries;
        const country = d.country || (svc[0] && byId(list, svc[0]) ? svc[0] : list[0].id);
        d.country = country;
        return `<div class="quote__fields quote__row">
          <div class="field"><label for="qPost">${esc(t('quote.postcode'))}</label><input class="input" id="qPost" name="postcode" autocomplete="postal-code" value="${esc(d.postcode)}" aria-describedby="err-postcode">${err('postcode')}</div>
          <div class="field"><label for="qCountry">${esc(t('quote.country'))}</label><select class="select" id="qCountry" name="country" autocomplete="country">${list.map((c) => `<option value="${esc(c.id)}" ${c.id === country ? 'selected' : ''}>${esc(tr(c.title))}</option>`).join('')}</select></div></div>`;
      }
      case 'contact': return `<div class="quote__fields">
          <div class="quote__row">
            <div class="field"><label for="qName">${esc(t('quote.name'))}</label><input class="input" id="qName" name="name" autocomplete="${demo() ? 'off' : 'name'}" value="${esc(d.name)}" aria-describedby="err-name">${err('name')}</div>
            <div class="field"><label for="qEmail">${esc(t('quote.email'))}</label><input class="input" id="qEmail" name="email" type="email" autocomplete="${demo() ? 'off' : 'email'}" value="${esc(d.email)}" aria-describedby="err-email">${err('email')}</div></div>
          <div class="field"><label for="qPhone">${esc(t('quote.phone'))}</label><input class="input" id="qPhone" name="phone" type="tel" autocomplete="${demo() ? 'off' : 'tel'}" value="${esc(d.phone)}"></div>
          <div class="field"><label for="qMsg">${esc(t('quote.message'))}</label><textarea class="textarea" id="qMsg" name="message">${esc(d.message)}</textarea></div>
          ${demo() ? `<p class="caption">${esc(t('quote.consentDemo'))}</p>` : `<label class="check"><input type="checkbox" name="consent" ${d.consent ? 'checked' : ''} aria-describedby="err-consent"><span>${esc(t('quote.consent'))}</span></label>${err('consent')}`}</div>`;
      default: return '';
    }
  }

  /* ---------- validation ---------- */
  function validate(id) {
    const d = S.data, e = {};
    const q = (k) => t('quote.errors.' + k);
    if (['product', 'material', 'project', 'installation'].indexOf(id) > -1 && !d[id]) e[id] = q('required');
    if (id === 'size' && !d.sizeUnknown && !(Number(d.width) > 0 && Number(d.height) > 0)) e.size = q('size');
    if (id === 'quantity' && !(Number.isInteger(Number(d.quantity)) && d.quantity >= 1 && d.quantity <= 99)) e.quantity = q('quantity');
    if (id === 'location' && !String(d.postcode).trim()) e.postcode = q('postcode');
    if (id === 'contact') {
      if (!d.name.trim()) e.name = q('name');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = q('email');
      if (!demo() && !d.consent) e.consent = q('consent');
    }
    S.errors = e;
    return Object.keys(e).length === 0;
  }

  /* ---------- render ---------- */
  function doneHtml() {
    if (S.done === 'demo') return doneBlock(t('quote.demoDoneTitle'), t('quote.demoDone'), `<button type="button" class="btn btn--primary" data-quote-close><span>${esc(t('quote.close'))}</span></button><button type="button" class="btn btn--ghost" data-quote-restart><span>${esc(t('quote.restart'))}</span></button>`);
    if (S.done === 'ok') return doneBlock(t('quote.doneTitle'), t('quote.done'), `<button type="button" class="btn btn--primary" data-quote-close><span>${esc(t('quote.close'))}</span></button>`);
    if (S.done === 'mailto') return doneBlock(t('quote.doneTitle'), t('quote.done'), `<a class="btn btn--primary" href="${esc(S.mailto)}"><span>${esc(t('quote.mailto'))}</span>${arrow()}</a><button type="button" class="btn btn--ghost" data-quote-close><span>${esc(t('quote.close'))}</span></button>`);
    return doneBlock(t('quote.failTitle'), t('quote.fail'), `<button type="button" class="btn btn--primary" data-quote-back-form><span>${esc(t('quote.back'))}</span></button>`);
  }
  const doneBlock = (title, text, actions) => `<div class="quote__done" tabindex="-1" id="quoteDone">
      <button type="button" class="icon-btn" data-quote-close style="position:absolute;right:1rem;top:1rem;border-color:var(--line)" aria-label="${esc(t('quote.close'))}">✕</button>
      <p class="eyebrow">${esc(t('quote.title'))}</p><h2 class="display-lg" id="quoteTitle">${esc(title)}</h2><p class="lead">${esc(text)}</p><div class="actions">${actions}</div></div>`;

  function render(focus) {
    const panel = $('#quotePanel');
    if (S.done) { panel.innerHTML = doneHtml(); panel.style.position = 'relative'; const el = $('#quoteDone'); if (el && focus !== false) el.focus(); return; }
    const id = STEPS[S.step];
    const last = S.step === STEPS.length - 1;
    panel.innerHTML = `
      <form class="quote__main" novalidate id="quoteForm">
        <div class="quote__top">
          <div class="quote__top-row"><p class="eyebrow" id="quoteTitle">${esc(t('quote.title'))} · ${esc(t('quote.stepOf', { n: S.step + 1, total: STEPS.length }))}</p>
            <button type="button" class="icon-btn" data-quote-close style="border-color:var(--line)" aria-label="${esc(t('quote.close'))}">✕</button></div>
          <div class="quote__progress" role="progressbar" aria-valuemin="1" aria-valuemax="${STEPS.length}" aria-valuenow="${S.step + 1}" aria-label="${esc(t('quote.title'))}"><i style="width:${((S.step + 1) / STEPS.length) * 100}%"></i></div>
        </div>
        <div class="quote__body">
          <h2 class="quote__legend" id="quoteLegend" tabindex="-1">${esc(t('quote.steps.' + id))}</h2>
          ${stepHtml(id)}
        </div>
        <div class="quote__foot">
          <button type="button" class="btn btn--ghost" data-quote-prev ${S.step === 0 ? 'disabled' : ''}><span>${esc(t('quote.back'))}</span></button>
          <button type="submit" class="btn btn--primary"><span>${esc(last ? (demo() ? t('quote.submitDemo') : t('quote.submit')) : t('quote.next'))}</span>${arrow()}</button>
        </div>
      </form>
      <aside class="quote__side" aria-label="${esc(t('quote.recap'))}">
        <p class="label">${esc(t('quote.recap'))}</p><dl class="recap" id="quoteRecap">${recapHtml()}</dl>
        ${demo() ? `<p class="quote__demo-note">${esc(t('demo.simulation'))}</p>` : ''}
      </aside>`;
    if (focus !== false) { const lg = $('#quoteLegend'); if (lg) lg.focus({ preventScroll: true }); }
    const live = $('#liveRegion'); if (live) live.textContent = `${t('quote.stepOf', { n: S.step + 1, total: STEPS.length })}: ${t('quote.steps.' + id)}`;
  }

  function showErrors() {
    Object.keys(S.errors).forEach((k) => {
      const p = $('#err-' + k); if (p) p.textContent = S.errors[k];
      const input = $(`[name="${k}"]`); if (input) input.setAttribute('aria-invalid', 'true');
    });
    const first = $('.quote__body [aria-invalid="true"]') || $('.quote__body [role="radio"]');
    if (first) first.focus();
  }

  /* ---------- submit ---------- */
  function payload() {
    const d = S.data;
    return { company: EO.site.company.name, product: recapValue('product'), material: recapValue('material'), finish: recapValue('finish'), glass: recapValue('glass'), project: recapValue('project'), size: recapValue('size'), quantity: d.quantity, installation: recapValue('installation'), location: recapValue('location'), name: d.name, email: d.email, phone: d.phone, message: d.message, language: EO.i18n.lang };
  }

  async function submit() {
    if (demo()) {          // simulation: no network, no storage
      PERSONAL.forEach((k) => { S.data[k] = k === 'consent' ? false : ''; });
      S.done = 'demo'; render(); return;
    }
    const p = payload();
    const endpoint = EO.site.quote && EO.site.quote.endpoint;
    if (endpoint) {
      const btn = $('#quoteForm [type="submit"]'); if (btn) { btn.disabled = true; btn.firstElementChild.textContent = t('quote.sending'); }
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
        S.done = res.ok ? 'ok' : 'fail';
      } catch (e) { S.done = 'fail'; }
    } else if (EO.site.contact && EO.site.contact.email) {
      const body = Object.entries(p).filter(([, v]) => v !== '' && v != null).map(([k, v]) => `${k}: ${v}`).join('\n');
      S.mailto = `mailto:${EO.site.contact.email}?subject=${encodeURIComponent(t('quote.title') + ' — ' + EO.site.company.name)}&body=${encodeURIComponent(body)}`;
      S.done = 'mailto';
    } else S.done = 'fail';
    render();
  }

  /* ---------- public API ---------- */
  function wipePersonal() { PERSONAL.forEach((k) => { S.data[k] = k === 'consent' ? false : ''; }); }

  EO.quote = {
    open(o = {}) {
      const d = $('#quoteDialog');
      if (S.done) S = fresh();
      if (o.prefill) {
        const p = Object.assign({}, o.prefill, { project: o.prefill.projectType || o.prefill.project });
        ['product', 'material', 'project', 'glass', 'finish'].forEach((k) => { S.data[k] = p[k] || ''; });
        S.step = Math.max(0, ['product', 'material', 'project'].findIndex((k) => !S.data[k]));
        if (['product', 'material', 'project'].every((k) => S.data[k])) S.step = STEPS.indexOf('size');
      } else if (o.reset) S = fresh();
      S.errors = {};
      render();
      if (!d.open) d.showModal();
      document.body.style.overflow = 'hidden';
    },
    close() { const d = $('#quoteDialog'); if (d.open) d.close(); },
    refresh() { if ($('#quoteDialog').open) render(false); },
    init() {
      const d = $('#quoteDialog');
      d.addEventListener('close', () => { document.body.style.overflow = ''; wipePersonal(); });
      d.addEventListener('click', (e) => { if (e.target === d) d.close(); });

      d.addEventListener('click', (e) => {
        const c = e.target.closest('[data-q]');
        if (c) { const [k, v] = c.dataset.q.split(':'); S.data[k] = v; S.errors = {}; $$(`[data-q^="${k}:"]`).forEach((b) => { const on = b === c; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; }); const p = $('#err-' + k); if (p) p.textContent = ''; updateRecap(); return; }
        const q = e.target.closest('[data-qty]');
        if (q) { const v = Math.min(99, Math.max(1, (Number(S.data.quantity) || 1) + Number(q.dataset.qty))); S.data.quantity = v; $('#qQty').value = v; updateRecap(); return; }
        if (e.target.closest('[data-quote-close]')) { d.close(); return; }
        if (e.target.closest('[data-quote-prev]')) { S.step = Math.max(0, S.step - 1); S.errors = {}; render(); return; }
        if (e.target.closest('[data-quote-restart]')) { S = fresh(); render(); return; }
        if (e.target.closest('[data-quote-back-form]')) { S.done = null; render(); }
      });

      d.addEventListener('input', (e) => {
        const el = e.target; if (!el.name) return;
        if (el.type === 'checkbox') S.data[el.name] = el.checked; else S.data[el.name] = el.name === 'quantity' ? (el.value === '' ? '' : Number(el.value.replace(/\D/g, ''))) : el.value;
        if (el.name === 'sizeUnknown') { $('#qWidth').disabled = $('#qHeight').disabled = el.checked; }
        if (el.getAttribute('aria-invalid')) { el.removeAttribute('aria-invalid'); const p = $('#err-' + el.name); if (p) p.textContent = ''; }
        updateRecap();
      });

      // keep the focused field above the phone keyboard
      d.addEventListener('focusin', (e) => { const el = e.target; if (el.matches && el.matches('input, select, textarea')) setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 320); });

      d.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = STEPS[S.step];
        if (!validate(id)) { showErrors(); return; }
        if (S.step < STEPS.length - 1) { S.step += 1; render(); } else submit();
      });
    }
  };
})();
