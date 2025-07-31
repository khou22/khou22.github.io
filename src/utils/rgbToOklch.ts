/**
 * Represents a color in the sRGB color space.
 * Values for r, g, and b are typically between 0 and 255.
 */
interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Represents a color in the Oklch color space.
 * l (lightness): 0 to 1
 * c (chroma): 0 to ~0.37
 * h (hue): 0 to 360
 */
interface OklchColor {
  l: number;
  c: number;
  h: number;
}

/**
 * Converts an sRGB color to the Oklch color space.
 * This is a multi-step process: sRGB -> linear sRGB -> CIEXYZ -> Oklab -> Oklch.
 *
 * @param rgb The color to convert, as an object with r, g, b properties (0-255).
 * @returns The equivalent color in the Oklch color space.
 */
export function rgbToOklch(rgb: RgbColor): OklchColor {
  // 1. Convert sRGB (0-255) to linear sRGB (0-1)
  const r_linear = srgbToLinear(rgb.r / 255);
  const g_linear = srgbToLinear(rgb.g / 255);
  const b_linear = srgbToLinear(rgb.b / 255);

  // 2. Convert linear sRGB to CIEXYZ (D65 illuminant)
  const x = 0.4124564 * r_linear + 0.3575761 * g_linear + 0.1804375 * b_linear;
  const y = 0.2126729 * r_linear + 0.7151522 * g_linear + 0.072175 * b_linear;
  const z = 0.0193339 * r_linear + 0.119192 * g_linear + 0.9503041 * b_linear;

  // 3. Convert CIEXYZ to Oklab
  const l_ = 0.4124564 * r_linear + 0.3575761 * g_linear + 0.1804375 * b_linear;
  const m_ = 0.2126729 * r_linear + 0.7151522 * g_linear + 0.072175 * b_linear;
  const s_ = 0.0193339 * r_linear + 0.119192 * g_linear + 0.9503041 * b_linear;

  const l_cubed = Math.cbrt(l_);
  const m_cubed = Math.cbrt(m_);
  const s_cubed = Math.cbrt(s_);

  const l =
    0.2104542553 * l_cubed + 0.793617785 * m_cubed - 0.0040720468 * s_cubed;
  const a =
    1.9779984951 * l_cubed - 2.428592205 * m_cubed + 0.4505937099 * s_cubed;
  const b =
    0.0259040371 * l_cubed + 0.7827717662 * m_cubed - 0.808675766 * s_cubed;

  // 4. Convert Oklab to Oklch
  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * (180 / Math.PI);

  if (h < 0) {
    h += 360;
  }

  return { l, c, h };
}

/**
 * Helper function to convert a single sRGB channel value to its linear equivalent.
 * @param value The sRGB channel value (0-1).
 * @returns The linear RGB channel value (0-1).
 */
function srgbToLinear(value: number): number {
  if (value <= 0.04045) {
    return value / 12.92;
  }
  return Math.pow((value + 0.055) / 1.055, 2.4);
}
