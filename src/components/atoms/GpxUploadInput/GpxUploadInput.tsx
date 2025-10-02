"use client";

import React from "react";
import { UploadIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";

export interface GpxUploadInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * File upload input for GPX files.
 */
export const GpxUploadInput: React.FC<GpxUploadInputProps> = ({ onChange }) => {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <UploadIcon className="h-4 w-4" />
      <Input type="file" accept=".gpx" onChange={onChange} />
    </label>
  );
};
