// Generates the run-cycle pose SVGs for the character sprite.
//
// The base sprite (public/sprites/character.svg) is a frontal standing pose.
// A believable frontal run cycle needs redrawn poses, not translated groups,
// so this script cuts pixel clusters (boots, fists) out of the standing pose
// and repositions them per frame, exactly like editing the art by hand:
//
//   run-1: right-knee-up stride  (right boot lifted, left boot under body,
//          left fist pumped up to the chest)
//   run-2: airborne pass frame   (both boots tucked, whole body 1px up)
//   run-3: left-knee-up stride   (mirror of run-1)
//
// The animation cycles 1-2-3-2. Run with:  node scripts/generate-run-frames.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SPRITES = join(ROOT, 'public', 'sprites');
const PX = 10; // one logical pixel = 10 viewBox units

const base = readFileSync(join(SPRITES, 'character.svg'), 'utf8');
const viewBox = base.match(/viewBox="([^"]+)"/)[1];

// Parse into logical-pixel list
const pixels = [...base.matchAll(/<rect x="(\d+)" y="(\d+)" width="10" height="10" fill="(#[0-9a-fA-F]+)"\/>/g)]
  .map(m => ({ x: +m[1] / PX, y: +m[2] / PX, f: m[3] }));

// Cluster predicates (logical pixel coords, from the sprite's ASCII map)
const inLeftBoot = p => p.y >= 36 && p.x < 17;
const inRightBoot = p => p.y >= 36 && p.x > 17;
const inLeftFist = p => (p.y === 31 || p.y === 32) && p.x >= 3 && p.x <= 7;
const inRightFist = p => (p.y === 31 || p.y === 32) && p.x >= 27 && p.x <= 31;

function splitClusters(list) {
  const clusters = { leftBoot: [], rightBoot: [], leftFist: [], rightFist: [], body: [] };
  for (const p of list) {
    if (inLeftBoot(p)) clusters.leftBoot.push(p);
    else if (inRightBoot(p)) clusters.rightBoot.push(p);
    else if (inLeftFist(p)) clusters.leftFist.push(p);
    else if (inRightFist(p)) clusters.rightFist.push(p);
    else clusters.body.push(p);
  }
  return clusters;
}

const shift = (cluster, dx, dy) => cluster.map(p => ({ ...p, x: p.x + dx, y: p.y + dy }));

// The standing pose has splayed, sideways-pointing boots (A-stance). A run
// needs forward-facing feet, so the running boot is redrawn from scratch in
// the sprite's own palette (K outline, B blue, C cyan trim) as a compact
// front-view block, and stamped per frame.
const PALETTE = { K: '#000000', B: '#0f71de', C: '#12d5cd' };
// Chunky MMX-style boot seen from the front: wide shin with cyan trim,
// flared foot, double black sole. 11 cols x 8 rows.
const FRONT_BOOT = [
  '.KKKKKKKKK.',
  '.KBBCCCBBK.',
  '.KBBBBBBBK.',
  '.KBBBBBBBK.',
  'KBBBBBBBBBK',
  'KBBBBBBBBBK',
  'KKKKKKKKKKK',
  'KKKKKKKKKKK',
];

function stampBoot(x0, y0) {
  const out = [];
  FRONT_BOOT.forEach((row, dy) => {
    [...row].forEach((ch, dx) => {
      if (ch !== '.') out.push({ x: x0 + dx, y: y0 + dy, f: PALETTE[ch] });
    });
  });
  return out;
}

function emit(name, parts, globalDy = 0) {
  // Paint order: body first, then boots, then fists (fists sit in front of
  // the chest when pumped up)
  const all = parts.flat().map(p => ({ ...p, y: p.y + globalDy }));
  const rects = all
    .map(p => `  <rect x="${p.x * PX}" y="${p.y * PX}" width="10" height="10" fill="${p.f}"/>`)
    .join('\n');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="350" height="430">\n${rects}\n</svg>\n`;
  writeFileSync(join(SPRITES, name), svg);
  console.log(`wrote ${name} (${all.length} px)`);
}

const c = splitClusters(pixels);

// The original splayed boots (c.leftBoot / c.rightBoot) are dropped entirely
// in the run poses; forward-facing boots are stamped in their place. Boots
// start at y35 so they tuck under the thigh band (y33-35) and their soles
// rest on the ground line (y42). Grounded stamp positions: left (6,35),
// right (18,35) — slightly wider than the hips, like the game's boots.

// run-1: right knee up. Right boot lifted 2px (in front of the thigh), left
// boot planted under the body; left fist pumps up beside the chest.
emit('character-run-1.svg', [
  c.body,
  stampBoot(6, 35),
  stampBoot(18, 33),
  shift(c.leftFist, 1, -5),
  c.rightFist,
]);

// run-2: airborne pass. Both boots forward-facing under the body, whole
// sprite 1px up so the feet leave the ground for a beat.
emit(
  'character-run-2.svg',
  [
    c.body,
    stampBoot(6, 35),
    stampBoot(18, 35),
    shift(c.leftFist, 0, -2),
    shift(c.rightFist, 0, -2),
  ],
  -1
);

// run-3: left knee up (mirror of run-1).
emit('character-run-3.svg', [
  c.body,
  stampBoot(18, 35),
  stampBoot(6, 33),
  shift(c.rightFist, -1, -5),
  c.leftFist,
]);
