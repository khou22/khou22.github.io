"use client";

import { toast } from "sonner";
import { useState } from "react";
import { ImageAnnotation } from "@/components/organisms/ImageAnnotation/ImageAnnotation";
import { BoundingBoxSelection } from "@/components/organisms/ImageAnnotation/types";
import { copyToClipboard } from "@/utils/clipboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const BoundingBoxClient = ({ imageUrl }: { imageUrl: string }) => {
  const [boundingBox, setBoundingBox] = useState<BoundingBoxSelection | null>(
    null,
  );

  const handleSelection = async (selection: BoundingBoxSelection) => {
    setBoundingBox(selection);
  };

  const boundingBoxWidthPx = boundingBox
    ? boundingBox.width * boundingBox.originalWidthPx
    : null;
  const boundingBoxHeightPx = boundingBox
    ? boundingBox.height * boundingBox.originalHeightPx
    : null;

  const handleCopySelection = async () => {
    if (!boundingBox || !boundingBoxWidthPx || !boundingBoxHeightPx) return;

    // Copy to clipboard.
    const resp = await fetch(boundingBox.imageBase64);
    const blob = await resp.blob();
    await copyToClipboard({ blob });

    // Notify user.
    toast.success(
      `Image copied (${boundingBoxWidthPx.toFixed(
        0,
      )}px x ${boundingBoxHeightPx.toFixed(0)}px)`,
    );

    setBoundingBox(null);
  };

  const handleCancelSelection = () => {
    setBoundingBox(null);
  };

  return (
    <div className="relative">
      <ImageAnnotation
        imageUrl={imageUrl}
        onBoundingBoxSelection={handleSelection}
      />

      {boundingBox && boundingBoxWidthPx && boundingBoxHeightPx && (
        <>
          <div
            className="absolute border-2 border-red-500 bg-red-500/20"
            style={{
              left: `${boundingBox.x * 100}%`,
              top: `${boundingBox.y * 100}%`,
              width: `${boundingBox.width * 100}%`,
              height: `${boundingBox.height * 100}%`,
            }}
          />
          <Card
            className="absolute flex flex-col gap-2 p-2"
            style={{
              left: `${(boundingBox.x + boundingBox.width + 0.005) * 100}%`,
              top: `${(boundingBox.y - 0.01) * 100}%`,
            }}
          >
            <p>
              Selection:{" "}
              {`${boundingBoxWidthPx.toFixed(
                0,
              )}px x ${boundingBoxHeightPx.toFixed(0)}px`}
            </p>

            <img
              src={boundingBox.imageBase64}
              className="max-w-full border border-gray-200"
              alt=""
            />

            <div className="flex gap-2">
              <Button
                onClick={handleCancelSelection}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCopySelection}
                size="sm"
                className="flex-1"
              >
                Copy Selection
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
