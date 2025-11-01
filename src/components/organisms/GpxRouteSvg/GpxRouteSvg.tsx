import { FeatureCollection, Position } from "geojson";
import React, { useMemo } from "react";
import { computeCoordinateBounds } from "@/utils/mapping/computeCoordinateBounds";

type GpxRouteSvgProps = {
  geoJson: FeatureCollection;
  padding?: number;
} & React.SVGProps<SVGSVGElement>;

const VIEWBOX_WIDTH = 1000;

export const GpxRouteSvg: React.FC<GpxRouteSvgProps> = ({ geoJson, padding = 0.05, ...props }) => {
  const { bounds } = computeCoordinateBounds(geoJson);

  const { pathData, viewBoxHeight } = useMemo(() => {
    if (!bounds) return { pathData: "", viewBoxHeight: VIEWBOX_WIDTH };

    const minLng = bounds[0][1];
    const maxLng = bounds[1][1];
    const minLat = bounds[0][0];
    const maxLat = bounds[1][0];

    const geoWidth = maxLng - minLng;
    const geoHeight = maxLat - minLat;

    if (geoWidth === 0 || geoHeight === 0) return { pathData: "", viewBoxHeight: VIEWBOX_WIDTH };

    const paddingPx = VIEWBOX_WIDTH * padding;
    const drawWidth = VIEWBOX_WIDTH - 2 * paddingPx;
    const scale = drawWidth / geoWidth;
    const drawHeight = geoHeight * scale;
    const viewBoxHeight = drawHeight + 2 * paddingPx;

    const offsetX = paddingPx;
    const offsetY = paddingPx;

    const project = (lng: number, lat: number): [number, number] => {
      const x = offsetX + (lng - minLng) * scale;
      // Invert Y: SVG y increases downwards, latitude increases upwards.
      // Map maxLat to the top (offsetY)
      const y = offsetY + (maxLat - lat) * scale;
      return [x, y];
    };

    let d = "";
    for (const feature of geoJson.features) {
      if (feature.geometry && feature.geometry.type === "LineString") {
        feature.geometry.coordinates.forEach((coord: Position, index: number) => {
          const [lng, lat] = coord;
          const [x, y] = project(lng, lat);
          d += `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)} `;
        });
      }
    }
    return { pathData: d.trim(), viewBoxHeight };
  }, [geoJson, bounds, padding]);

  if (!bounds) return (
    <p>Error computing GPX bounds</p>
  )

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${viewBoxHeight}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d={pathData} />
    </svg>
  )
}