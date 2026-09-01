// Generates the run-cycle pose SVGs for the character sprite.
//
// The standing sprite (public/sprites/character.svg) is frontal, but a run
// reads correctly only in PROFILE (facing the direction of motion, like the
// games do). So the run frames are authored here from scratch as ASCII pixel
// art on the same 35x43 grid and palette as the original:
//
//   K black (hair/beard/outline/fists)   S skin   W white
//   C armor light #12d5cd                B armor dark #0f71de
//
// Frames (facing right, hair flowing back):
//   run-1  contact stride: legs open, front fist pumped forward
//   run-2  passing frame:  legs under the body, 1px airborne
//   run-3  alternate stride: legs open, fists swapped
//
// The animation cycles 1-2-3-2. Run with:  node scripts/generate-run-frames.mjs

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SPRITES = join(ROOT, 'public', 'sprites');
const PX = 10;
const GRID_W = 35;
const GRID_H = 43;

const PALETTE = {
  K: '#000000',
  S: '#f0b281',
  W: '#ffffff',
  C: '#12d5cd',
  B: '#0f71de',
};

// Shared profile head + torso (rows 0-29). Face on the right: forehead, eye
// looking forward, nose bump, smile, beard; the long hair mass flows back.
const HEAD = [
  //0         1         2         3
  //0123456789012345678901234567890123 4
  '..........KKKKKKKKK...............', // 0
  '........KKKKKKKKKKKKK.............', // 1
  '.......KKKKKKKKKKKKKKKK...........', // 2
  '......KKKKKKKKKKKKKKKKKK..........', // 3
  '.....KKKKKKKKKKKKKKKKKKKK.........', // 4
  '....KKKKKKKKKKKKKSSSSSSKK.........', // 5
  '....KKKKKKKKKKKKSSSSSSSSK.........', // 6
  '...KKKKKKKKKKKKSSSSSSSSSK.........', // 7
  '...KKKKKKKKKKKKSSSSSSSSSSK........', // 8
  '...KKKKKKKKKKKSSSSSSSSSSSK........', // 9
  '..KKKKKKKKKKKKSSSWWKKSSSSK........', // 10 eye
  '..KKKKKKKKKKKKSSSWWKKSSSSK........', // 11
  '..KKKKKKKKKKKKSSSSSSSSSSSSK.......', // 12 nose
  '..KKKKKKKKKKKKKSSSSSSSSSSSK.......', // 13
  '..KKKKKKKKKKKKKSSSSSSSSSSK........', // 14
  '..KKKKKKKKKKKKKKSSKWWKKKSK........', // 15 smile
  '..KKKKKKKKKKKKKKSSKKKKKKKK........', // 16
  '...KKKKKKKKKKKKKKKKKKKKKK.........', // 17 beard/jaw
  '...KKKKKKKKKKKKKKKKKKKK...........', // 18
  '....KKKKKKKKKKKKKKKKK.............', // 19
  '.....KKKKKKKKKKKKKK...............', // 20 hair tail / neck
];

// Torso leaning forward (shoulders ahead of hips), long hair tail flowing
// down the back (x2-8). Two arm variants:
// A = front fist pumped up/forward, back fist trailing behind.
// B = front fist trailing low (mid-swing).
const TORSO_A = [
  '....KKKKKCCCCCCCKK................', // 21
  '...KKKKKCCCCCCCCCCK...............', // 22
  '...KKKKCCCCCCCCCCCKBKK............', // 23 front arm reaching out
  '....KKKCCCCCCCCCCCKKKKKK..........', // 24
  '.....KKBCCCCCCCCCCKKKKKK..........', // 25 front fist x19-23
  '.KKKBBKBBCCCCCCCCCKKKKKK..........', // 26 back fist x1-3 + sleeve bridge
  '.KKKK.KBBBCCCCCCCBK...............', // 27
  '.KKKK..KBBBBBBBBBBK...............', // 28
  '..KK...KBBBBBBBBBK................', // 29
];
const TORSO_B = [
  '....KKKKKCCCCCCCKK................', // 21
  '...KKKKKCCCCCCCCCCK...............', // 22
  '...KKKKCCCCCCCCCCCK...............', // 23
  '....KKKCCCCCCCCCCCK...............', // 24
  '.....KKBCCCCCCCCCCK...............', // 25
  '......KBBCCCCCCCCCKBKK............', // 26 front arm angled down
  '......KBBBCCCCCCCBKKKKK...........', // 27 front fist low x19-22
  '.......KBBBBBBBBBBKKKKK...........', // 28
  '.......KBBBBBBBBBKKKKK............', // 29
];

