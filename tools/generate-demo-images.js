#!/usr/bin/env node
/*
 * Generates the demo illustrations in /assets/images.
 * They are abstract architectural renderings (SVG) so the template ships
 * without third-party photography. Replace any file with a real photo (jpg/webp)
 * and update the path in /data/*.js — nothing else is needed.
 *
 *   node tools/generate-demo-images.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'images');
fs.mkdirSync(OUT, { recursive: true });

const rnd = (seed) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};
const f = (n) => Number(n.toFixed(1));
const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('');
const lg = (id, a, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(a)}</linearGradient>`;
const rg = (id, a, cx = 0.5, cy = 0.5, r = 0.5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops(a)}</radialGradient>`;
const rect = (x, y, w, h, fill, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${extra}/>`;
const poly = (pts, fill, extra = '') => `<polygon points="${pts.map((p) => p.map(f).join(',')).join(' ')}" fill="${fill}" ${extra}/>`;
const svg = (w, h, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${body}</svg>\n`;

const PAL = {
  dusk: { sky: [[0, '#151b2a'], [0.4, '#4a4c66'], [0.68, '#c98f78'], [1, '#f1c690']], sun: '#ffd7a0', ridge: ['#7a6a78', '#54495d', '#2d2a3a'], water: [[0, '#d7a780'], [1, '#1c1f2a']] },
  day: { sky: [[0, '#7c9fc2'], [0.6, '#b8cee0'], [1, '#e7e7dd']], sun: '#ffffff', ridge: ['#93a6ab', '#688283', '#405856'], water: [[0, '#adc3cb'], [1, '#34505a']] },
  mist: { sky: [[0, '#88929e'], [0.6, '#c2c6c8'], [1, '#e3e0d8']], sun: '#f6f1e7', ridge: ['#a0a8aa', '#7a8683', '#4b5753'], water: [[0, '#c3c8c8'], [1, '#46565d']] },
  gold: { sky: [[0, '#262b3a'], [0.5, '#86706e'], [0.8, '#dfa66f'], [1, '#f5d6a4']], sun: '#ffdca4', ridge: ['#76666a', '#4f4650', '#2a2831'], water: [[0, '#dcae82'], [1, '#232733']] },
};

let uid = 0;
function landscape(x, y, w, h, pal, { seed = 1, horizon = 0.6, sunX = 0.4 } = {}) {
  const id = `l${++uid}`;
  const hz = y + h * horizon;
  const r = rnd(seed);
  const ridge = (base, amp, sd, color, op = 1) => {
    const q = rnd(sd);
    const ph = [q() * 6, q() * 6, q() * 6];
    let d = `M${x} ${f(base + 400)} L${x} ${f(base)}`;
    for (let i = 0; i <= w; i += 16) {
      const t = i / w;
      const v = Math.sin(t * 5 + ph[0]) * 0.5 + Math.sin(t * 11 + ph[1]) * 0.3 + Math.sin(t * 23 + ph[2]) * 0.15;
      d += ` L${f(x + i)} ${f(base - amp * (0.6 + v * 0.5))}`;
    }
    return `<path d="${d} L${x + w} ${f(base + 400)}Z" fill="${color}" opacity="${op}"/>`;
  };
  const pines = () => {
    let s = '';
    for (let i = 0; i < 14; i++) {
      const side = i < 7 ? 0.02 + r() * 0.22 : 0.74 + r() * 0.24;
      const px = x + w * side;
      const ph = h * (0.05 + r() * 0.07);
      const pw = ph * 0.22;
      s += poly([[px, hz - ph * 0.2 - ph], [px + pw, hz + 4], [px - pw, hz + 4]], pal.ridge[2], 'opacity=".9"');
    }
    return s;
  };
  const ripples = Array.from({ length: 9 }, (_, i) => {
    const yy = hz + (y + h - hz) * (0.08 + i * 0.1);
    const len = w * (0.08 + r() * 0.2);
    return rect(x + w * (0.1 + r() * 0.7), yy, len, 1.4, '#fff', 'opacity=".12"');
  }).join('');
  const defs =
    lg(`${id}s`, pal.sky) + lg(`${id}w`, pal.water) +
    rg(`${id}g`, [[0, pal.sun, 0.95], [0.35, pal.sun, 0.28], [1, pal.sun, 0]]) +
    `<clipPath id="${id}c"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`;
  const body =
    `<g clip-path="url(#${id}c)">` +
    rect(x, y, w, hz - y + 2, `url(#${id}s)`) +
    `<circle cx="${f(x + w * sunX)}" cy="${f(hz - h * 0.04)}" r="${f(w * 0.42)}" fill="url(#${id}g)"/>` +
    ridge(hz - h * 0.02, h * 0.22, seed + 1, pal.ridge[0], 0.75) +
    ridge(hz + h * 0.005, h * 0.14, seed + 2, pal.ridge[1], 0.9) +
    ridge(hz + h * 0.02, h * 0.06, seed + 3, pal.ridge[2]) +
    pines() +
    rect(x, hz + 3, w, y + h - hz, `url(#${id}w)`) +
    rect(x + w * (sunX - 0.05), hz + 3, w * 0.1, (y + h - hz) * 0.7, pal.sun, 'opacity=".16"') +
    ripples + `</g>`;
  return { defs, body };
}

/* frame: thin black aluminium frame with mullions and a glass sheen */
function frame(x, y, w, h, { t = 8, mull = [], transom = [], color = '#0b0b0c', sheen = true } = {}) {
  let s = '';
  s += rect(x - t, y - t, w + 2 * t, t, color) + rect(x - t, y + h, w + 2 * t, t, color);
  s += rect(x - t, y - t, t, h + 2 * t, color) + rect(x + w, y - t, t, h + 2 * t, color);
  mull.forEach((m) => (s += rect(x + w * m - t / 2, y, t, h, color)));
  transom.forEach((m) => (s += rect(x, y + h * m - t / 2, w, t, color)));
  if (sheen) {
    const id = `sh${++uid}`;
    s += `<defs>${lg(id, [[0, '#fff', 0.14], [0.45, '#fff', 0.02], [0.55, '#fff', 0.07], [1, '#fff', 0]], 0, 0, 1, 1)}</defs>` + rect(x, y, w, h, `url(#${id})`);
  }
  return s;
}

