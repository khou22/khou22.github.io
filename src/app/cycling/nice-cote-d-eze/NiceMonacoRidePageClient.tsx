'use client'

import React, { useState } from "react";
import type { FeatureCollection } from "geojson";
import { LatLngBoundsExpression } from "leaflet";
import { GpxUploadControls } from "@/components/organisms/GpxUploadControls/GpxUploadControls";
import { computeCoordinateBounds } from "@/utils/mapping/computeCoordinateBounds";
import { GpxMap } from "@/components/organisms/GpxMap/GpxMap";

export const NiceMonacoRidePageClient = () => {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(
    null,
  );
  const [bounds, setBounds] = useState<LatLngBoundsExpression | null>(null)

  const handleGpxLoad = async (
    loadedGeojson: FeatureCollection | null,
    name: string,
  ) => {
    setGeojson(loadedGeojson);

    if (loadedGeojson) {
      const { bounds } = await computeCoordinateBounds(loadedGeojson)
      setBounds(bounds)
    }
  };

  return (
    <div>
      <GpxUploadControls onGpxLoad={handleGpxLoad} />

      {bounds && (
        <div>
          <p>{JSON.stringify(bounds, null, 2)}</p>
        </div>
      )}

      <GpxMap geojson={geojson} defaultCenter={[43.7, 7.25]} defaultZoom={11} />
    </div>
  );
}
