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

// Shared profile head (rows 0-20). Likeness cues from the frontal sprite:
// large face, thick eyebrow, big white grin between mustache and beard, and
// the long hair falling FLAT down the back (not a ball).
const HEAD = [
  //0         1         2         3
  //0123456789012345678901234567890123 4
  '.........KKKKKKKKKK...............', // 0
  '.......KKKKKKKKKKKKKK.............', // 1
  '......KKKKKKKKKKKKKKKK............', // 2
  '.....KKKKKKKKKKKKKKKKKK...........', // 3
  '....KKKKKKKKKKKKKKKKKKKK..........', // 4
  '....KKKKKKKKKSSSSSSSSSKK..........', // 5 forehead
  '...KKKKKKKKKSSSSSSSSSSSSK.........', // 6
  '...KKKKKKKKKSSSSSSSSSSSSSK........', // 7
  '...KKKKKKKKSSSSSSSSSSSSSSK........', // 8
  '..KKKKKKKKKSSSSSSSSSSSSSSK........', // 9 forehead
  '..KKKKKKKKKSSSSSSSKKKKKSSK........', // 10 eyebrow
  '..KKKKKKKKKSSSSSSSSSSSSSSSK.......', // 11 gap
  '..KKKKKKKKKSSSSSSSWWKKSSSSSK......', // 12 eye, pupil forward
  '..KKKKKKKKKSSSSSSSWWKKSSSSSK......', // 13 eye + nose edge
  '..KKKKKKKKKSSSSSSSSSSSSSSSK.......', // 14 cheek
  '..KKKKKKKKKSSSSKKKKKKKKKSK........', // 15 mustache
  '..KKKKKKKKKSSKKKWWWWKKKKK.........', // 16 grin
  '..KKKKKKKKKKKKKKWWWKKKKK..........', // 17 grin lower
  '...KKKKKKKKKKKKKKKKKKKK...........', // 18 beard
  '...KKKKKKKKKKKKKKKKKK.............', // 19 jaw
  '....KKKKKKKKKKKKKK................', // 20
];

// Torso leaning forward (shoulders ahead of hips), long hair tail flowing
// down the back (x2-8). Two arm variants:
// A = front fist pumped up/forward, back fist trailing behind.
// B = front fist trailing low (mid-swing).
const TORSO_A = [
  '...KKKKKKKCCCCCCKK................', // 21 hair cascade x3-9
  '...KKKKKKCCCCCCCCCK...............', // 22
  '...KKKKKCCCCCCCCCCKBKK............', // 23 front arm reaching out
  '....KKKKCCCCCCCCCCKKKKKK..........', // 24
  '....KKKBCCCCCCCCCCKKKKKK..........', // 25 front fist x19-23
  '.KKKKKKBBCCCCCCCCCKKKKKK..........', // 26 back fist + hair tips
  '.KKKK.KBBBCCCCCCCBK...............', // 27
  '.KKKK..KBBBBBBBBBBK...............', // 28
  '..KK...KBBBBBBBBBK................', // 29
];
const TORSO_B = [
  '...KKKKKKKCCCCCCKK................', // 21 hair cascade x3-9
  '...KKKKKKCCCCCCCCCK...............', // 22
  '...KKKKKCCCCCCCCCCK...............', // 23
  '....KKKKCCCCCCCCCCK...............', // 24
  '....KKKBCCCCCCCCCCK...............', // 25
  '.KKKKKKBBCCCCCCCCCKBKK............', // 26 front arm angled down + hair tips
  '.KKKK.KBBBCCCCCCCBKKKKK...........', // 27 front fist low x19-22
  '.KKKK..KBBBBBBBBBBKKKKK...........', // 28
  '..KK...KBBBBBBBBBKKKKK............', // 29
];
// Neutral arms for the airborne pass frame (mid-swing, no extended fist)
const TORSO_MID = [
  '...KKKKKKKCCCCCCKK................', // 21
  '...KKKKKKCCCCCCCCCK...............', // 22
  '...KKKKKCCCCCCCCCCK...............', // 23
  '....KKKKCCCCCCCCCCK...............', // 24
  '....KKKBCCCCCCCCCCKK..............', // 25
  '.KKKKKKBBCCCCCCCCCKKK.............', // 26
  '.KKKK.KBBBCCCCCCCBKKK.............', // 27
  '.KKKK..KBBBBBBBBBBKK..............', // 28
  '..KK...KBBBBBBBBBK................', // 29
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

// Both strides share the SAME legs (left/right are indistinguishable in
// profile); only the arms alternate. This keeps the gait symmetric — using
// two different leg poses for the strides makes the cycle look like limping.
emit('character-run-1.svg', [...HEAD, ...TORSO_A, ...LEGS_STRIDE_1]);
emit('character-run-2.svg', [...HEAD, ...TORSO_MID, ...LEGS_PASS], -1);
emit('character-run-3.svg', [...HEAD, ...TORSO_B, ...LEGS_STRIDE_1]);