const vignette = (w, h, a = 0.55) => {
  const id = `v${++uid}`;
  return `<defs>${rg(id, [[0.55, '#000', 0], [1, '#000', a]], 0.5, 0.5, 0.75)}</defs>` + rect(0, 0, w, h, `url(#${id})`);
};

const write = (name, content) => {
  fs.writeFileSync(path.join(OUT, name), content);
  console.log('wrote', name);
};

/* ---------- Hero: terrace view ---------- */
function hero() {
  const W = 1920, H = 1080;
  const L = landscape(0, 0, W, H, PAL.dusk, { seed: 7, horizon: 0.58, sunX: 0.32 });
  const defs = L.defs +
    lg('slab', [[0, '#0a0a0b'], [1, '#1c1c1e']]) +
    lg('floor', [[0, '#6a645b'], [0.25, '#3b3833'], [1, '#191816']]) +
    lg('glassR', [[0, '#e6b389', 0.22], [1, '#e6b389', 0]], 0, 0, 1, 0);
  let b = L.body;
  // roof slab with overhang
  b += poly([[880, 0], [W, 0], [W, 170], [1010, 214], [780, 190]], 'url(#slab)');
  b += poly([[780, 190], [1010, 214], [W, 170], [W, 178], [1010, 222], [770, 198]], '#2b2b2d');
  // columns / mullions
  [[1090, 30], [1330, 30], [1600, 14]].forEach(([x, w]) => (b += rect(x, 200, w, 600, '#0b0b0c')));
  b += rect(1090, 200, 830, 8, '#0b0b0c');
  b += rect(1090, 200, 830, 600, 'url(#glassR)');
  // interior warm glow (right side)
  b += `<defs>${rg('warm', [[0, '#f0b070', 0.35], [1, '#f0b070', 0]], 0.5, 0.6, 0.5)}</defs>` + rect(1120, 250, 800, 560, 'url(#warm)');
  // terrace floor
  b += poly([[0, 770], [W, 790], [W, H], [0, H]], 'url(#floor)');
  for (let i = 1; i < 9; i++) b += `<line x1="${i * 260 - 300}" y1="${H}" x2="${1200 + i * 90 - 300}" y2="780" stroke="#000" stroke-opacity=".22" stroke-width="2"/>`;
  b += rect(0, 770, W, 3, '#0a0a0a', 'opacity=".7"');
  // lounge furniture
  b += rect(1300, 800, 420, 90, '#181817') + rect(1300, 760, 420, 44, '#22211f') + rect(1290, 770, 30, 110, '#111');
  b += rect(1560, 860, 260, 36, '#0d0d0d') + rect(1580, 896, 8, 40, '#0d0d0d') + rect(1790, 896, 8, 40, '#0d0d0d');
  b += rect(1020, 880, 200, 20, '#101010', 'opacity=".9"');
  b += vignette(W, H, 0.5);
  write('hero-villa.svg', svg(W, H, defs, b));
}

