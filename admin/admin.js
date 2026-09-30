/*
 * Local admin (no backend). Edits a working copy of config + data, autosaves to localStorage
 * (the site reads it as a preview layer) and exports/imports JSON or client.override.js.
 * Local tool for EO Labs — do not deploy /admin to a client's production server.
 * The site previews these changes instantly (it re-renders when localStorage differs from the prerendered HTML).
 * To ship: Export client.override.js → /data → run `node tools/build.js`.
 */
(function () {
  'use strict';
  const EO = window.EO;
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const db = EO.resolve(true);
  const W = {
    siteConfig: clone(EO.site),
    categories: clone(db.categories),
    products: clone(db.products),
    materials: clone(db.materials),
    projects: clone(db.projects),
    manufacturers: clone(db.manufacturers),
    faq: clone(db.faq)
  };
  const availableLangs = () => Object.keys(db.translations);
  const enabled = () => W.siteConfig.languages.enabled;
  const ui = { section: 'general', open: {} };

  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const get = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  function set(o, path, v) {
    const ks = path.split('.');
    let c = o;
    ks.slice(0, -1).forEach((k, i) => { if (c[k] == null || typeof c[k] !== 'object') c[k] = /^\d+$/.test(ks[i + 1]) ? [] : {}; c = c[k]; });
    c[ks[ks.length - 1]] = v;
  }
  const slug = (s) => String(s || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';

  /* ---------- persistence ---------- */
  let saveTimer;
  const status = (msg) => { $('#status').textContent = msg; };
  function exportObject() { return { siteConfig: W.siteConfig, categories: W.categories, products: W.products, materials: W.materials, projects: W.projects, manufacturers: W.manufacturers, faq: W.faq }; }
  function save(now) {
    status('Unsaved changes…');
    clearTimeout(saveTimer);
    const run = () => {
      try { localStorage.setItem(EO.STORAGE_KEY, JSON.stringify(exportObject())); status('Saved locally · ' + new Date().toLocaleTimeString()); }
      catch (e) { status('Could not save (storage full? use smaller images or file paths)'); }
    };
    if (now) run(); else saveTimer = setTimeout(run, 350);
  }
  function download(name, text, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ---------- field builders ---------- */
  const val = (path) => get(W, path);
  function text(label, path, o = {}) {
    const v = val(path);
    const tag = o.rows ? `<textarea data-path="${path}" rows="${o.rows}">${esc(v)}</textarea>` : `<input type="${o.type || 'text'}" data-path="${path}" value="${esc(v)}" ${o.placeholder ? `placeholder="${esc(o.placeholder)}"` : ''}>`;
    return `<div class="field"><label>${esc(label)}${o.lang ? `<span class="lang">${o.lang}</span>` : ''}</label>${tag}${o.hint ? `<p class="hint">${esc(o.hint)}</p>` : ''}</div>`;
  }
  const loc = (label, base, o = {}) => enabled().map((l) => text(label, `${base}.${l}`, Object.assign({}, o, { lang: l.toUpperCase() }))).join('');
  const check = (label, path, hint) => `<div class="field"><label class="check"><input type="checkbox" data-path="${path}" ${val(path) ? 'checked' : ''}><span>${esc(label)}</span></label>${hint ? `<p class="hint">${esc(hint)}</p>` : ''}</div>`;
  const select = (label, path, options) => `<div class="field"><label>${esc(label)}</label><select data-path="${path}">${options.map(([v, l]) => `<option value="${esc(v)}" ${val(path) === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>`;
  const lines = (label, path, hint) => `<div class="field"><label>${esc(label)}</label><textarea data-path="${path}" data-kind="lines" rows="3">${esc((val(path) || []).join('\n'))}</textarea>${hint ? `<p class="hint">${esc(hint)}</p>` : ''}</div>`;
  const locLines = (label, path) => enabled().map((l) => `<div class="field"><label>${esc(label)}<span class="lang">${l.toUpperCase()}</span></label><textarea data-path="${path}" data-kind="locLines" data-lang="${l}" rows="3">${esc((val(path) || []).map((x) => (x && x[l]) || '').join('\n'))}</textarea></div>`).join('');
  const multi = (label, path, options) => `<div class="field"><span class="lbl">${esc(label)}</span><div class="row">${options.map(([v, l]) => `<label class="check"><input type="checkbox" data-path="${path}" data-kind="multi" value="${esc(v)}" ${(val(path) || []).indexOf(v) > -1 ? 'checked' : ''}><span>${esc(l)}</span></label>`).join('')}</div></div>`;
  function colorField(label, path) {
    const v = val(path) || '';
    return `<div class="field"><label>${esc(label)}</label><div class="row"><input type="color" data-path="${path}" value="${/^#[0-9a-f]{6}$/i.test(v) ? v : '#888888'}" aria-label="${esc(label)}"><input type="text" data-path="${path}" data-kind="color" value="${esc(v)}" placeholder="preset default"><button type="button" class="btn btn--ghost btn--sm" data-act="clear" data-path="${path}">Reset</button></div></div>`;
  }
  function image(label, path, hint) {
    const v = val(path) || '';
    return `<div class="field"><label>${esc(label)}</label><div class="row"><input type="text" data-path="${path}" value="${esc(v.startsWith('data:') ? '(uploaded image)' : v)}" ${v.startsWith('data:') ? 'readonly' : ''} placeholder="assets/images/…"><label class="btn btn--ghost btn--sm">Upload<input type="file" accept="image/*" hidden data-upload="${path}"></label></div>${hint ? `<p class="hint">${esc(hint)}</p>` : ''}</div>`;
  }
  function images(label, path) {
    const list = val(path) || [];
    const src = (im) => (typeof im === 'string' ? im : im && im.src) || '';
    return `<div class="field"><span class="lbl">${esc(label)}</span><div class="thumbs">${list.map((im, i) => `<div class="thumb"><img src="${esc(src(im).startsWith('data:') || /^(https?:|\/)/.test(src(im)) ? src(im) : '../' + src(im))}" alt=""><input type="text" data-path="${path}.${i}${typeof im === 'string' ? '' : '.src'}" value="${esc(src(im).startsWith('data:') ? '(uploaded)' : src(im))}" ${src(im).startsWith('data:') ? 'readonly' : ''}><button type="button" class="btn btn--danger btn--sm" data-act="img-del" data-path="${path}" data-i="${i}">Remove</button></div>`).join('')}</div>
      <div class="row"><button type="button" class="btn btn--ghost btn--sm" data-act="img-add" data-path="${path}">Add path</button><label class="btn btn--ghost btn--sm">Upload<input type="file" accept="image/*" hidden data-upload-add="${path}"></label></div></div>`;
  }
  function finishes(path) {
    const list = val(path) || [];
    return `<div class="field"><span class="lbl">Finishes</span>${list.map((f, i) => `<div class="fin">${enabled().map((l) => `<input type="text" data-path="${path}.${i}.name.${l}" value="${esc(f.name && f.name[l])}" placeholder="Name ${l.toUpperCase()}" aria-label="Finish name ${l}">`).join('')}
      <input type="text" data-path="${path}.${i}.color" value="${esc(f.color)}" placeholder="#hex / gradient" aria-label="Colour">
      <input type="color" data-path="${path}.${i}.color" value="${/^#[0-9a-f]{6}$/i.test(f.color) ? f.color : '#888888'}" aria-label="Pick colour">
      <button type="button" class="btn btn--danger btn--sm" data-act="fin-del" data-path="${path}" data-i="${i}">✕</button></div>`).join('')}
      <button type="button" class="btn btn--ghost btn--sm" data-act="fin-add" data-path="${path}">Add finish</button></div>`;
  }

  /* ---------- list editor ---------- */
  const LISTS = {
    products: { title: (x) => (x.title && (x.title.en || Object.values(x.title)[0])) || x.id, sub: (x) => x.category, blank: () => ({ id: 'new-product', category: (W.categories[0] || {}).id || '', title: {}, description: {}, images: [], material: [], features: [], specs: {}, active: true }),
      fields: (p, x) => `${text('ID', `${p}.id`)}${select('Category', `${p}.category`, W.categories.map((c) => [c.id, (c.title && c.title.en) || c.id]))}${loc('Title', `${p}.title`)}${loc('Description', `${p}.description`, { rows: 3 })}${images('Images (empty = category image)', `${p}.images`)}${multi('Material', `${p}.material`, W.materials.map((m) => [m.id, (m.title && m.title.en) || m.id]))}${locLines('Features (one per line)', `${p}.features`)}${check('Active', `${p}.active`)}` },
    materials: { title: (x) => (x.title && x.title.en) || x.id, blank: () => ({ id: 'new-material', title: {}, subtitle: {}, description: {}, finishes: [], features: [], image: '', active: true }),
      fields: (p) => `${text('ID', `${p}.id`)}${loc('Title', `${p}.title`)}${loc('Subtitle', `${p}.subtitle`)}${loc('Description', `${p}.description`, { rows: 3 })}${finishes(`${p}.finishes`)}${locLines('Features (one per line)', `${p}.features`)}${image('Image (optional)', `${p}.image`)}${check('Active', `${p}.active`)}` },
    projects: { title: (x) => (x.title && x.title.en) || x.id, sub: (x) => (x.demo ? 'demo' : ''), blank: () => ({ id: 'new-project', title: {}, category: {}, location: '', images: [], material: [], description: {}, active: true, demo: false, featured: true }),
      fields: (p) => `${text('ID', `${p}.id`)}${loc('Title', `${p}.title`)}${loc('Type (e.g. Residential)', `${p}.category`)}${text('Location', `${p}.location`)}${images('Images', `${p}.images`)}${multi('Material', `${p}.material`, W.materials.map((m) => [m.id, (m.title && m.title.en) || m.id]))}${loc('Description', `${p}.description`, { rows: 3 })}${check('Active', `${p}.active`)}${check('Demo project (hidden automatically when Demo mode is off)', `${p}.demo`)}${check('Featured on homepage', `${p}.featured`)}` },
    manufacturers: { title: (x) => x.name || 'New', blank: () => ({ name: '', logo: '', url: '', active: true }),
      fields: (p) => `${text('Name', `${p}.name`)}${image('Logo', `${p}.logo`)}${text('URL', `${p}.url`, { type: 'url' })}${check('Active', `${p}.active`)}` },
    faq: { title: (x) => (x.question && x.question.en) || x.id, blank: () => ({ id: 'new-question', question: {}, answer: {}, active: true }),
      fields: (p) => `${text('ID', `${p}.id`)}${loc('Question', `${p}.question`)}${loc('Answer', `${p}.answer`, { rows: 4 })}${check('Active', `${p}.active`)}` }
  };

  function listEditor(name, heading, lead) {
    const cfg = LISTS[name], list = W[name];
    const open = ui.open[name];
    return `<h1>${heading}</h1><p class="lead">${lead}</p>
      <div class="row" style="margin-bottom:1rem"><button type="button" class="btn" data-act="add" data-list="${name}">Add</button></div>
      <div class="list">${list.length ? list.map((x, i) => `<div class="item ${x.active === false ? 'is-off' : ''}">
        <div class="item__head"><span class="item__title">${esc(cfg.title(x))}<small>${esc(cfg.sub ? cfg.sub(x) : '')}${x.active === false ? ' · inactive' : ''}</small></span>
          <button type="button" class="btn btn--ghost btn--sm" data-act="move" data-list="${name}" data-i="${i}" data-d="-1" aria-label="Move up" ${i === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" class="btn btn--ghost btn--sm" data-act="move" data-list="${name}" data-i="${i}" data-d="1" aria-label="Move down" ${i === list.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" class="btn btn--ghost btn--sm" data-act="toggle" data-list="${name}" data-i="${i}" aria-expanded="${open === i}">${open === i ? 'Close' : 'Edit'}</button>
          <button type="button" class="btn btn--danger btn--sm" data-act="del" data-list="${name}" data-i="${i}">Delete</button></div>
        ${open === i ? `<div class="item__body">${cfg.fields(`${name}.${i}`, x)}</div>` : ''}</div>`).join('') : '<p class="hint" style="padding:1rem 0">Empty.</p>'}</div>`;
  }

  /* ---------- panels ---------- */
  const PANELS = {
    general: ['General', () => `<h1>General</h1><p class="lead">Company identity used in header, footer, schema and metadata.</p><div class="grid">
      ${text('Company name', 'siteConfig.company.name')}${text('Short name (header)', 'siteConfig.company.shortName')}${text('Legal name', 'siteConfig.company.legalName')}</div>
      ${loc('Footer description (live sites)', 'siteConfig.company.description', { rows: 2 })}
      <h2>Logo &amp; images</h2>${image('Logo', 'siteConfig.company.logo', 'Single-colour SVG works best with “follows theme colour”.')}
      ${check('Logo follows theme colour (single-colour SVG)', 'siteConfig.company.logoMono')}${image('Favicon', 'siteConfig.company.favicon')}${image('Hero image', 'siteConfig.hero.image.src', 'Single file path. For AVIF/WebP sets use client.override.js (see CLIENT_SETUP.md). Preload is generated by the build.')}${image('Hero image — mobile (optional)', 'siteConfig.hero.imageMobile.src', 'Different crop / focal point for phones.')}${image('CTA image', 'siteConfig.cta.image.src')}${image('Technical profile image', 'siteConfig.technical.image.src')}`],
    contact: ['Contact', () => `<h1>Contact</h1><p class="lead">Shown in the footer and schema. In demo mode placeholders are displayed instead.</p><div class="grid">
      ${text('Phone', 'siteConfig.contact.phone', { type: 'tel' })}${text('Email', 'siteConfig.contact.email', { type: 'email' })}${text('WhatsApp (international number)', 'siteConfig.contact.whatsapp')}</div>
      ${text('Address', 'siteConfig.contact.address')}${lines('Service area (country codes, one per line)', 'siteConfig.serviceAreas', 'e.g. DE, AT, CH, BE, NL')}
      <h2>Social</h2><div class="grid">${text('Instagram URL', 'siteConfig.socials.instagram', { type: 'url' })}${text('LinkedIn URL', 'siteConfig.socials.linkedin', { type: 'url' })}${text('YouTube URL', 'siteConfig.socials.youtube', { type: 'url' })}</div>
      <h2>Legal links</h2><div class="grid">${text('Privacy URL', 'siteConfig.legal.privacy')}${text('Terms URL', 'siteConfig.legal.terms')}${text('Cookie settings URL', 'siteConfig.legal.cookies')}</div>`],
    design: ['Branding', () => `<h1>Branding</h1><p class="lead">Pick a visual preset, then override single colours if the client has brand colours. “Reset” returns to the preset value.</p>
      ${select('Preset', 'siteConfig.themePreset', EO.presets.map((p) => [p, EO.presetNames[p]]))}
      <div class="grid">${colorField('Primary — dark surface', 'siteConfig.branding.primary')}${colorField('Secondary — light surface', 'siteConfig.branding.secondary')}${colorField('Accent', 'siteConfig.branding.accent')}${colorField('Base / footer', 'siteConfig.branding.black')}${colorField('Text on light', 'siteConfig.branding.textDark')}${colorField('Text on dark', 'siteConfig.branding.textLight')}${colorField('Muted text', 'siteConfig.branding.muted')}</div>`],
    products: ['Products', () => listEditor('products', 'Products', 'The filterable range on the homepage. Categories themselves live in data/products.js.')],
    materials: ['Materials', () => listEditor('materials', 'Materials', 'Materials with finish swatches. Finish colour accepts any CSS background value.')],
    projects: ['Projects', () => listEditor('projects', 'Projects', 'Reference projects. Reorder with the arrows. Only projects with “Featured” appear on the homepage (max 3).')],
    manufacturers: ['Manufacturers', () => listEditor('manufacturers', 'Manufacturers', 'Only add brands the client genuinely works with. Hidden in demo mode.')],
    faq: ['FAQ', () => listEditor('faq', 'FAQ', 'Displayed as an accordion and as FAQPage schema (only what is visible on the page).')],
    technical: ['Technical', () => `<h1>Technical data</h1><p class="lead">Leave empty to show generic wording. Enter only certified figures for the client’s real systems.</p><div class="grid">
      ${text('Thermal insulation', 'siteConfig.technical.specs.thermal', { placeholder: 'e.g. Up to Uw 0.8 W/m²K' })}${text('Acoustic performance', 'siteConfig.technical.specs.acoustic')}${text('Security', 'siteConfig.technical.specs.security')}${text('Durability', 'siteConfig.technical.specs.durability')}</div>
      <h2>Profile annotations</h2><div class="grid">${text('Triple glazing', 'siteConfig.technical.annotations.glazing')}${text('Thermal break', 'siteConfig.technical.annotations.thermalBreak')}${text('Profile', 'siteConfig.technical.annotations.profile')}${text('Chambers', 'siteConfig.technical.annotations.chambers')}</div>`],
    seo: ['SEO', () => `<h1>SEO</h1><p class="lead">Homepage metadata. Empty fields are generated from translations.</p>${text('Site URL (canonical base)', 'siteConfig.seo.siteUrl', { placeholder: 'https://www.example.com' })}
      ${loc('Title', 'siteConfig.seo.title')}${loc('Description', 'siteConfig.seo.description', { rows: 3 })}${image('Open Graph image', 'siteConfig.seo.ogImage', 'Recommended 1200×630.')}
      ${text('Quote endpoint (live mode)', 'siteConfig.quote.endpoint', { type: 'url', hint: 'POST JSON. Leave empty to prepare a mailto: message instead.' })}`],
    languages: ['Languages', () => `<h1>Languages</h1><p class="lead">Add a language by adding a block to data/translations.js — it then appears here.</p>
      <div class="field"><span class="lbl">Enabled</span><div class="row">${availableLangs().map((l) => `<label class="check"><input type="checkbox" data-kind="lang" value="${l}" ${enabled().indexOf(l) > -1 ? 'checked' : ''}><span>${esc((db.translations[l] || {}).langName || l)} (${l})</span></label>`).join('')}</div></div>
      ${select('Default language', 'siteConfig.languages.default', enabled().map((l) => [l, l.toUpperCase()]))}`],
    mode: ['Demo mode', () => `<h1>Demo mode</h1><p class="lead">When on: DEMO TEMPLATE label, noindex, quote form sends nothing, no LocalBusiness schema, no invented contacts, demo projects labelled. Turn off for a live client site.</p>
      ${check('Demo mode', 'siteConfig.demoMode')}<h2>Features</h2>${['products', 'configurator', 'materials', 'projects', 'manufacturers', 'faq', 'presetSwitcher'].map((k) => check(k, `siteConfig.features.${k}`)).join('')}`],
    data: ['Export / Import', () => `<h1>Export / Import</h1><p class="lead">Changes are autosaved to this browser and previewed on the site. To ship them, export a <b>client.override.js</b> and place it in <code>/data</code> — no code changes needed.</p>
      <div class="row"><button type="button" class="btn" data-act="export-js">Export client.override.js</button><button type="button" class="btn btn--ghost" data-act="export-json">Export JSON</button>
      <label class="btn btn--ghost">Import JSON<input type="file" accept="application/json,.json" hidden data-import></label><button type="button" class="btn btn--danger" data-act="reset">Reset local changes</button></div>
      <h2>Current configuration</h2><textarea class="code" readonly aria-label="Current configuration JSON">${esc(JSON.stringify(exportObject(), null, 2))}</textarea>`]
  };

  function render() {
    $('#nav').innerHTML = Object.entries(PANELS).map(([id, [label]]) => `<button type="button" data-section="${id}" ${id === ui.section ? 'aria-current="page"' : ''}>${esc(label)}</button>`).join('');
    $('#panel').innerHTML = PANELS[ui.section][1]();
  }

  /* ---------- events ---------- */
  function onInput(e) {
    const el = e.target;
    if (el.dataset.import !== undefined || el.dataset.upload || el.dataset.uploadAdd) return;
    if (el.dataset.kind === 'lang') {
      const list = [...document.querySelectorAll('[data-kind="lang"]:checked')].map((x) => x.value);
      if (!list.length) { el.checked = true; return; }
      W.siteConfig.languages.enabled = list;
      if (list.indexOf(W.siteConfig.languages.default) < 0) W.siteConfig.languages.default = list[0];
      save(); return;
    }
    const path = el.dataset.path;
    if (!path) return;
    let v;
    if (el.dataset.kind === 'multi') {
      v = [...document.querySelectorAll(`[data-path="${path}"][data-kind="multi"]:checked`)].map((x) => x.value);
    } else if (el.dataset.kind === 'lines') {
      v = el.value.split('\n').map((s) => s.trim()).filter(Boolean);
    } else if (el.dataset.kind === 'locLines') {
      const ls = el.value.split('\n');
      const arr = val(path) || [];
      const n = Math.max(arr.length, ls.length);
      for (let i = 0; i < n; i++) { arr[i] = arr[i] || {}; arr[i][el.dataset.lang] = (ls[i] || '').trim(); }
      while (arr.length && Object.values(arr[arr.length - 1]).every((x) => !x)) arr.pop();
      v = arr;
    } else if (el.type === 'checkbox') v = el.checked;
    else if (el.dataset.path.indexOf('branding.') > -1) v = el.value || null;
    else v = el.value;
    if (el.readOnly) return;
    set(W, path, v);
    // keep colour picker & hex field in sync
    if (el.type === 'color') { const t = document.querySelector(`input[type="text"][data-path="${path}"]`); if (t) t.value = el.value; }
    if (el.type === 'text' && /^#[0-9a-f]{6}$/i.test(el.value)) { const c = document.querySelector(`input[type="color"][data-path="${path}"]`); if (c) c.value = el.value; }
    if (path === 'siteConfig.themePreset' || path === 'siteConfig.demoMode' || /^(products|materials|projects|manufacturers|faq)\.\d+\.(title|question|name)/.test(path)) { /* labels update on next render */ }
    save();
  }

  function readFile(file, cb) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => cb(r.result);
    r.readAsDataURL(file);
  }

  function onClick(e) {
    const nav = e.target.closest('[data-section]');
    if (nav) { ui.section = nav.dataset.section; render(); $('#panel').focus(); return; }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act, list = b.dataset.list, i = Number(b.dataset.i), path = b.dataset.path;
    switch (act) {
      case 'add': { const item = LISTS[list].blank(); if (item.id) { let id = item.id, n = 2; while (W[list].some((x) => x.id === id)) id = `${item.id}-${n++}`; item.id = id; } W[list].push(item); ui.open[list] = W[list].length - 1; break; }
      case 'del': if (!confirm('Delete this entry?')) return; W[list].splice(i, 1); ui.open[list] = null; break;
      case 'move': { const d = Number(b.dataset.d); const j = i + d; if (j < 0 || j >= W[list].length) return; [W[list][i], W[list][j]] = [W[list][j], W[list][i]]; ui.open[list] = null; break; }
      case 'toggle': ui.open[list] = ui.open[list] === i ? null : i; break;
      case 'clear': set(W, path, null); break;
      case 'img-add': { const arr = val(path) || []; arr.push(path.startsWith('projects') ? { src: '', alt: {} } : ''); set(W, path, arr); break; }
      case 'img-del': { const arr = val(path); arr.splice(i, 1); break; }
      case 'fin-add': { const arr = val(path) || []; arr.push({ id: 'finish-' + (arr.length + 1), name: {}, color: '#888888' }); set(W, path, arr); break; }
      case 'fin-del': { val(path).splice(i, 1); break; }
      case 'export-js': download('client.override.js', `/* Generated by EO Labs Template 04 admin — ${new Date().toISOString()} */\nwindow.EO_OVERRIDE = ${JSON.stringify(exportObject(), null, 2)};\n`, 'text/javascript'); return;
      case 'export-json': download('eo-template-04-config.json', JSON.stringify(exportObject(), null, 2), 'application/json'); return;
      case 'reset': if (!confirm('Remove all local changes and reload defaults?')) return; localStorage.removeItem(EO.STORAGE_KEY); location.reload(); return;
      default: return;
    }
    save(); render();
  }

  function onChange(e) {
    const el = e.target;
    if (el.dataset.upload) { const path = el.dataset.upload; readFile(el.files[0], (d) => { set(W, path, d); save(true); render(); }); }
    else if (el.dataset.uploadAdd) { const path = el.dataset.uploadAdd; readFile(el.files[0], (d) => { const arr = val(path) || []; arr.push(path.startsWith('projects') ? { src: d, alt: {} } : d); set(W, path, arr); save(true); render(); }); }
    else if (el.dataset.import !== undefined) {
      const f = el.files[0]; if (!f) return;
      f.text().then((t) => {
        try {
          const o = JSON.parse(t);
          if (!EO.isObj(o)) throw new Error('not an object');
          const src = o.siteConfig || o.EO_OVERRIDE || null;
          if (src) W.siteConfig = EO.merge(clone(EO.defaults.siteConfig), src);
          ['categories', 'products', 'materials', 'projects', 'manufacturers', 'faq'].forEach((k) => { if (Array.isArray(o[k])) W[k] = o[k]; });
          save(true); render(); status('Imported ' + f.name);
        } catch (err) { alert('Could not import: ' + err.message); }
      });
    } else if (el.dataset.path === 'siteConfig.themePreset' || el.dataset.path === 'siteConfig.demoMode') render();
  }

  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  document.addEventListener('click', onClick);
  // deep links (used for the PDF guide): ?section=seo&open=products:0&hl=siteConfig.company.name,siteConfig.company.logo
  const q = new URLSearchParams(location.search);
  if (q.get('section') && PANELS[q.get('section')]) ui.section = q.get('section');
  if (q.get('open')) { const [l, i] = q.get('open').split(':'); ui.open[l] = Number(i); }
  render();
  if (q.get('hl')) {
    q.get('hl').split(',').forEach((path, n) => {
      const el = document.querySelector(`[data-path="${path}"]`);
      const box = el && (el.closest('.field') || el.parentElement);
      if (box) { box.classList.add('hl-field'); box.dataset.n = n + 1; }
    });
  }
})();
