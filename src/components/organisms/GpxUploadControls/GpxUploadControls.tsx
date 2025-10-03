"use client";

import React, { useCallback, useState } from "react";
import type { FeatureCollection } from "geojson";
import { Card, CardContent } from "@/components/ui/card";
import { GpxUploadInput } from "@/components/atoms/GpxUploadInput/GpxUploadInput";
import { GpxUrlInput } from "@/components/atoms/GpxUrlInput/GpxUrlInput";
import { parseGpxXml } from "@/utils/mapping/parseGpxXml";

export interface GpxUploadControlsProps {
  onGpxLoad?: (geojson: FeatureCollection | null, name: string) => void;
}

/**
 * Upload controls for GPX files - file upload and URL input.
 * Manages GPX parsing state and displays errors.
 */
export const GpxUploadControls: React.FC<GpxUploadControlsProps> = ({
  onGpxLoad,
}) => {
  const [error, setError] = useState<Error | null>();
  const [name, setName] = useState<string | null>();

  const handleXml = useCallback((xml: string) => {
    try {
      const gpx = parseGpxXml(xml);
      const name = gpx.name || 'Unknown';
      onGpxLoad?.(gpx.geo, name);
      setName(name);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error(`Unknown error: ${e}`));
      }
    }
  }, [onGpxLoad]);


  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        throw new Error('No files in upload')
      }

    file.text().then((text) => handleXml(text)).catch((error) => setError(error));
  }, [handleXml]);

  const handleUrlLoad = useCallback((url: string) => {
    fetch(url)
      .then((response) => response.text())
      .then((text) => handleXml(text))
      .catch((error) => setError(error));
  }, [handleXml]);

  return (
    <Card className="mb-4 rounded-2xl">
      <CardContent className="p-4 md:p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <GpxUploadInput onChange={handleFileChange} />
          <div className="md:col-span-2">
            <GpxUrlInput onLoad={handleUrlLoad} />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error.message}</p>}
        {name && !error && (
          <p className="mt-3 text-sm text-neutral-600">
            Loaded: <span className="font-medium">{name}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
