"use client";

import dynamic from "next/dynamic";
import React from "react";
import type { LatLng, LeafletMapProps, MapPin } from "./types";

/**
 * Lazily load the map with SSR disabled. Leaflet touches `window` at import
 * time, so it can only run in the browser. `ssr: false` is permitted here
 * because this file is a Client Component.
 */
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="not-prose flex h-[400px] w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800">
      Loading map…
    </div>
  ),
});

/**
 * Props as they arrive from `react-markdown` when authors embed a
 * `<leaflet-map ...>` tag in a blog post. All HTML attributes are strings, and
 * the raw hast node is available via `node` for attributes react-markdown does
 * not surface as typed props.
 */
type RawAttrs = Record<string, unknown> & {
  node?: { properties?: Record<string, unknown> };
};

/** Read an attribute by name, tolerating casing and the hast `node` fallback. */
const readAttr = (props: RawAttrs, name: string): string | undefined => {
  const lower = name.toLowerCase();
  const fromProps = props[name] ?? props[lower];
  const fromNode = props.node?.properties?.[name] ?? props.node?.properties?.[lower];
  const value = fromProps ?? fromNode;
  return value == null ? undefined : String(value);
};

const parseCenter = (raw?: string): LatLng | undefined => {
  if (!raw) return undefined;
  const parts = raw.split(",").map((n) => Number(n.trim()));
  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return undefined;
  return [parts[0], parts[1]];
};

const parsePins = (raw?: string): MapPin[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MapPin[]) : [];
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[leaflet-map] Failed to parse `pins` attribute:", err);
    }
    return [];
  }
};

/**
 * Markdown-facing wrapper for the interactive map. Registered against the
 * custom `<leaflet-map>` tag in `CustomMarkdown`, it translates HTML attributes
 * into typed props and renders the SSR-safe map.
 *
 * Example (inside a `.md`/`.mdx` blog post):
 *
 * ```html
 * <leaflet-map
 *   height="420"
 *   pins='[
 *     {"lat":40.7128,"lng":-74.006,"label":"NYC","icon":{"type":"emoji","value":"🗽"}},
 *     {"lat":48.8584,"lng":2.2945,"label":"Paris","icon":{"type":"dot","color":"#ef4444"}}
 *   ]'
 * ></leaflet-map>
 * ```
 */
export const LeafletMapEmbed: React.FC<RawAttrs> = (props) => {
  // Direct React usage: typed props are passed through untouched.
  if (Array.isArray((props as Partial<LeafletMapProps>).pins)) {
    return <LeafletMap {...(props as LeafletMapProps)} />;
  }

  const zoomRaw = readAttr(props, "zoom");
  const heightRaw = readAttr(props, "height");
  const scrollRaw = readAttr(props, "scrollWheelZoom");

  const config: LeafletMapProps = {
    pins: parsePins(readAttr(props, "pins")),
    center: parseCenter(readAttr(props, "center")),
    zoom: zoomRaw ? Number(zoomRaw) : undefined,
    height: heightRaw
      ? /^\d+$/.test(heightRaw)
        ? Number(heightRaw)
        : heightRaw
      : undefined,
    scrollWheelZoom: scrollRaw ? scrollRaw === "true" : undefined,
    tileUrl: readAttr(props, "tileUrl"),
    attribution: readAttr(props, "attribution"),
  };

  return <LeafletMap {...config} />;
};

export default LeafletMapEmbed;
