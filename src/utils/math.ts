/**
 * Clamps a value between a min and max
 */
export const clamp = (min: number, max: number, value: number) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Perform a linear interpolation using `start` and `end` values. `progress` is
 * a percentage between 0 and 1.
 */
export const interpolate = (start: number, end: number, progress: number) => {
  return start + (end - start) * progress;
};
