/* eslint-disable @next/next/no-page-custom-font */

"use client";

import React, { useCallback, useEffect } from "react";
import { DownloadIcon } from "@radix-ui/react-icons";
import { getCdnAsset, getPhotoName, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { INSTAGRAM_CAROUSEL_SIZE } from "@/constants/contentMetadata";
import { classNames } from "@/utils/style";
import { Button } from "@/components/ui/button";

type ImageCanvasProps = {
  photoID: PhotoIdType;
  className?: string;
  blur?: number;
  textColor?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  handleDownload?: () => void;
};

export const ImageCanvas = React.forwardRef<
  HTMLCanvasElement,
  ImageCanvasProps
>((props, ref) => {
  const {
    photoID,
    className,
    blur = 64,
    textColor = "#fff",
    backgroundColor = "#000",
    backgroundOpacity = 0.8,
    handleDownload,
  } = props;
  const photoName = getPhotoName(photoID);
  // Paint function draws the entire canvas
  const paint = useCallback(async () => {
    // Access the canvas through the forwarded ref
    const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ensure Aboreto font is loaded for canvas text
    await document.fonts.load("32px 'var(--font-aboreto)'");
    const img = new window.Image();
    img.src = getCdnAsset(photoID);
    img.onload = () => {
      // Fill background white
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(
        0,
        0,
        INSTAGRAM_CAROUSEL_SIZE.width,
        INSTAGRAM_CAROUSEL_SIZE.height,
      );

      // --- Draw blurred background ---
      const imgAspect = img.width / img.height;
      const canvasAspect =
        INSTAGRAM_CAROUSEL_SIZE.width / INSTAGRAM_CAROUSEL_SIZE.height;
      // --- Draw blurred background 5% larger than the canvas on all sides ---
      const overextend = 0.05; // 5% on each side
      const extendedWidth =
        INSTAGRAM_CAROUSEL_SIZE.width * (1 + 2 * overextend);
      const extendedHeight =
        INSTAGRAM_CAROUSEL_SIZE.height * (1 + 2 * overextend);
      let bgDrawWidth = extendedWidth;
      let bgDrawHeight = extendedHeight;
      let bgDx = -INSTAGRAM_CAROUSEL_SIZE.width * overextend;
      let bgDy = -INSTAGRAM_CAROUSEL_SIZE.height * overextend;

      // Maintain aspect ratio
      if (imgAspect > canvasAspect) {
        bgDrawHeight = extendedHeight;
        bgDrawWidth = img.width * (bgDrawHeight / img.height);
        bgDx =
          (INSTAGRAM_CAROUSEL_SIZE.width - bgDrawWidth) / 2 -
          INSTAGRAM_CAROUSEL_SIZE.width * overextend;
      } else {
        bgDrawWidth = extendedWidth;
        bgDrawHeight = img.height * (bgDrawWidth / img.width);
        bgDy =
          (INSTAGRAM_CAROUSEL_SIZE.height - bgDrawHeight) / 2 -
          INSTAGRAM_CAROUSEL_SIZE.height * overextend;
      }
      ctx.save();
      ctx.filter = `blur(${blur}px)`;
      ctx.globalAlpha = backgroundOpacity;
      ctx.drawImage(img, bgDx, bgDy, bgDrawWidth, bgDrawHeight);
      ctx.globalAlpha = 1;
      ctx.filter = "none";
      ctx.restore();

      // --- Content padding for title and main image (not background) ---
      const contentPadding = 40; // Adjust as needed for desired padding

      // --- Draw main image, title, and date as a vertically centered group ---
      const canvasWidth = INSTAGRAM_CAROUSEL_SIZE.width - contentPadding * 2;
      const canvasHeight = INSTAGRAM_CAROUSEL_SIZE.height - contentPadding * 2;
      let mainDrawWidth = canvasWidth;
      let mainDrawHeight = img.height * (canvasWidth / img.width);
      // If the image is so tall that it exceeds the content area, fit by height instead
      if (mainDrawHeight > canvasHeight) {
        mainDrawHeight = canvasHeight;
        mainDrawWidth = img.width * (canvasHeight / img.height);
      }
      const imageTitleGap = 312;
      const titleDateGap = 72;
      const captionFontSize = 88;
      const dateFontSize = 72;

      // Calculate total group height
      const groupHeight =
        mainDrawHeight +
        imageTitleGap +
        captionFontSize +
        titleDateGap +
        dateFontSize;

      // Top of group (vertically centered in padded area)
      const groupTop = contentPadding + (canvasHeight - groupHeight) / 2;

      // Draw main image
      const mainDx = contentPadding + (canvasWidth - mainDrawWidth) / 2;
      const mainDy = groupTop;
      ctx.drawImage(img, mainDx, mainDy, mainDrawWidth, mainDrawHeight);

      // Draw title
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.font = `normal 400 ${captionFontSize}px 'var(--font-aboreto)', system-ui`;
      ctx.fillStyle = textColor;
      const titleY = mainDy + mainDrawHeight + imageTitleGap;
      ctx.fillText(
        photoName.toUpperCase(),
        INSTAGRAM_CAROUSEL_SIZE.width / 2,
        titleY,
      );

      // Draw date
      ctx.font = `normal 400 ${dateFontSize}px 'var(--font-aboreto)', system-ui`;
      const dateY = titleY + captionFontSize + titleDateGap;
      ctx.fillText("July 1, 2025", INSTAGRAM_CAROUSEL_SIZE.width / 2, dateY);
      ctx.restore();
    };
  }, [
    backgroundColor,
    backgroundOpacity,
    blur,
    photoID,
    photoName,
    textColor,
    ref,
  ]);

  // Call paint() on mount and whenever dependencies change
  useEffect(() => {
    // Call paint as async
    paint();
  }, [paint]);

  // Only render a canvas
  return (
    <div className="group relative">
      {handleDownload && (
        <Button
          type="button"
          size="icon"
          variant="default"
          className="invisible absolute left-2 top-2 z-10 group-hover:visible"
          onClick={handleDownload}
        >
          <DownloadIcon />
        </Button>
      )}
      <canvas
        ref={ref}
        width={INSTAGRAM_CAROUSEL_SIZE.width}
        height={INSTAGRAM_CAROUSEL_SIZE.height}
        style={{
          height: "auto",
          display: "block",
          background: "#fff",
          aspectRatio: `${INSTAGRAM_CAROUSEL_SIZE.width} / ${INSTAGRAM_CAROUSEL_SIZE.height}`,
        }}
        className={classNames("max-w-full", className)}
      />
    </div>
  );
});

// Add display name for React DevTools
ImageCanvas.displayName = "ImageCanvas";
