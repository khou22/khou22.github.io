import { FeatureCollection, Position } from "geojson";
import React, { useMemo } from "react";
import { computeCoordinateBounds } from "@/utils/mapping/computeCoordinateBounds";

type GpxRouteSvgProps = {
  geoJson: FeatureCollection;
} & React.SVGProps<SVGSVGElement>;

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 1000;
const PADDING = 50; // 5% padding

export const GpxRouteSvg: React.FC<GpxRouteSvgProps> = ({ geoJson, ...props }) => {
  const { bounds } = computeCoordinateBounds(geoJson);

  const pathData = useMemo(() => {
    if (!bounds) return "";

    const minLng = bounds.getWest();
    const maxLng = bounds.getEast();
    const minLat = bounds.getSouth();
    const maxLat = bounds.getNorth();

    const geoWidth = maxLng - minLng;
    const geoHeight = maxLat - minLat;

    if (geoWidth === 0 || geoHeight === 0) return "";

    const drawWidth = VIEWBOX_WIDTH - 2 * PADDING;
    const drawHeight = VIEWBOX_HEIGHT - 2 * PADDING;

    const scaleX = drawWidth / geoWidth;
    const scaleY = drawHeight / geoHeight;
    // Use the smaller scale to ensure it fits within the box while maintaining aspect ratio
    const scale = Math.min(scaleX, scaleY);

    // Center the path if one dimension is smaller than the available space
    const offsetX = PADDING + (drawWidth - geoWidth * scale) / 2;
    const offsetY = PADDING + (drawHeight - geoHeight * scale) / 2;

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
    return d.trim();
  }, [geoJson, bounds]);

  if (!bounds) return (
    <p>Error computing GPX bounds</p>
  )

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
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