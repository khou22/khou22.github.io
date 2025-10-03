"use client";

import React, { useMemo } from "react";
import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  CircleMarker,
  Popup,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { FeatureCollection } from "geojson";
import L from "leaflet";
import { useIsClient } from "@/hooks/useIsClient/useIsClient";
import { MapLegend } from "@/components/atoms/MapLegend/MapLegend";
import { computeCoordinateBounds } from "@/utils/mapping/computeCoordinateBounds";

export interface Waypoint {
  lat: number;
  lng: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface GpxMapProps {
  geojson: FeatureCollection | null;
  defaultCenter?: [number, number];
  defaultZoom?: number;
  waypoints?: Waypoint[];
  interactive?: boolean;
}

const gpxStyle = {
  color: "#c026d3", // Vibrant fuchsia for the route
  weight: 4,
  opacity: 0.85,
};

const waypointStyle = {
  color: "#0ea5e9", // Sky blue for waypoints
  fillColor: "#0ea5e9",
  fillOpacity: 0.6,
  radius: 8,
  weight: 3,
};

/**
 * Component that auto-fits map bounds to GeoJSON data.
 */
const FitBounds: React.FC<{ gj: FeatureCollection | null }> = ({ gj }) => {
  const map = useMap();
  useMemo(() => {
    if (!gj) return;
    const { bounds } = computeCoordinateBounds(gj);
    if (bounds) {
      map.fitBounds(bounds, { padding: [32, 32] });
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
  waypoints = [],
  interactive = true,
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
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        scrollWheelZoom={interactive}
        boxZoom={interactive}
        keyboard={interactive}
        zoomControl={interactive}
      >
        {/* Minimalist tile layer with reduced labels */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
                  return L.circleMarker(
                    latlng,
                    waypointStyle as any,
                  ).bindTooltip(String(feature.properties.name));
                }
                return L.circleMarker(latlng, waypointStyle as any);
              }}
            />
            <FitBounds gj={geojson} />
          </>
        )}

        {/* Render custom waypoints */}
        {waypoints.map((waypoint, idx) => (
          <CircleMarker
            key={idx}
            center={[waypoint.lat, waypoint.lng]}
            pathOptions={{
              color: waypointStyle.color,
              fillColor: waypointStyle.fillColor,
              fillOpacity: waypointStyle.fillOpacity,
              weight: waypointStyle.weight,
            }}
            radius={waypointStyle.radius}
            eventHandlers={{
              click: (e) => {
                // Prevent event propagation when in non-interactive mode
                if (!interactive) {
                  e.originalEvent.stopPropagation();
                }
              },
            }}
          >
            <Popup>
              <div className="max-w-xs">
                {waypoint.imageUrl && (
                  <img
                    src={waypoint.imageUrl}
                    alt={waypoint.name}
                    className="mb-2 h-32 w-full rounded object-cover"
                  />
                )}
                <strong>{waypoint.name}</strong>
                {waypoint.description && (
                  <>
                    <br />
                    <span className="text-sm text-gray-600">
                      {waypoint.description}
                    </span>
                  </>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <MapLegend
        trackColor={gpxStyle.color}
        waypointColor={waypointStyle.color}
      />
    </div>
  );
};