/* ---------- Category images (4:5) ---------- */
function catWindows() {
  const W = 800, H = 1000;
  const L = landscape(120, 150, 560, 560, PAL.day, { seed: 21, horizon: 0.55, sunX: 0.6 });
  const defs = L.defs + lg('wall', [[0, '#3a3835'], [1, '#22201e']]) + rg('lamp', [[0, '#ffcf8f', 0.5], [1, '#ffcf8f', 0]]);
  let b = rect(0, 0, W, H, 'url(#wall)');
  b += L.body + frame(120, 150, 560, 560, { t: 16, mull: [], transom: [] });
  b += rect(90, 726, 620, 14, '#cfc9be', 'opacity=".85"');
  b += rect(0, 740, W, 260, '#1a1917');
  b += rect(60, 780, 360, 150, '#2c2b2a') + rect(60, 740, 360, 60, '#353432') + rect(560, 700, 6, 240, '#151515') + `<circle cx="563" cy="690" r="150" fill="url(#lamp)"/>` + rect(520, 684, 86, 30, '#d9cbb0', 'opacity=".9"');
  b += vignette(W, H, 0.45);
  write('cat-windows.svg', svg(W, H, defs, b));
}
function catDoors() {
  const W = 800, H = 1000;
  const defs = lg('stone', [[0, '#a19b90'], [1, '#6f6a61']]) + rg('lampd', [[0, '#ffd9a0', 0.55], [1, '#ffd9a0', 0]]) + lg('doorg', [[0, '#1c1c1c'], [1, '#0d0d0d']], 0, 0, 1, 0);
  let b = rect(0, 0, W, H, 'url(#stone)');
  for (let i = 0; i < 16; i++) b += rect(i * 52, 0, 2, H, '#000', 'opacity=".08"');
  b += rect(230, 110, 340, 800, '#0b0b0b');
  b += rect(246, 126, 308, 768, 'url(#doorg)');
  for (let i = 0; i < 9; i++) b += rect(246 + i * 34.2, 126, 1.5, 768, '#fff', 'opacity=".045"');
  b += rect(520, 420, 8, 250, '#c9ac82') + rect(514, 420, 20, 6, '#c9ac82');
  b += rect(168, 110, 46, 800, '#0b0b0b') + rect(176, 126, 30, 768, '#e0b078', 'opacity=".55"');
  b += `<circle cx="640" cy="330" r="190" fill="url(#lampd)"/>` + rect(628, 300, 24, 60, '#f7e6c8');
  b += rect(0, 910, W, 90, '#25231f') + rect(40, 800, 12, 120, '#121513') + poly([[46, 700], [110, 800], [46, 812]], '#1a201b') + poly([[46, 740], [-20, 820], [46, 830]], '#1a201b');
  b += vignette(W, H, 0.5);
  write('cat-doors.svg', svg(W, H, defs, b));
}
function catSliding() {
  const W = 800, H = 1000;
  const L = landscape(40, 130, 720, 640, PAL.gold, { seed: 33, horizon: 0.6, sunX: 0.5 });
  const defs = L.defs + lg('fl', [[0, '#4d473f'], [1, '#191816']]) + lg('rf', [[0, '#e5b98a', 0.35], [1, '#e5b98a', 0]]);
  let b = rect(0, 0, W, H, '#1c1b19') + L.body + frame(40, 130, 720, 640, { t: 12, mull: [0.333, 0.667] });
  b += rect(0, 782, W, 218, 'url(#fl)') + rect(220, 782, 360, 120, 'url(#rf)');
  b += rect(90, 700, 240, 60, '#151412') + rect(90, 660, 240, 44, '#211f1c');
  b += rect(0, 0, W, 130, '#0e0d0c');
  b += vignette(W, H, 0.45);
  write('cat-sliding.svg', svg(W, H, defs, b));
}
function facadeBlock(x, y, w, h, floors, cols, rand, { warm = 0.45 } = {}) {
  let s = rect(x, y, w, h, '#151516');
  const fh = h / floors, cw = w / cols;
  for (let i = 0; i < floors; i++) {
    s += rect(x, y + i * fh, w, 10, '#2a2a2c');
    for (let j = 0; j < cols; j++) {
      const lit = rand() < warm;
      const gx = x + j * cw + 12, gy = y + i * fh + 18;
      s += rect(gx, gy, cw - 24, fh - 34, lit ? '#e0aa70' : '#5f6f80', `opacity="${lit ? 0.85 : 0.6}"`);
      s += rect(gx + (cw - 24) / 2 - 2, gy, 4, fh - 34, '#0e0e0f');
    }
    s += rect(x, y + i * fh + fh - 14, w, 3, '#8a949b', 'opacity=".55"');
  }
  return s;
}
function catFacades() {
  const W = 800, H = 1000;
  const r = rnd(5);
  const defs = lg('fs', [[0, '#1a2030'], [0.6, '#5a566c'], [1, '#d59b78']]);
  let b = rect(0, 0, W, H, 'url(#fs)');
  b += facadeBlock(60, 200, 480, 700, 6, 3, r);
  b += facadeBlock(540, 330, 240, 570, 5, 2, r, { warm: 0.3 });
  b += rect(0, 900, W, 100, '#0b0b0c');
  b += poly([[600, 900], [700, 780], [760, 900]], '#0d1210', 'opacity=".9"');
  b += vignette(W, H, 0.45);
  write('cat-facades.svg', svg(W, H, defs, b));
}