// Legs, profile stride. Ground line is rows 41-42. Boots get the cyan trim.
const LEGS_STRIDE_1 = [
  '......KBBBBBBBBBK.................', // 30 hips
  '.....KBBBBBKBBBBBK................', // 31
  '....KBBBBK.KBBBBBK................', // 32 legs split
  '...KBBBBK...KBBBBBK...............', // 33
  '..KBBBBK.....KBBBBK...............', // 34
  '..KBBBK.......KBBBBK..............', // 35
  '.KBBBBK.......KBBBBBK.............', // 36
  '.KBBBK.........KBBBBK.............', // 37
  'KBBBBK.........KBBBBBKKK..........', // 38
  'KCBBBK.........KCBBBBBBBK.........', // 39 front boot on ground
  'KKBBBK.........KBBBBBBBBBK........', // 40 back boot lifted (heel up)
  '.KKKK..........KKKKKKKKKKK........', // 41
  '...............KKKKKKKKKKK........', // 42
];
const LEGS_PASS = [
  '......KBBBBBBBBBK.................', // 30
  '......KBBBBBBBBBBK................', // 31
  '.....KBBBBKKBBBBBK................', // 32
  '.....KBBBK.KBBBBBK................', // 33
  '....KBBBBK.KBBBBK.................', // 34
  '....KBBBK..KBBBBK.................', // 35
  '...KBBBBK..KBBBBK.................', // 36
  '...KBBBK...KBBBBBK................', // 37
  '..KBBBBK...KCBBBBBK...............', // 38
  '..KCBBK....KBBBBBBBK..............', // 39
  '..KKKK.....KBBBBBBBBK.............', // 40 back boot tucked, front under body
  '...........KKKKKKKKKK.............', // 41
  '...........KKKKKKKKKK.............', // 42
];
const LEGS_STRIDE_2 = [
  '......KBBBBBBBBBK.................', // 30
  '.....KBBBBBKBBBBK.................', // 31
  '....KBBBBBK.KBBBBK................', // 32
  '....KBBBBK...KBBBBK...............', // 33
  '...KBBBBK.....KBBBK...............', // 34
  '...KBBBK.......KBBBK..............', // 35
  '..KBBBBK.......KBBBBK.............', // 36
  '..KBBBK.........KBBBK.............', // 37
  '.KBBBBK.........KBBBBKK...........', // 38
  '.KCBBBK.........KCBBBBBK..........', // 39
  '.KKBBBK.........KBBBBBBBK.........', // 40
  '..KKKK..........KKKKKKKKKK........', // 41
  '................KKKKKKKKKKK.......', // 42
];

function frameToPixels(rows, name) {
  if (rows.length !== GRID_H) {
    throw new Error(`${name}: expected ${GRID_H} rows, got ${rows.length}`);
  }
  const pixels = [];
  rows.forEach((row, y) => {
    if (row.length > GRID_W) throw new Error(`${name} row ${y}: too long (${row.length})`);
    [...row].forEach((ch, x) => {
      if (ch === '.') return;
      const f = PALETTE[ch];
      if (!f) throw new Error(`${name} row ${y}: unknown char '${ch}'`);
      pixels.push({ x, y, f });
    });
  });
  return pixels;
}

function emit(name, rows, globalDy = 0) {
  const pixels = frameToPixels(rows, name).map(p => ({ ...p, y: p.y + globalDy }));
  const rects = pixels
    .map(p => `  <rect x="${p.x * PX}" y="${p.y * PX}" width="10" height="10" fill="${p.f}"/>`)
    .join('\n');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 430" width="350" height="430">\n${rects}\n</svg>\n`;
  writeFileSync(join(SPRITES, name), svg);
  console.log(`wrote ${name} (${pixels.length} px)`);
}

emit('character-run-1.svg', [...HEAD, ...TORSO_A, ...LEGS_STRIDE_1]);
emit('character-run-2.svg', [...HEAD, ...TORSO_B, ...LEGS_PASS], -1);
emit('character-run-3.svg', [...HEAD, ...TORSO_B, ...LEGS_STRIDE_2]);
