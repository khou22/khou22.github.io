"use client";

import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { useEffect, useRef, useState } from "react";

export const ParallaxCover = () => {
  const parallexContainer = useRef<HTMLDivElement>(null);
  const [scrollPageOffset, setScrollPageOffset] = useState(0);

  useEffect(() => {
    const scrollListener = () => {
      setScrollPageOffset(window.scrollY);
    };
    window.addEventListener("scroll", scrollListener, false);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  const getTransform = (i: number) => {
    const transform = "translateY(-" + (scrollPageOffset * i) / 4 + "px)";
    return transform;
  };

  // Class names for each slice of the parallax.
  const sliceClassName =
    "fixed top-0 bg-center w-full justify-center flex h-full";

  return (
    <div className="h-screen block" ref={parallexContainer}>
      <div className={sliceClassName}>
        <img
          alt="Hong Kong Skyline"
          className="w-full h-full object-cover"
          src={getCdnAsset("media/landing/hong_kong/0_png")}
        />
      </div>

      {/* Personal logo and name - second furthest back to give sense of depth */}
      <div
        className={sliceClassName}
        style={{
          transform: getTransform(1),
        }}
      >
        <span className="flex flex-col items-center sm:mt-[8%] mt-[25%]">
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
        <img
          alt="Hong Kong Skyline middle layer"
          className="w-full h-full object-cover"
          src={getCdnAsset("media/landing/hong_kong/1_png")}
        />
      </div>
      <div
        className={sliceClassName}
        style={{
          transform: getTransform(3),
        }}
      >
        <img
          alt="Hong Kong Skyline top layer"
          className="w-full h-full object-cover"
          src={getCdnAsset("media/landing/hong_kong/2_png")}
        />
      </div>
    </div>
  );
};
