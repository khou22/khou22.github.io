// Original character roster. Archetypes echo classic platform-fighter roles:
// all-rounder, fast-faller speedster, super heavyweight, and floaty featherweight.

export type MoveKey =
  | 'jab'
  | 'ftilt'
  | 'utilt'
  | 'dtilt'
  | 'nair'
  | 'fair'
  | 'uair'
  | 'dair'
  | 'nspec'
  | 'sspec'
  | 'uspec'
  | 'dspec';

export interface ProjectileSpec {
  speed: number;
  vy: number;
  gravity: number;
  radius: number;
  damage: number;
  angle: number;
  bkb: number;
  kbg: number;
  lifetime: number;
  color: string;
  cooldown: number;
}

export interface Move {
  name: string;
  startup: number; // frames before hitbox comes out
  active: number; // frames the hitbox is live
  recovery: number; // endlag frames
  damage: number;
  angle: number; // launch angle in degrees; 0 = forward, 90 = up, -80 = spike
  bkb: number; // base knockback
  kbg: number; // knockback growth (scales with percent)
  hx: number; // hitbox offset from fighter center, facing-relative
  hy: number; // hitbox vertical offset (negative = above feet)
  hr: number; // hitbox radius
  impulseX?: number; // self-movement applied when hitbox comes out
  impulseY?: number;
  projectile?: ProjectileSpec;
  helplessAfter?: boolean; // up-specials cause freefall
}

export type FighterStyle = 'brawler' | 'speedster' | 'golem' | 'wisp';

export interface CharDef {
  id: string;
  name: string;
  tagline: string;
  style: FighterStyle;
  color: string;
  color2: string;
  eyeColor: string;
  weight: number; // ~70 light, ~120 heavy
  gravity: number;
  fallSpeed: number;
  fastFall: number;
  runSpeed: number;
  airSpeed: number;
  airAccel: number;
  traction: number;
  jumpVel: number;
  djVel: number;
  size: number; // hurtbox radius
  height: number; // visual height, feet to head top
  moves: Record<MoveKey, Move>;
}

function mv(partial: Partial<Move> & Pick<Move, 'name'>): Move {
  return {
    startup: 5,
    active: 4,
    recovery: 12,
    damage: 8,
    angle: 45,
    bkb: 20,
    kbg: 70,
    hx: 40,
    hy: -40,
    hr: 30,
    ...partial,
  };
}

interface Tuning {
  power: number; // damage/kb multiplier
  speed: number; // 1 = normal frame data; >1 = slower
  reach: number;
  projectile: ProjectileSpec;
  upB: { impulseX: number; impulseY: number };
}

function buildMoves(t: Tuning): Record<MoveKey, Move> {
  const p = t.power;
  const s = t.speed;
  const r = t.reach;
  const f = (n: number) => Math.max(1, Math.round(n * s));
  return {
    jab: mv({
      name: 'Jab',
      startup: f(3),
      active: 3,
      recovery: f(8),
      damage: 3 * p,
      angle: 70,
      bkb: 14,
      kbg: 18,
      hx: 38 * r,
      hy: -42,
      hr: 24 * r,
    }),
    ftilt: mv({
      name: 'Side Strike',
      startup: f(9),
      active: 4,
      recovery: f(16),
      damage: 11 * p,
      angle: 38,
      bkb: 28,
      kbg: 92,
      hx: 50 * r,
      hy: -40,
      hr: 30 * r,
    }),
    utilt: mv({
      name: 'Rising Strike',
      startup: f(7),
      active: 5,
      recovery: f(14),
      damage: 9 * p,
      angle: 86,
      bkb: 30,
      kbg: 96,
      hx: 8,
      hy: -78,
      hr: 34 * r,
    }),
    dtilt: mv({
      name: 'Low Sweep',
      startup: f(6),
      active: 4,
      recovery: f(12),
      damage: 8 * p,
      angle: 76,
      bkb: 24,
      kbg: 68,
      hx: 44 * r,
      hy: -14,
      hr: 26 * r,
    }),
    nair: mv({
      name: 'Neutral Air',
      startup: f(4),
      active: 14,
      recovery: f(9),
      damage: 8 * p,
      angle: 45,
      bkb: 18,
      kbg: 66,
      hx: 12,
      hy: -44,
      hr: 36 * r,
    }),
    fair: mv({
      name: 'Forward Air',
      startup: f(8),
      active: 5,
      recovery: f(13),
      damage: 11 * p,
      angle: 42,
      bkb: 24,
      kbg: 90,
      hx: 46 * r,
      hy: -44,
      hr: 30 * r,
    }),
    uair: mv({
      name: 'Up Air',
      startup: f(6),
      active: 6,
      recovery: f(11),
      damage: 9 * p,
      angle: 84,
      bkb: 22,
      kbg: 88,
      hx: 4,
      hy: -84,
      hr: 32 * r,
    }),
    dair: mv({
      name: 'Meteor Drop',
      startup: f(13),
      active: 5,
      recovery: f(18),
      damage: 12 * p,
      angle: -78, // spike!
      bkb: 26,
      kbg: 84,
      hx: 4,
      hy: -6,
      hr: 30 * r,
    }),
    nspec: mv({
      name: 'Projectile',
      startup: f(12),
      active: 2,
      recovery: f(18),
      damage: 0,
      angle: 20,
      bkb: 0,
      kbg: 0,
      hx: 0,
      hy: -44,
      hr: 0,
      projectile: t.projectile,
    }),
    sspec: mv({
      name: 'Lunge',
      startup: f(10),
      active: 9,
      recovery: f(19),
      damage: 10 * p,
      angle: 40,
      bkb: 30,
      kbg: 78,
      hx: 34 * r,
      hy: -44,
      hr: 32 * r,
      impulseX: 11,
    }),
    uspec: mv({
      name: 'Recovery',
      startup: f(7),
      active: 10,
      recovery: f(20),
      damage: 6 * p,
      angle: 82,
      bkb: 30,
      kbg: 50,
      hx: 0,
      hy: -60,
      hr: 36 * r,
      impulseX: t.upB.impulseX,
      impulseY: t.upB.impulseY,
      helplessAfter: true,
    }),
    dspec: mv({
      name: 'Shockwave',
      startup: f(16),
      active: 6,
      recovery: f(22),
      damage: 14 * p,
      angle: 74,
      bkb: 40,
      kbg: 96,
      hx: 0,
      hy: -36,
      hr: 52 * r,
    }),
  };
}