/* ---------- Technical profile cross-section (4:5) ---------- */
function profile() {
  const W = 1300, H = 1250;
  const defs =
    lg('pbg', [[0, '#1d1d1e'], [1, '#080808']], 0, 0, 1, 1) +
    lg('metal', [[0, '#2b2b2d'], [0.5, '#171718'], [1, '#232325']], 0, 0, 1, 1) +
    lg('gl', [[0, '#5f8f88', 0.55], [1, '#2a4b47', 0.75]], 0, 0, 1, 0) +
    lg('sheen', [[0, '#fff', 0.16], [0.4, '#fff', 0], [1, '#fff', 0.05]], 0, 0, 1, 1) +
    rg('spot', [[0, '#fff', 0.09], [1, '#fff', 0]], 0.4, 0.6, 0.55);
  let b = rect(0, 0, W, H, 'url(#pbg)') + rect(0, 0, W, H, 'url(#spot)');
  // glass sheets
  [440, 500, 560].forEach((x) => (b += rect(x, 30, 16, 560, 'url(#gl)', 'stroke="#9fc7bf" stroke-opacity=".7" stroke-width="1.5"')));
  // spacer bars
  [440, 500, 560].forEach((x) => (b += rect(x - 6, 560, 28, 40, '#c8c8c6', 'opacity=".9"')));
  // profile body
  const px = 300, py = 600, pw = 560, ph = 560;
  b += `<path d="M${px} ${py} h${pw} v${ph} h-${pw} z" fill="url(#metal)" stroke="#dcdcda" stroke-width="3.5"/>`;
  // chambers
  const ch = [
    [320, 620, 130, 150], [320, 790, 130, 150], [320, 960, 130, 180],
    [470, 620, 90, 90], [470, 730, 90, 200], [470, 950, 90, 190],
    [680, 620, 160, 130], [680, 770, 160, 170], [680, 960, 160, 180],
  ];
  ch.forEach(([x, y, w, h]) => (b += rect(x, y, w, h, '#0c0c0d', 'stroke="#cfcfcd" stroke-width="2.4" rx="4"')));
  // thermal-break polyamide strips
  [[586, 620, 26, 520], [640, 620, 26, 520]].forEach(([x, y, w, h]) => {
    b += rect(x, y, w, h, '#ece5d6', 'stroke="#fff" stroke-width="1.5"');
    for (let k = 0; k < 26; k++) b += `<line x1="${x}" y1="${y + k * 20}" x2="${x + w}" y2="${y + k * 20 + 14}" stroke="#a89f8d" stroke-width="1.6"/>`;
  });
  // gaskets
  b += rect(410, 590, 20, 14, '#050505', 'stroke="#888" stroke-width="1"') + rect(590, 590, 20, 14, '#050505', 'stroke="#888" stroke-width="1"');
  // rebate for glazing
  b += rect(430, 596, 160, 10, '#0b0b0c');
  b += `<path d="M${px} ${py} h${pw} v${ph} h-${pw} z" fill="url(#sheen)"/>`;
  b += rect(0, 1180, W, 70, '#000', 'opacity=".35"');
  write('profile-section.svg', svg(W, H, defs, b));
}

