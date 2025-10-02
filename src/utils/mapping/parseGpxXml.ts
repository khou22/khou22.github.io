import { FeatureCollection } from "geojson";

// @ts-ignore - togeojson doesn't have perfect types
import { gpx as gpxToGeoJSON } from "togeojson";

/**
 * Parse GPX XML text into a GeoJSON.FeatureCollection while also parsing some
 * metadata.
 */
export const parseGpxXml = (xmlText: string): { name: string | null, geo: FeatureCollection } => {
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");

  const rootName =
    doc.querySelector("gpx > metadata > name, gpx > trk > name, gpx > rte > name")
      ?.textContent;

  const gj = gpxToGeoJSON(doc) as GeoJSON.FeatureCollection;

  return {
    name: rootName ?? null,
    geo: gj,
  }
}