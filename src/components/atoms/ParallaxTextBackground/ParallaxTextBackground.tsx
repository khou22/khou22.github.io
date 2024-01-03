"use client";

import { useIsClient } from "@/hooks/useIsClient/useIsClient";
import { useIsVisible } from "@/hooks/useIsVisible/useIsVisible";
import { useScreenSize } from "@/hooks/useScreenSize/useScreenSize";
import { useScrollPosition } from "@/hooks/useScrollPosition/useScrollPosition";
import { clamp, interpolate } from "@/utils/math";
import { classNames } from "@/utils/style";
import React, { useMemo, useRef } from "react";

export type ParallaxTextBackgroundProps =
  React.ComponentPropsWithoutRef<"h1"> & {
    /**
     * When the parallax should be applied. Defaults to "screen".
     */
    parallaxWindow: "screen" | "element";
    backgroundURL: string;
    transformYBounds?: [number, number];
    zoomBounds?: [number, number];
  };

export const ParallaxTextBackground: React.FC<ParallaxTextBackgroundProps> = ({
  backgroundURL,
  parallaxWindow = "screen",
  transformYBounds = [0, 30],
  zoomBounds = [1, 4],
  children,
  ...props
}) => {
  const isClient = useIsClient();
  const ref = useRef<HTMLHeadingElement>(null);
  const isVisible = useIsVisible(ref);

  const { scrollY } = useScrollPosition();
  const screenSize = useScreenSize();

  // 0% when the element is at the bottom of the screen. 100% when it passes out of the screen at the top.
  const progress = useMemo(() => {
    // Only calculate the scroll when the parallax is visible to save on performance.
    if (!isVisible || !isClient) return 0;

    const clientRect = ref.current?.getBoundingClientRect();
    const top = clientRect?.top ?? 0;
    const y1 = top + scrollY;
    const height = clientRect?.height ?? 0;
    const y2 = y1 + height;

    // The scroll region where the parallax is actively animating.
    const startBound =
      parallaxWindow === "screen" ? y1 - screenSize.height : y1;
    const endBound = y2;

    return clamp(0, 1, (scrollY - startBound) / (endBound - startBound));
  }, [isVisible, isClient, scrollY, parallaxWindow, screenSize.height]);

  const positionY = interpolate(
    transformYBounds[0],
    transformYBounds[1],
    progress,
    "easeOut",
  );
  const zoom = interpolate(zoomBounds[0], zoomBounds[1], progress, "easeOut");

  return (
    <h1
      ref={ref}
      {...props}
      className={classNames(props.className, "text-mask")}
      data-parallax-progress={`${(progress * 100).toFixed(2)}%`}
      style={
        isClient
          ? {
              transition: "background-size 750ms ease-out",
              backgroundColor: "gray", // Just in case the image does not load.
              backgroundImage: backgroundURL,
              backgroundRepeat: "no-repeat",
              backgroundPositionY: `${positionY}%`,
              backgroundSize: `${zoom * 100}% auto`,
            }
          : {
              backgroundImage: backgroundURL,
            }
      }
    >
      {children}
    </h1>
  );
};
