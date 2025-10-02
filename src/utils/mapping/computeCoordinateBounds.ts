import { FeatureCollection, Position } from "geojson";
import { LatLngBoundsExpression } from "leaflet";

/**
 * Computes the bounding box for a GeoJSON FeatureCollection.
 */
export const computeCoordinateBounds = (
  gj: FeatureCollection,
): LatLngBoundsExpression | null => {
  let minLat = 90,
    minLng = 180,
    maxLat = -90,
    maxLng = -180;

  function processCoordinates(pos: Position): void {
    const [lat, lng, alt] = pos;
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    }
  }

  for (const f of gj.features) {
    if (f.geometry && f.geometry.type === 'LineString') {
      f.geometry.coordinates.forEach(processCoordinates)
    }
  }

  if (minLat === 90) return null;
  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}