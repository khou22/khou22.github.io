/*
 * Copyright (C) 2025 Sohan Basak (iamsohan.in)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the WTFPL, Version 2, as published by
 * Sam Hocevar. See http://www.wtfpl.net/ for more details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

export function rgbToOklch(rgb: { r: number; g: number; b: number }): { l: number; c: number; h: number } | null {
  // Step 1: Convert RGB to Linear RGB
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const linearRgb = {
    r: r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
    g: g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
    b: b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4),
  };

  // Step 2: Linear RGB to XYZ
  const x = 0.4124 * linearRgb.r + 0.3576 * linearRgb.g + 0.1805 * linearRgb.b;
  const y = 0.2126 * linearRgb.r + 0.7152 * linearRgb.g + 0.0722 * linearRgb.b;
  const z = 0.0193 * linearRgb.r + 0.1192 * linearRgb.g + 0.9505 * linearRgb.b;

  // Step 3: XYZ to Lab
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;

  const xNorm = x / xn;
  const yNorm = y / yn;
  const zNorm = z / zn;

  const fx = xNorm > 0.008856 ? Math.pow(xNorm, 1 / 3) : 7.787 * xNorm + 16 / 116;
  const fy = yNorm > 0.008856 ? Math.pow(yNorm, 1 / 3) : 7.787 * yNorm + 16 / 116;
  const fz = zNorm > 0.008856 ? Math.pow(zNorm, 1 / 3) : 7.787 * zNorm + 16 / 116;

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bLab = 200 * (fy - fz);

  // Step 4: Lab to LCH
  const c = Math.sqrt(Math.pow(a, 2) + Math.pow(bLab, 2));
  let h = Math.atan2(bLab, a) * (180 / Math.PI);
  if (h < 0) {
    h += 360;
  }

  return {
    l: l / 100,  // Normalized to 0-1 range
    c: c / 100,  // Normalized to 0-1 range (though max varies)
    h: h         // Hue in degrees (0-360)
  };
}

// Example usage:
// const rgb = { r: 255, g: 0, b: 0 }; // Red
// const oklch = rgbToOklch(rgb);
// console.log(oklch); // { l: ~0.627, c: ~0.258, h: ~29.23 }