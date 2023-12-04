"use client";

import { useRef } from "react";

type PaperTextureProps = React.HTMLAttributes<HTMLDivElement>;

export const PaperTexture: React.FC<PaperTextureProps> = ({
  style,
  ...props
}) => {
  const filterId = useRef<string>(`roughpaper`);

  return (
    <>
      <div
        {...props}
        style={{
          ...style,
          overflow: "hidden",
          filter: `url(#${filterId.current})`,
        }}
      />
      <svg className="h-0 w-0">
        <filter id={filterId.current}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            result="noise"
            numOctaves="5"
          />

          <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="75" />
          </feDiffuseLighting>
        </filter>
      </svg>
    </>
  );
};
