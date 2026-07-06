// Global tuning constants. Units: pixels and 60hz frames.

export const VIEW_W = 1280;
export const VIEW_H = 720;
export const DT = 1 / 60;

// Final Destination style stage geometry (world coords, y+ is down).
export const STAGE = {
  surfaceY: 0,
  left: -560,
  right: 560,
  thickness: 100,
};

// Blast zones — cross these and you lose a stock.
export const BLAST = {
  left: -1250,
  right: 1250,
  top: -900,
  bottom: 640,
};

export const RESPAWN_X = 0;
export const RESPAWN_Y = -430;
export const STOCKS_DEFAULT = 4;

export const SPAWN_POINTS: Array<{ x: number; facing: 1 | -1 }> = [
  { x: -280, facing: 1 },
  { x: 280, facing: -1 },
];

// Knockback / combat feel
export const HITSTUN_PER_KB = 0.42;
export const LAUNCH_SPEED_PER_KB = 0.24;
export const KB_WEIGHT_PIVOT = 100;
export const RESPAWN_INVINCIBLE_FRAMES = 130;
export const RESPAWN_HOVER_FRAMES = 70;

export const SHIELD_MAX = 60;
export const SHIELD_REGEN = 0.14;
export const SHIELD_DECAY = 0.22;
export const SHIELD_BREAK_STUN = 180;
