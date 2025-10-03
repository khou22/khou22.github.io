"use client";

import React, { useCallback, useState } from "react";
import type { FeatureCollection } from "geojson";
import { LatLngBounds } from "leaflet";
import dynamic from "next/dynamic";
import { GpxUploadControls } from "@/components/organisms/GpxUploadControls/GpxUploadControls";
import { computeCoordinateBounds } from "@/utils/mapping/computeCoordinateBounds";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import type { Waypoint } from "@/components/organisms/GpxMap/GpxMap";

// Waypoints for the Nice-Cote d'Eze cycling route
const ROUTE_WAYPOINTS: Waypoint[] = [
  {
    lat: 43.6951,
    lng: 7.2615,
    name: "Nice - Starting Point",
    description: "Begin your ride along the beautiful Promenade des Anglais",
    imageUrl: "https://picsum.photos/seed/nice-start/400/300",
  },
  {
    lat: 43.7279,
    lng: 7.3612,
    name: "Èze Village",
    description: "Historic hilltop village with stunning Mediterranean views",
    imageUrl: "https://picsum.photos/seed/eze-village/400/300",
  },
  {
    lat: 43.7284,
    lng: 7.4167,
    name: "Col d'Èze",
    description: "Mountain pass at 507m elevation - challenging climb",
    imageUrl: "https://picsum.photos/seed/col-eze/400/300",
  },
  {
    lat: 43.7314,
    lng: 7.4191,
    name: "Grande Corniche",
    description: "Scenic coastal road with breathtaking panoramas",
    imageUrl: "https://picsum.photos/seed/grande-corniche/400/300",
  },
  {
    lat: 43.7407,
    lng: 7.4261,
    name: "Turbie",
    description: "Ancient Roman Trophy overlooking Monaco",
    imageUrl: "https://picsum.photos/seed/turbie/400/300",
  },
];

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

      <GpxMap
        geojson={geojson}
        defaultCenter={[43.7, 7.25]}
        defaultZoom={11}
        waypoints={ROUTE_WAYPOINTS}
        interactive={true}
      />
    </div>
  );
};
