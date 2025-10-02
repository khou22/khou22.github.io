"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import type { FeatureCollection } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useIsClient } from "@/hooks/useIsClient/useIsClient";
import { MapLegend } from "@/components/atoms/MapLegend/MapLegend";
import { computeCoordinateBounds } from "@/utils/mapping/computeCoordinateBounds";

export interface GpxMapProps {
  geojson: FeatureCollection | null;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

const gpxStyle = {
  color: "#2563eb", // Tailwind blue-600
  weight: 3,
  opacity: 0.9,
};

const waypointStyle = {
  color: "#10b981", // emerald-500
  radius: 5,
  weight: 2,
};

/**
 * Component that auto-fits map bounds to GeoJSON data.
 */
const FitBounds: React.FC<{ gj: FeatureCollection | null }> = ({
  gj,
}) => {
  const map = useMap();
  useMemo(() => {
    if (!gj) return;
    const b = computeCoordinateBounds(gj);
    if (b) {
      map.fitBounds(b, { padding: [32, 32] });
    }
  }, [gj, map]);
  return null;
};

/**
 * Interactive map component for displaying GPX tracks, routes, and waypoints.
 * Handles SSR with useIsClient hook.
 */
export const GpxMap: React.FC<GpxMapProps> = ({
  geojson,
  defaultCenter = [43.7, 7.25], // Nice-Monaco area
  defaultZoom = 11,
}) => {
  const isClient = useIsClient();

  if (!isClient) {
    // Show placeholder during SSR
    return (
      <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl bg-neutral-100 shadow">
        <div className="flex h-full items-center justify-center">
          <p className="text-neutral-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl shadow">
      <MapContainer
        style={{ height: "70vh", width: "100%" }}
        center={defaultCenter as LatLngExpression}
        zoom={defaultZoom}
      >
        {/* Free tiles via Carto/OSM (no key, generous limits for light use) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
        />

        {geojson && (
          <>
            <GeoJSON
              key={JSON.stringify(geojson)} // Force re-render on data change
              data={geojson}
              // @ts-ignore - react-leaflet GeoJSON props are loosely typed
              style={(feature: any) => {
                const geom = feature?.geometry?.type;
                if (geom === "LineString" || geom === "MultiLineString")
                  return gpxStyle;
                return { color: "#2563eb", weight: 2 };
              }}
              // @ts-ignore - react-leaflet pointToLayer typing
              pointToLayer={(feature: any, latlng: any) => {
                // Style waypoints distinctly
                if (feature?.properties?.name) {
                  return L.circleMarker(latlng, waypointStyle as any).bindTooltip(
                    String(feature.properties.name),
                  );
                }
                return L.circleMarker(latlng, waypointStyle as any);
              }}
            />
            <FitBounds gj={geojson} />
          </>
        )}
      </MapContainer>

      <MapLegend
        trackColor={gpxStyle.color}
        waypointColor={waypointStyle.color}
      />
    </div>
  );
};
