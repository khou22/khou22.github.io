"use client";

import React, { useCallback, useState } from "react";
import type { FeatureCollection } from "geojson";
import { Card, CardContent } from "@/components/ui/card";
import { GpxUploadInput } from "@/components/atoms/GpxUploadInput/GpxUploadInput";
import { GpxUrlInput } from "@/components/atoms/GpxUrlInput/GpxUrlInput";
import { useGpxParser } from "@/hooks/useGpxParser/useGpxParser";

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
  const [geojson, setGeojson] = useState<FeatureCollection | null>(
    null,
  );
  const [name, setName] = useState('')
  const { fromFile, fromUrl } = useGpxParser();

  // Notify parent when GPX is loaded
  React.useEffect(() => {
    if (onGpxLoad && geojson) {
      onGpxLoad(geojson, name);
    }
  }, [geojson, name, onGpxLoad]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        throw new Error('No files in upload')
      }
      const text = await file.text();
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      } else {
        setError(new Error(`Unknown error: ${e}`))
      }
    }
  }, []);

  const handleUrlLoad = (url: string) => {
    fromUrl(url);
  };

  return (
    <Card className="mb-4 rounded-2xl">
      <CardContent className="p-4 md:p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <GpxUploadInput onChange={handleFileChange} />
          <div className="md:col-span-2">
            <GpxUrlInput onLoad={handleUrlLoad} />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {name && !error && (
          <p className="mt-3 text-sm text-neutral-600">
            Loaded: <span className="font-medium">{name}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
