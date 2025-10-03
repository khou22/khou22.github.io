"use client";

import React, { useCallback, useState } from "react";
import type { FeatureCollection } from "geojson";
import { LatLngBounds } from "leaflet";
import dynamic from "next/dynamic";
import { GpxUploadControls } from "@/components/organisms/GpxUploadControls/GpxUploadControls";
import { computeCoordinateBounds } from "@/utils/mapping/computeCoordinateBounds";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";

const GpxMap = dynamic(
  () =>
    import("@/components/organisms/GpxMap/GpxMap").then((mod) => mod.GpxMap),
  {
    ssr: false,
  },
);

export const NiceMonacoRidePageClient = () => {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

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
              href={`https://www.openstreetmap.org/#map=11/${
                bounds.getCenter().lat
              }/${bounds.getCenter().lng}`}
            >
              {bounds.getCenter().lat}, {bounds.getCenter().lng}
            </CustomLink>
          </p>
        </div>
      )}

      <GpxMap geojson={geojson} defaultCenter={[43.7, 7.25]} defaultZoom={11} />
    </div>
  );
};
