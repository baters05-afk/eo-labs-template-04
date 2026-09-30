#!/usr/bin/env python3
"""
Cuts a profile cross-section photo into aligned transparent WebP layers for the exploded view.

  python3 tools/make-profile-layers.py [source.jpg]     (default: assets/photos-src/profile.jpg)

Every layer has the SAME canvas as the source, so all layers sit pixel-perfect on top of each other.
Regions are polygons in source-pixel coordinates (POLYS below) — edit them for another client's render.
Priority (later wins): outer < thermal < chambers < glass < seals. `base` = everything else, with the
cut-out regions flattened to the background colour so nothing ghosts when layers separate.
Output: assets/profile/profile-<layer>-<1440|960>.webp  +  assets/profile/preview-preview.png (check image)
"""
import sys, os
from PIL import Image, ImageDraw, ImageFilter

SRC = sys.argv[1] if len(sys.argv) > 1 else 'assets/photos-src/profile.jpg'
OUT = 'assets/profile'
BG = (10, 10, 11)
SS = 3  # supersampling for antialiased masks

# name -> list of polygons (each a list of (x, y)); listed low → high priority
POLYS = [
  ('aluminium', [[(352, 443), (893, 432), (893, 524), (928, 524), (928, 706), (896, 748), (896, 1140), (860, 1142), (800, 1116), (700, 1072), (520, 1002), (330, 906), (150, 806), (116, 786), (238, 560), (250, 556), (352, 524)]]),
  ('thermal-break', [[(928, 530), (1056, 530), (1056, 760), (1019, 760), (1019, 1056), (896, 1056), (896, 748), (922, 708), (928, 600)]]),
  ('chambers', [
      [(1056, 536), (1198, 536), (1200, 428), (1240, 428), (1240, 862), (1172, 862), (1172, 760), (1056, 760)],
      [(1019, 800), (1172, 800), (1172, 1056), (1019, 1056)]]),
  ('glass', [
      [(795, 0), (1300, 0), (1300, 140), (1168, 290), (1168, 436), (946, 436), (946, 272)],
      [(943, 436), (970, 436), (970, 522), (943, 522)],
      [(1036, 436), (1062, 436), (1062, 522), (1036, 522)],
      [(1140, 436), (1168, 436), (1168, 522), (1140, 522)]]),
  ('seals', [
      [(893, 418), (943, 418), (943, 524), (893, 524)],
      [(970, 438), (1036, 438), (1036, 524), (970, 524)],
      [(1062, 438), (1140, 438), (1140, 524), (1062, 524)],
      [(1168, 418), (1214, 418), (1214, 528), (1168, 528)]]),
]

im = Image.open(SRC).convert('RGB')
W, H = im.size
owner = Image.new('L', (W * SS, H * SS), 0)
d = ImageDraw.Draw(owner)
for i, (name, polys) in enumerate(POLYS, start=1):
    for poly in polys:
        d.polygon([(x * SS, y * SS) for x, y in poly], fill=i)

os.makedirs(OUT, exist_ok=True)
layers = {}
for i, (name, _) in enumerate(POLYS, start=1):
    m3 = owner.point(lambda v, i=i: 255 if v == i else 0)
    mask = m3.resize((W, H), Image.BOX).filter(ImageFilter.MaxFilter(3))   # 1px overlap → no seams
    rgba = im.copy(); rgba.putalpha(mask)
    layers[name] = rgba

# base: photo with all cut-out regions flattened
cut = owner.point(lambda v: 255 if v > 0 else 0).resize((W, H), Image.BOX).filter(ImageFilter.MaxFilter(3))
base = im.copy(); base.paste(Image.new('RGB', (W, H), BG), mask=cut)
layers['base'] = base.convert('RGBA')

for name, img in layers.items():
    for w in (1440, 960):
        h = round(H * w / W)
        img.resize((w, h), Image.LANCZOS).save(f'{OUT}/profile-{name}-{w}.webp', 'WEBP', quality=86 if name != 'base' else 80, method=6, lossless=False)

# check: composite must equal the source; and a colour map of the regions
comp = layers['base'].copy()
for name in ['aluminium', 'thermal-break', 'chambers', 'glass', 'seals']:
    comp.alpha_composite(layers[name])
diff = Image.eval(Image.blend(im.convert('RGBA'), comp, 0.5), lambda v: v)
import math
bbox_err = 0
px_a, px_b = im.load(), comp.convert('RGB').load()
for y in range(0, H, 6):
    for x in range(0, W, 6):
        a, b = px_a[x, y], px_b[x, y]
        bbox_err = max(bbox_err, max(abs(a[k] - b[k]) for k in range(3)))
print('max channel error (assembled vs source, sampled):', bbox_err)
tint = {'aluminium': (255, 80, 80), 'thermal-break': (80, 255, 120), 'chambers': (80, 160, 255), 'glass': (255, 230, 60), 'seals': (255, 90, 255)}
prev = im.copy().convert('RGBA')
for name, col in tint.items():
    ov = Image.new('RGBA', (W, H), col + (0,)); ov.putalpha(layers[name].split()[3].point(lambda v: int(v * 0.45)))
    prev.alpha_composite(ov)
prev.convert('RGB').resize((W // 2, H // 2)).save(f'{OUT}/_regions-preview.png')
print('layers:', ', '.join(layers))
