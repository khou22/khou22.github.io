"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Aboreto } from "next/font/google";
import Head from "next/head";
import { getCdnAsset, getPhotoName, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { INSTAGRAM_CAROUSEL_SIZE } from "@/constants/contentMetadata";
import { classNames } from "@/utils/style";

const captionFont = Aboreto({
  subsets: ["latin"],
  weight: "400",
});

type LandscapeImageCropProps = {
  photoID: PhotoIdType;
  className?: string;
};

export const LandscapeImageCrop: React.FC<LandscapeImageCropProps> = ({
  photoID,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoName, setPhotoName] = useState("");

  useEffect(() => {
    setPhotoName(getPhotoName(photoID));
  }, [photoID]);

  // Paint function draws the entire canvas
  const paint = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    console.log("Loading canvas assets");

    // Ensure Aboreto font is loaded for canvas text
    await document.fonts.load("32px 'Aboreto'");
    const img = new window.Image();
    img.src = getCdnAsset(photoID);
    img.onload = () => {
      // Fill background white
      ctx.fillStyle = "#fff";
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
      ctx.filter = "blur(16px) brightness(1.1)";
      ctx.globalAlpha = 0.8;
      ctx.drawImage(img, bgDx, bgDy, bgDrawWidth, bgDrawHeight);
      ctx.globalAlpha = 1;
      ctx.filter = "none";
      ctx.restore();

      // --- Content padding for title and main image (not background) ---
      const contentPadding = 40; // Adjust as needed for desired padding

      // --- Draw main sharp image with 'contain' sizing (width always matches padded content area) ---
      const canvasWidth = INSTAGRAM_CAROUSEL_SIZE.width - contentPadding * 2;
      const canvasHeight = INSTAGRAM_CAROUSEL_SIZE.height - contentPadding * 2;
      let mainDrawWidth = canvasWidth;
      let mainDrawHeight = img.height * (canvasWidth / img.width);
      let mainDx = contentPadding;
      let mainDy = contentPadding + (canvasHeight - mainDrawHeight) / 2;
      // If the image is so tall that it exceeds the content area, fit by height instead
      if (mainDrawHeight > canvasHeight) {
        mainDrawHeight = canvasHeight;
        mainDrawWidth = img.width * (canvasHeight / img.height);
        mainDx = contentPadding + (canvasWidth - mainDrawWidth) / 2;
        mainDy = contentPadding;
      }
      ctx.drawImage(img, mainDx, mainDy, mainDrawWidth, mainDrawHeight);

      // --- Draw caption (title and date) inside the canvas ---
      const captionMargin = 32;
      const captionFontSize = 32;
      const dateFontSize = 22;
      const captionY =
        INSTAGRAM_CAROUSEL_SIZE.height - captionMargin - dateFontSize - 8;
      const dateY = INSTAGRAM_CAROUSEL_SIZE.height - captionMargin;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.font = `bold ${captionFontSize}px 'Aboreto', sans-serif`;
      ctx.fillStyle = "#222";
      ctx.shadowColor = "rgba(255,255,255,0.7)";
      ctx.shadowBlur = 6;
      ctx.fillText(
        photoName.toUpperCase(),
        INSTAGRAM_CAROUSEL_SIZE.width / 2,
        captionY,
      );
      ctx.font = `normal ${dateFontSize}px 'Aboreto', sans-serif`;
      ctx.fillStyle = "#444";
      ctx.shadowColor = "rgba(255,255,255,0.7)";
      ctx.shadowBlur = 6;
      ctx.fillText("July 1, 2025", INSTAGRAM_CAROUSEL_SIZE.width / 2, dateY);
      ctx.restore();
    };
  }, [photoID, photoName]);

  // Call paint() on mount and whenever dependencies change
  useEffect(() => {
    // Call paint as async
    paint();
  }, [paint]);

  // Only render a canvas
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Aboreto:wght@400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <canvas
        ref={canvasRef}
        width={INSTAGRAM_CAROUSEL_SIZE.width}
        height={INSTAGRAM_CAROUSEL_SIZE.height}
        style={{
          height: "auto",
          display: "block",
          background: "#fff",
          aspectRatio: `${INSTAGRAM_CAROUSEL_SIZE.width} / ${INSTAGRAM_CAROUSEL_SIZE.height}`,
        }}
        className={classNames("max-h-96 max-w-full", className)}
      />
    </>
  );
};
