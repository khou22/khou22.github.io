import { FeatureCollection, Position } from "geojson";

/**
 * Calculate stats from a GPX GeoJSON.
 * 
 * @param geoJson The GeoJSON FeatureCollection parsed from the GPX file.
 * @param hardcodedMovingTime Optional hardcoded moving time in seconds.
 */
export const calculateGpxStats = (
  geoJson: FeatureCollection
): { distance: number; elevation: number } => {
  let totalDistance = 0;
  let totalElevationGain = 0;

  // Flatten all coordinates from all features
  const coordinates: Position[] = [];

  geoJson.features.forEach((feature) => {
    if (feature.geometry.type === "LineString") {
      coordinates.push(...feature.geometry.coordinates);
    } else if (feature.geometry.type === "MultiLineString") {
      feature.geometry.coordinates.forEach((line) => {
        coordinates.push(...line);
      });
    }
  });

  if (coordinates.length < 2) {
    return { distance: 0, elevation: 0 };
  }

  for (let i = 0; i < coordinates.length - 1; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[i + 1];

    // Distance (Haversine formula)
    totalDistance += getDistanceFromLatLonInKm(p1[1], p1[0], p2[1], p2[0]);

    // Elevation Gain
    // GeoJSON coordinates are [lon, lat, ele]
    const ele1 = p1[2] || 0;
    const ele2 = p2[2] || 0;

    if (ele2 > ele1) {
      totalElevationGain += (ele2 - ele1);
    }
  }

  return {
    distance: totalDistance,
    elevation: totalElevationGain,
  };
};

/**
 * Haversine formula to calculate distance between two points on Earth.
 */
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
