import { FeatureCollection, Position } from "geojson";
import { LatLng, LatLngBounds } from "leaflet";

/**
 * Computes the bounding box for a GeoJSON FeatureCollection.
 */
export const computeCoordinateBounds = (
  gj: FeatureCollection,
): { bounds: LatLngBounds | null; accumulatedAlt: number } => {
  let minLat = 90,
    minLng = 180,
    maxLat = -90,
    maxLng = -180;
  let accumulatedAlt = 0;

  // Iterate over each feature.
  for (const f of gj.features) {
    if (f.geometry && f.geometry.type === "LineString") {
      let prevAlt: number | null = null;
      f.geometry.coordinates.forEach((pos: Position) => {
        const [lng, lat, alt] = pos;

        // Update bounding box.
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
        }

        // Compute accumulated altitude.
        if (prevAlt !== null) {
          accumulatedAlt += alt - prevAlt;
        }
        prevAlt = alt;
      });
    }
  }

  if (minLat === 90) return { bounds: null, accumulatedAlt: 0 };
  return {
    bounds: new LatLngBounds(
      new LatLng(minLat, minLng),
      new LatLng(maxLat, maxLng),
    ),
    accumulatedAlt,
  };
};
