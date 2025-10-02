"use client";

import React, { useRef } from "react";
import { Link2Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface GpxUrlInputProps {
  onLoad: (url: string) => void;
}

/**
 * URL input with load button for fetching GPX files from URLs.
 */
export const GpxUrlInput: React.FC<GpxUrlInputProps> = ({ onLoad }) => {
  const urlRef = useRef<HTMLInputElement>(null);

  const handleLoad = () => {
    const url = urlRef.current?.value?.trim();
    if (url) {
      onLoad(url);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link2Icon className="h-4 w-4" />
      <Input
        ref={urlRef}
        placeholder="Paste a .gpx URL (https://...)"
        className="flex-1"
      />
      <Button onClick={handleLoad}>Load</Button>
    </div>
  );
};