/* ---------- Projects (16:10) ---------- */
function villa({ name, pal, seed, timber = false, pool = false, horizon = 0.5, sunX = 0.3 }) {
  const W = 1600, H = 1000;
  const L = landscape(0, 0, W, H, PAL[pal], { seed, horizon, sunX });
  const defs = L.defs + lg('wood', [[0, '#a3784b'], [1, '#6c4a2c']], 0, 0, 1, 0) + lg('pl', [[0, '#9dc3cc'], [1, '#1f3f4a']]) + lg('lawn', [[0, '#3f4a3a'], [1, '#1a2018']]) + rg('int', [[0, '#ffc98a', 0.55], [1, '#ffc98a', 0]]);
  let b = L.body;
  const gy = H * horizon + 60;
  b += rect(0, gy, W, H - gy, 'url(#lawn)');
  if (pool) b += rect(120, 780, 1000, 150, 'url(#pl)') + rect(120, 780, 1000, 6, '#e8f1f2', 'opacity=".7"') + rect(120, 786, 1000, 40, '#fff', 'opacity=".08"');
  // building volume
  b += rect(360, 260, 1000, 60, '#0d0d0e') + rect(300, 250, 1120, 16, '#181819');
  b += rect(360, 320, 1000, 420, timber ? '#231d17' : '#141415');
  if (timber) for (let i = 0; i < 48; i++) b += rect(360 + i * 21, 320, 14, 420, 'url(#wood)', 'opacity=".9"');
  // glazing
  const gx = timber ? 640 : 420, gw = timber ? 680 : 880;
  b += `<g>${rect(gx, 350, gw, 340, '#3a2b20')}${rect(gx + 20, 370, gw - 40, 300, 'url(#int)')}</g>`;
  b += frame(gx, 350, gw, 340, { t: 10, mull: timber ? [0.25, 0.5, 0.75] : [0.2, 0.4, 0.6, 0.8], transom: [] });
  b += rect(300, 740, 1120, 22, '#2c2b2a') + rect(300, 762, 1120, 8, '#000', 'opacity=".4"');
  b += vignette(W, H, 0.5);
  write(name, svg(W, H, defs, b));
}
function apartments({ name, seed }) {
  const W = 1600, H = 1000, r = rnd(seed);
  const L = landscape(0, 0, W, H, PAL.gold, { seed, horizon: 0.68, sunX: 0.75 });
  let b = L.body;
  b += rect(0, 700, W, 300, '#151815');
  b += facadeBlock(280, 170, 620, 560, 5, 4, r) + facadeBlock(900, 290, 400, 440, 4, 3, r, { warm: 0.3 });
  // balcony rails
  for (let i = 1; i < 5; i++) b += rect(280, 170 + i * 112 - 16, 620, 3, '#c7d0d4', 'opacity=".5"');
  b += [80, 170, 1380, 1470].map((x, i) => poly([[x, 760 - 190 + i * 8], [x + 70, 760], [x - 70, 760]], '#0e1310', 'opacity=".95"')).join('');
  b += vignette(W, H, 0.5);
  write(name, svg(W, H, L.defs, b));
}

/* ---------- CTA interior (5:6) ---------- */
function ctaInterior() {
  const W = 1200, H = 1300;
  const L = landscape(0, 0, W, 900, PAL.day, { seed: 12, horizon: 0.55, sunX: 0.65 });
  const defs = L.defs + lg('cf', [[0, '#8a7f70'], [1, '#2a2622']]);
  let b = L.body;
  b += rect(560, 0, 30, 900, '#0b0b0c') + rect(0, 0, W, 40, '#0b0b0c') + rect(0, 0, 30, 900, '#0b0b0c') + rect(1170, 0, 30, 900, '#0b0b0c');
  b += rect(0, 880, W, 420, 'url(#cf)');
  b += rect(80, 1010, 420, 150, '#1a1a1a') + rect(80, 940, 60, 220, '#141414') + rect(140, 960, 340, 60, '#232323');
  b += rect(700, 1080, 320, 24, '#101010') + rect(730, 1104, 10, 60, '#101010') + rect(980, 1104, 10, 60, '#101010');
  b += vignette(W, H, 0.42);
  write('cta-interior.svg', svg(W, H, defs, b));
}

hero();
catWindows();
catDoors();
catSliding();
catFacades();
profile();
villa({ name: 'project-lake-house.svg', pal: 'dusk', seed: 41, pool: true, horizon: 0.5, sunX: 0.28 });
villa({ name: 'project-lake-house-2.svg', pal: 'gold', seed: 47, pool: false, horizon: 0.56, sunX: 0.6 });
villa({ name: 'project-villa.svg', pal: 'mist', seed: 53, timber: true, horizon: 0.5, sunX: 0.5 });
villa({ name: 'project-villa-2.svg', pal: 'day', seed: 59, timber: true, pool: true, horizon: 0.52, sunX: 0.3 });
apartments({ name: 'project-apartments.svg', seed: 61 });
apartments({ name: 'project-apartments-2.svg', seed: 67 });
ctaInterior();