export const ROSTER: CharDef[] = [
  {
    id: 'nova',
    name: 'NOVA',
    tagline: 'The all-round star brawler',
    style: 'brawler',
    color: '#e84c3d',
    color2: '#f5b041',
    eyeColor: '#ffffff',
    weight: 100,
    gravity: 0.5,
    fallSpeed: 10,
    fastFall: 15.5,
    runSpeed: 5.4,
    airSpeed: 3.4,
    airAccel: 0.32,
    traction: 0.7,
    jumpVel: -13.2,
    djVel: -12.2,
    size: 30,
    height: 84,
    moves: buildMoves({
      power: 1,
      speed: 1,
      reach: 1,
      projectile: {
        speed: 8.5,
        vy: -1.2,
        gravity: 0.18,
        radius: 11,
        damage: 6,
        angle: 40,
        bkb: 18,
        kbg: 34,
        lifetime: 70,
        color: '#ff9d3d',
        cooldown: 40,
      },
      upB: { impulseX: 3, impulseY: -15.5 },
    }),
  },
  {
    id: 'blitz',
    name: 'BLITZ',
    tagline: 'Blinding speed, featherweight frame',
    style: 'speedster',
    color: '#22c8e0',
    color2: '#f7dc4e',
    eyeColor: '#0b2530',
    weight: 78,
    gravity: 0.62,
    fallSpeed: 12.5,
    fastFall: 18,
    runSpeed: 7.2,
    airSpeed: 3.9,
    airAccel: 0.4,
    traction: 0.85,
    jumpVel: -14,
    djVel: -12.5,
    size: 26,
    height: 74,
    moves: buildMoves({
      power: 0.82,
      speed: 0.78,
      reach: 0.92,
      projectile: {
        speed: 14,
        vy: 0,
        gravity: 0,
        radius: 7,
        damage: 3,
        angle: 10,
        bkb: 6,
        kbg: 10,
        lifetime: 46,
        color: '#7df9ff',
        cooldown: 22,
      },
      upB: { impulseX: 4.5, impulseY: -16.5 },
    }),
  },
  {
    id: 'grondo',
    name: 'GRONDO',
    tagline: 'A mountain that hits like one',
    style: 'golem',
    color: '#7c8a4c',
    color2: '#4d5433',
    eyeColor: '#ffb52e',
    weight: 128,
    gravity: 0.56,
    fallSpeed: 11.5,
    fastFall: 17,
    runSpeed: 3.9,
    airSpeed: 2.7,
    airAccel: 0.24,
    traction: 0.55,
    jumpVel: -12.4,
    djVel: -11.6,
    size: 38,
    height: 104,
    moves: buildMoves({
      power: 1.45,
      speed: 1.35,
      reach: 1.2,
      projectile: {
        speed: 6,
        vy: -4.5,
        gravity: 0.34,
        radius: 15,
        damage: 10,
        angle: 55,
        bkb: 32,
        kbg: 46,
        lifetime: 90,
        color: '#c8b98a',
        cooldown: 70,
      },
      upB: { impulseX: 2, impulseY: -14.5 },
    }),
  },
  {
    id: 'wisp',
    name: 'WISP',
    tagline: 'A drifting spirit, deceptively deadly',
    style: 'wisp',
    color: '#b06ee8',
    color2: '#f2a7e0',
    eyeColor: '#2b0b3a',
    weight: 70,
    gravity: 0.3,
    fallSpeed: 7,
    fastFall: 11.5,
    runSpeed: 4.4,
    airSpeed: 4.3,
    airAccel: 0.5,
    traction: 0.6,
    jumpVel: -11.5,
    djVel: -11,
    size: 28,
    height: 76,
    moves: buildMoves({
      power: 0.9,
      speed: 0.9,
      reach: 1,
      projectile: {
        speed: 5.5,
        vy: -0.6,
        gravity: 0,
        radius: 13,
        damage: 7,
        angle: 60,
        bkb: 24,
        kbg: 40,
        lifetime: 110,
        color: '#e79df2',
        cooldown: 55,
      },
      upB: { impulseX: 3.5, impulseY: -14 },
    }),
  },
];
