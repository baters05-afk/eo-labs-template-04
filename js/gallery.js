/* Project gallery (native <dialog>): arrows, keyboard, index counter, demo badge. */
(function () {
  'use strict';
  const EO = window.EO;
  const { esc, ICON, pad, $, t, tr, asImg } = EO.ui;
  let slides = [];
  let index = 0;
  let built = false;

  function buildSlides() {
    slides = [];
    EO.data.projects().forEach((p) => (p.images || []).forEach((im) => slides.push({ project: p, image: asImg(im) })));
  }

  function skeleton() {
    $('#galleryInner').innerHTML = `
      <div class="gallery__bar"><span class="gallery__index" id="gIndex" aria-live="polite"></span>
        <button type="button" class="icon-btn" data-gallery-close>${esc(t('projects.close'))}</button></div>
      <div class="gallery__stage">
        <button type="button" class="gallery__btn gallery__btn--prev" data-gallery-step="-1" aria-label="${esc(t('projects.prev'))}">${ICON.left}</button>
        <img id="gImg" alt="" decoding="async">
        <button type="button" class="gallery__btn gallery__btn--next" data-gallery-step="1" aria-label="${esc(t('projects.next'))}">${ICON.arrow}</button>
      </div>
      <div class="gallery__caption"><div><h3 id="gTitle"></h3><p id="gDesc"></p></div><span class="badge" id="gBadge" style="color:#F4F1EB;border-color:rgba(255,255,255,.3)"></span></div>`;
    $('#galleryDialog').setAttribute('aria-label', t('projects.gallery'));
    built = true;
  }

  function show() {
    const s = slides[index];
    if (!s) return;
    const img = $('#gImg');
    img.style.opacity = '0';
    img.onload = () => { img.style.transition = 'opacity 320ms ease'; img.style.opacity = '1'; };
    img.src = s.image.src;
    if (img.complete) img.style.opacity = '1';
    img.alt = tr(s.image.alt) || tr(s.project.title);
    $('#gIndex').textContent = `${pad(index)} ${t('projects.of')} ${String(slides.length).padStart(2, '0')}`;
    $('#gTitle').textContent = tr(s.project.title);
    $('#gDesc').textContent = [tr(s.project.category), s.project.location, tr(s.project.description)].filter(Boolean).join(' · ');
    const isDemo = EO.site.demoMode || s.project.demo;
    $('#gBadge').textContent = t('demo.imagery');
    $('#gBadge').hidden = !isDemo;
  }

  EO.gallery = {
    open(projectId) {
      buildSlides();
      if (!slides.length) return;
      skeleton();
      index = Math.max(0, slides.findIndex((s) => s.project.id === projectId));
      const d = $('#galleryDialog');
      if (!d.open) d.showModal();
      document.body.style.overflow = 'hidden';
      show();
    },
    step(n) { if (!slides.length) return; index = (index + n + slides.length) % slides.length; show(); },
    close() { const d = $('#galleryDialog'); if (d.open) d.close(); },
    refresh() { if ($('#galleryDialog').open) { const id = slides[index] && slides[index].project.id; this.open(id); } },
    init() {
      const d = $('#galleryDialog');
      d.addEventListener('close', () => { document.body.style.overflow = ''; });
      d.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); EO.gallery.step(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); EO.gallery.step(-1); }
      });
    }
  };
})();
