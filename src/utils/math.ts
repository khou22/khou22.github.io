/**
 * Clamps a value between a min and max
 */
export const clamp = (min: number, max: number, value: number) => {
  return Math.min(Math.max(value, min), max);
};

type EasingFunctionPreset = "linear" | "easeIn" | "easeOut" | "easeInOut";

/**
 * Perform a linear or non-linear interpolation using `start` and `end` values.
 * `progress` is a percentage between 0 and 1. The interpolation behavior can be
 * customized with the `easing` argument.
 *
 * @param start - The start value.
 * @param end - The end value.
 * @param progress - The progress value between 0 and 1.
 * @param easing - The easing function to use for interpolation.
 * @returns The interpolated value.
 */
export const interpolate = (
  start: number,
  end: number,
  progress: number,
  easing: EasingFunctionPreset = "linear",
) => {
  switch (easing) {
    case "linear":
      return start + (end - start) * progress;
    case "easeIn":
      return start + (end - start) * progress * progress;
    case "easeOut":
      return start + (end - start) * (1 - (1 - progress) * (1 - progress));
    case "easeInOut":
      return (
        start +
        (end - start) *
          (progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress)
      );
    default:
      throw new Error(`Unsupported easing type: ${easing}`);
  }
};
