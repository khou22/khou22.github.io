"use client";

import { useIsClient } from "@/hooks/useIsClient/useIsClient";
import { useScreenSize } from "@/hooks/useScreenSize/useScreenSize";
import { useScrollPosition } from "@/hooks/useScrollPosition/useScrollPosition";
import { clamp, interpolate } from "@/utils/math";
import { classNames } from "@/utils/style";
import React, { useRef } from "react";

export type ParallaxTextBackgroundProps =
  React.ComponentPropsWithoutRef<"h1"> & {
    /**
     * When the parallax should be applied. Defaults to "screen".
     */
    parallaxWindow: "screen" | "element";
    backgroundURL: string;
  };

export const ParallaxTextBackground: React.FC<ParallaxTextBackgroundProps> = ({
  backgroundURL,
  parallaxWindow = "screen",
  children,
  ...props
}) => {
  const isClient = useIsClient();

  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollY } = useScrollPosition();
  const screenSize = useScreenSize();

  const top = ref.current?.getBoundingClientRect().top ?? 0;
  const y1 = top + scrollY;
  const height = ref.current?.getBoundingClientRect().height ?? 0;
  const y2 = y1 + height;

  // The scroll region where the parallax is actively animating.
  const startBound = parallaxWindow === "screen" ? y1 - screenSize.height : y1;
  const endBound = y2;

  // 0% when the element is at the bottom of the screen. 100% when it passes out of the screen at the top.
  const progress = clamp(
    0,
    1,
    (scrollY - startBound) / (endBound - startBound),
  );

  const positionY = interpolate(0, 30, progress, "easeOut");
  const zoom = interpolate(4, 1, progress, "easeOut");

  return (
    <h1
      ref={ref}
      {...props}
      className={classNames(props.className, "text-mask")}
      data-parallax-progress={`${(progress * 100).toFixed(2)}%`}
      style={
        isClient
          ? {
              transition:
                "background-position-y 0.6s ease-out, background-size 0.6s ease-out",
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
