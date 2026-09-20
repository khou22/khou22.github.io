"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import React, { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { createPinIcon } from "./icons";
import type { LatLng, LeafletMapProps } from "./types";
import { classNames } from "@/utils/style";

const DEFAULT_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DEFAULT_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/**
 * When no explicit center is provided, fit the viewport to the bounds of all
 * pins so every marker is visible.
 */
const FitToPins: React.FC<{ points: LatLng[] }> = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);

  return null;
};

/**
 * Interactive Leaflet map. Renders a set of pins, each with a customizable
 * marker (emoji, colored dot, text label, or built-in vector icon) plus an
 * optional hover tooltip and click popup.
 *
 * This is a client-only component (Leaflet needs `window`). When embedding in
 * SSR contexts, import it through a `next/dynamic` wrapper with `ssr: false`
 * (see `LeafletMapEmbed`).
 */
export const LeafletMap: React.FC<LeafletMapProps> = ({
  pins = [],
  center,
  zoom = 13,
  height = 400,
  scrollWheelZoom = false,
  tileUrl = DEFAULT_TILE_URL,
  attribution = DEFAULT_ATTRIBUTION,
  className,
}) => {
  const points: LatLng[] = pins.map((p) => [p.lat, p.lng]);

  // A center is required to mount MapContainer; fall back to the first pin or
  // a neutral world view. FitToPins refines this once mounted.
  const initialCenter: LatLng = center ?? points[0] ?? [20, 0];
  const initialZoom = center ? zoom : points.length > 0 ? zoom : 2;

  return (
    <div
      className={classNames(
        "not-prose relative z-0 overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-700",
        className,
      )}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url={tileUrl} attribution={attribution} />

        {!center && <FitToPins points={points} />}

        {pins.map((pin, index) => (
          <Marker
            key={`${pin.lat},${pin.lng}-${index}`}
            position={[pin.lat, pin.lng]}
            icon={createPinIcon(pin)}
          >
            {pin.label && <Tooltip>{pin.label}</Tooltip>}
            {pin.popup && (
              <Popup>
                <span dangerouslySetInnerHTML={{ __html: pin.popup }} />
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
