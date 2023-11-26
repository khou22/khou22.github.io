"use client";

import { FadeInView } from "@/components/atoms/FadeInView/FadeInView";
import { ProgressiveImage } from "@/components/atoms/ProgressiveImage/ProgressiveImage";
import { useScrollPosition } from "@/hooks/useScrollPosition/useScrollPosition";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { useRef } from "react";

type ParallaxCoverProps = {};

export const ParallaxCover: React.FC<ParallaxCoverProps> = ({}) => {
  const parallexContainer = useRef<HTMLDivElement>(null);
  const { scrollY: scrollPageOffset } = useScrollPosition();

  const getTransform = (i: number) => {
    const transform = "translateY(-" + (scrollPageOffset * i) / 4 + "px)";
    return transform;
  };

  // Class names for each slice of the parallax.
  const sliceClassName =
    "fixed top-0 bg-center w-full justify-center flex h-full pointer-events-none";

  return (
    <div className="block h-screen" ref={parallexContainer}>
      <div className={sliceClassName}>
        <ProgressiveImage
          alt="Hong Kong Skyline"
          className="h-full w-full object-cover"
          src={[
            getCdnAsset("media/landing/hong_kong/0_png"),
            getCdnAsset("media/landing/hong_kong/large/0_png"),
          ]}
        />
      </div>

      {/* Clouds go behind the mountains and the logo */}
      <div
        aria-label="left animated clouds"
        className="pointer-events-none fixed left-[-400px] top-0 w-[500px] opacity-60"
        style={{ transform: `translateX(${scrollPageOffset * 0.5}px)` }}
      >
        <img alt="left cloud" src={getCdnAsset("media/landing/cloud_0_png")} />
      </div>
      <div
        aria-label="right animated clouds"
        className="pointer-events-none fixed right-[-800px] top-0 w-[900px] opacity-70"
        style={{ transform: `translateX(-${scrollPageOffset * 1.15}px)` }}
      >
        <img alt="right cloud" src={getCdnAsset("media/landing/cloud_0_png")} />
      </div>

      {/* Personal logo and name - second furthest back to give sense of depth */}
      <div
        className={sliceClassName}
        style={{
          transform: getTransform(1),
        }}
      >
        <span className="mt-[25%] flex flex-col items-center sm:mt-[7%] md:mt-[9%]">
          <img
            alt="Initials logo"
            className="h-24 w-24"
            src={getCdnAsset("media/site/logo/initials_logo_animated_svg")}
          />
          <FadeInView once durationMS={2000} delayMS={500}>
            <p className="mt-2 leading-loose">Kevin Hou</p>
          </FadeInView>
        </span>
      </div>

      <div
        className={sliceClassName}
        style={{
          transform: getTransform(2),
        }}
      >
        <ProgressiveImage
          alt="Hong Kong Skyline middle layer"
          className="h-full w-full object-cover"
          src={[
            getCdnAsset("media/landing/hong_kong/1_png"),
            getCdnAsset("media/landing/hong_kong/large/1_png"),
          ]}
        />
      </div>
      <div
        className={sliceClassName}
        style={{
          transform: getTransform(3),
        }}
      >
        <ProgressiveImage
          alt="Hong Kong Skyline top layer"
          className="h-full w-full object-cover"
          src={[
            getCdnAsset("media/landing/hong_kong/2_png"),
            getCdnAsset("media/landing/hong_kong/large/2_png"),
          ]}
        />
      </div>
    </div>
  );
};
