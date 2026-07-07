/**
 * Types for the interactive Leaflet map component.
 *
 * These are intentionally serializable (plain JSON) so that a map can be
 * configured both from React (passing props directly) and from within a blog
 * post (passing a JSON string through a custom `<leaflet-map>` HTML tag).
 */

/** Built-in vector icons that ship with the map component. */
export type PinIconName =
  | "pin"
  | "star"
  | "home"
  | "heart"
  | "flag"
  | "camera"
  | "food"
  | "coffee";

/**
 * The visual marker for a pin. One of:
 * - `emoji`: render an emoji glyph (e.g. 🗽, 🍜, 🏔️)
 * - `dot`:   a filled circle of an arbitrary CSS color
 * - `text`:  a short text label rendered as a pill
 * - `icon`:  one of the built-in vector icons, optionally recolored
 */
export type PinIcon =
  | { type: "emoji"; value: string; size?: number }
  | { type: "dot"; color: string; size?: number }
  | { type: "text"; value: string; color?: string; background?: string }
  | { type: "icon"; name: PinIconName; color?: string; size?: number };

/** A single map marker. */
export type MapPin = {
  /** Latitude in decimal degrees. */
  lat: number;
  /** Longitude in decimal degrees. */
  lng: number;
  /**
   * Hover tooltip text. If omitted but `popup` is present, no tooltip shows.
   */
  label?: string;
  /**
   * Click popup content. Plain text or a small amount of trusted HTML.
   */
  popup?: string;
  /** The marker's visual style. Defaults to a blue dot. */
  icon?: PinIcon;
};

/** A `[latitude, longitude]` coordinate pair. */
export type LatLng = [number, number];

export type LeafletMapProps = {
  /** Pins to render on the map. */
  pins?: MapPin[];
  /**
   * Initial map center. If omitted, the map fits the bounds of all pins (or
   * falls back to a world view when there are no pins).
   */
  center?: LatLng;
  /** Initial zoom level (1-19). Ignored when fitting to pin bounds. */
  zoom?: number;
  /** Map height in pixels (or any CSS length string). Defaults to 400. */
  height?: number | string;
  /** Allow zooming with the scroll wheel. Defaults to false (nicer in posts). */
  scrollWheelZoom?: boolean;
  /** Tile layer URL template. Defaults to OpenStreetMap. */
  tileUrl?: string;
  /** Tile layer attribution. Defaults to OpenStreetMap attribution. */
  attribution?: string;
  /** Extra classes for the outer container. */
  className?: string;
};
