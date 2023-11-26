"use client";

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
    <div className="h-screen block" ref={parallexContainer}>
      <div className={sliceClassName}>
        <ProgressiveImage
          alt="Hong Kong Skyline"
          className="w-full h-full object-cover"
          src={[
            getCdnAsset("media/landing/hong_kong/0_png"),
            getCdnAsset("media/landing/hong_kong/large/0_png"),
          ]}
        />
      </div>

      {/* Clouds go behind the mountains and the logo */}
      <div
        aria-label="left animated clouds"
        className="w-[500px] fixed top-0 left-[-400px] opacity-60 pointer-events-none"
        style={{ transform: `translateX(${scrollPageOffset * 0.5}px)` }}
      >
        <img alt="left cloud" src={getCdnAsset("media/landing/cloud_0_png")} />
      </div>
      <div
        aria-label="right animated clouds"
        className="w-[900px] fixed top-0 right-[-800px] opacity-70 pointer-events-none"
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
        <span className="flex flex-col items-center sm:mt-[7%] md:mt-[9%] mt-[25%]">
          <img
            alt="Initials logo"
            className="w-24 h-24"
            src={getCdnAsset("media/site/logo/initials_logo_animated_svg")}
          />
          <p className="leading-loose mt-2">Kevin Hou</p>
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
          className="w-full h-full object-cover"
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
          className="w-full h-full object-cover"
          src={[
            getCdnAsset("media/landing/hong_kong/2_png"),
            getCdnAsset("media/landing/hong_kong/large/2_png"),
          ]}
        />
      </div>
    </div>
  );
};
