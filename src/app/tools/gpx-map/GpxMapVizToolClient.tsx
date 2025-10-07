"use client";

import React, { useCallback, useState } from "react";
import type { FeatureCollection } from "geojson";
import { LatLngBounds } from "leaflet";
import dynamic from "next/dynamic";
import { GpxUploadControls } from "@/components/organisms/GpxUploadControls/GpxUploadControls";
import { computeCoordinateBounds } from "@/utils/mapping/computeCoordinateBounds";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import type { MapTheme } from "@/components/organisms/GpxMap/GpxMap";


const GpxMap = dynamic(
  () =>
    import("@/components/organisms/GpxMap/GpxMap").then((mod) => mod.GpxMap),
  {
    ssr: false,
  },
);

export const GpxMapVizToolClient = () => {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [theme, setTheme] = useState<MapTheme>("mapbox");

  const handleGpxLoad = useCallback(
    async (loadedGeojson: FeatureCollection | null, name: string) => {
      setGeojson(loadedGeojson);

      if (loadedGeojson) {
        const { bounds } = await computeCoordinateBounds(loadedGeojson);
        setBounds(bounds);
      }
    },
    [],
  );

  return (
    <div>
      <GpxUploadControls onGpxLoad={handleGpxLoad} />

      {bounds && (
        <div>
          <p>
            Map Center:{" "}
            <CustomLink
              href={`https://www.openstreetmap.org/#map=11/${bounds.getCenter().lat
                }/${bounds.getCenter().lng}`}
            >
              {bounds.getCenter().lat}, {bounds.getCenter().lng}
            </CustomLink>
          </p>
        </div>
      )}

      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="theme-select" className="text-sm font-medium">
          Map Theme:
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as MapTheme)}
          className="rounded border border-gray-300 px-3 py-1 text-sm"
        >
          <option value="mapbox">Mapbox Outdoors</option>
          <option value="carto">Carto Minimalist</option>
        </select>
      </div>

      <GpxMap
        geojson={geojson}
        defaultCenter={[43.7, 7.25]}
        defaultZoom={11}
        interactive={true}
        theme={theme}
      />
    </div>
  );
};
