import L from "leaflet";
import type { MapPin, PinIcon, PinIconName } from "./types";

/**
 * Minimal SVG path data (24x24 viewBox) for the built-in vector icons. Using
 * inline SVG keeps the component dependency-free and lets markers be recolored
 * via `currentColor`.
 */
const ICON_PATHS: Record<PinIconName, string> = {
  pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z",
  star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  heart:
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z",
  flag: "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z",
  camera:
    "M9 2L7.17 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-3.17L15 2H9zm3 15a5 5 0 110-10 5 5 0 010 10z",
  food: "M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z",
  coffee:
    "M20 3H4v10a4 4 0 004 4h6a4 4 0 004-4v-3h2a2 2 0 002-2V5a2 2 0 00-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z",
};

/** Escape a string for safe interpolation into marker HTML. */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const DEFAULT_ICON: PinIcon = { type: "dot", color: "#3b82f6" };

/**
 * Build a Leaflet `DivIcon` from a pin's icon spec. Using divIcons for every
 * marker means we never rely on Leaflet's default image assets (which break
 * under bundlers) and lets us render emoji, colored dots, text, and SVGs.
 */
export const createPinIcon = (pin: MapPin): L.DivIcon => {
  const icon = pin.icon ?? DEFAULT_ICON;

  switch (icon.type) {
    case "emoji": {
      const size = icon.size ?? 28;
      return L.divIcon({
        className: "leaflet-custom-marker",
        html: `<div style="font-size:${size}px;line-height:1;text-align:center;filter:drop-shadow(0 1px 1px rgba(0,0,0,0.35))">${escapeHtml(
          icon.value,
        )}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });
    }

    case "dot": {
      const size = icon.size ?? 16;
      return L.divIcon({
        className: "leaflet-custom-marker",
        html: `<div style="width:${size}px;height:${size}px;background:${escapeHtml(
          icon.color,
        )};border:2px solid #fff;border-radius:9999px;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });
    }

    case "text": {
      const color = icon.color ?? "#ffffff";
      const background = icon.background ?? "#1e293b";
      return L.divIcon({
        className: "leaflet-custom-marker",
        html: `<div style="display:inline-block;white-space:nowrap;padding:2px 8px;font-size:12px;font-weight:600;color:${escapeHtml(
          color,
        )};background:${escapeHtml(
          background,
        )};border:1px solid rgba(255,255,255,0.6);border-radius:9999px;box-shadow:0 1px 3px rgba(0,0,0,0.4)">${escapeHtml(
          icon.value,
        )}</div>`,
        // Width is content-driven; let Leaflet size it automatically.
        iconSize: undefined as unknown as L.PointExpression,
        iconAnchor: [0, 12],
        popupAnchor: [0, -12],
      });
    }

    case "icon": {
      const size = icon.size ?? 28;
      const color = icon.color ?? "#3b82f6";
      const path = ICON_PATHS[icon.name] ?? ICON_PATHS.pin;
      return L.divIcon({
        className: "leaflet-custom-marker",
        html: `<div style="width:${size}px;height:${size}px;color:${escapeHtml(
          color,
        )};filter:drop-shadow(0 1px 1px rgba(0,0,0,0.35))"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor"><path d="${path}"/></svg></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });
    }

    default: {
      // Exhaustiveness guard — fall back to the default dot.
      return createPinIcon({ ...pin, icon: DEFAULT_ICON });
    }
  }
};
