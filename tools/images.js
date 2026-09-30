#!/usr/bin/env node
/*
 * Image pipeline (no npm dependencies; needs macOS `sips`, `cwebp`, optionally `ffmpeg` with libsvtav1 for AVIF).
 *
 *   1. put source photos (jpg/png, ≥2400px wide) in assets/photos-src/   e.g. hero.jpg, hero-mobile.jpg, cat-windows.jpg …
 *   2. node tools/images.js
 *   3. paste the printed objects into data/client.config.js (hero.image, hero.imageMobile, categories[].image, …)
 *
 * Output per photo: assets/photos/<name>-<w>.{avif,webp,jpg} for w in 640/960/1440/1920 (never upscaled).
 * The printed picture object is understood by the templates: { src, srcset, sources:[{type,srcset}], width, height }.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'assets', 'photos-src');
const OUT = path.join(ROOT, 'assets', 'photos');
const WIDTHS = [640, 960, 1440, 1920];
const has = (cmd) => spawnSync('which', [cmd]).status === 0;
const avifOk = has('ffmpeg') && /libsvtav1|libaom/.test(String(spawnSync('ffmpeg', ['-hide_banner', '-encoders']).stdout));

if (!fs.existsSync(SRC)) { console.error(`Create ${path.relative(ROOT, SRC)} and add photos first.`); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

const sizeOf = (f) => { const o = String(execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', f])); return { w: +/pixelWidth: (\d+)/.exec(o)[1], h: +/pixelHeight: (\d+)/.exec(o)[1] }; };
const result = {};

fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f)).forEach((file) => {
  const name = path.basename(file, path.extname(file));
  const src = path.join(SRC, file);
  const { w: sw, h: sh } = sizeOf(src);
  const widths = WIDTHS.filter((w) => w <= sw);
  if (!widths.length) widths.push(sw);
  const sets = { avif: [], webp: [], jpg: [] };
  widths.forEach((w) => {
    const base = path.join(OUT, `${name}-${w}`);
    const jpg = `${base}.jpg`;
    execFileSync('sips', ['--resampleWidth', String(w), '-s', 'format', 'jpeg', '-s', 'formatOptions', '78', src, '--out', jpg], { stdio: 'ignore' });
    execFileSync('cwebp', ['-quiet', '-q', '78', '-m', '5', jpg, '-o', `${base}.webp`]);
    if (avifOk) spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', jpg, '-c:v', 'libsvtav1', '-crf', '34', '-preset', '6', '-pix_fmt', 'yuv420p', '-frames:v', '1', '-f', 'avif', `${base}.avif`]);
    const rel = (ext) => `assets/photos/${name}-${w}.${ext} ${w}w`;
    sets.jpg.push(rel('jpg')); sets.webp.push(rel('webp'));
    if (avifOk && fs.existsSync(`${base}.avif`) && fs.statSync(`${base}.avif`).size > 0) sets.avif.push(rel('avif'));
  });
  const mid = widths[Math.min(2, widths.length - 1)];
  const sources = [];
  if (sets.avif.length) sources.push({ type: 'image/avif', srcset: sets.avif.join(', ') });
  sources.push({ type: 'image/webp', srcset: sets.webp.join(', ') });
  const ratioH = Math.round((sh / sw) * mid);
  result[name] = { src: `assets/photos/${name}-${mid}.jpg`, srcset: sets.jpg.join(', '), sources, width: mid, height: ratioH };
  console.log(`✓ ${name}: ${sw}×${sh} → ${widths.join('/')}${avifOk ? ' (+avif)' : ' (avif encoder not found, webp+jpg only)'}`);
});

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(result, null, 2));
console.log(`\nManifest: assets/photos/manifest.json — paste entries into data/client.config.js`);
