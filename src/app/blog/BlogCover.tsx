"use client";

import Image from "next/image";
import { useRef } from "react";
import { FadeInView } from "@/components/atoms/FadeInView/FadeInView";
import { useIsClient } from "@/hooks/useIsClient/useIsClient";
import { useScreenSize } from "@/hooks/useScreenSize/useScreenSize";
import { useScrollPosition } from "@/hooks/useScrollPosition/useScrollPosition";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { clamp } from "@/utils/math";
import { classNames } from "@/utils/style";

export const BlogCover: React.FC = () => {
  const parallexContainer = useRef<HTMLDivElement>(null);
  const { scrollY } = useScrollPosition();
  const { height: screenHeight } = useScreenSize();
  const isClient = useIsClient();
  const isVisible = !isClient || scrollY <= screenHeight * 2;

  // Only calculate the scroll when the parallax is visible to save on performance.
  const scrollPageOffset = isVisible
    ? clamp(0, screenHeight * 1.5, scrollY)
    : 0;

  return (
    <div
      className={classNames(
        "relative block h-screen",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      ref={parallexContainer}
    >
      <Image
        fill
        src={getCdnAsset("media/site/images/Blog_Image_jpg")}
        className="object-cover"
        alt="Kevin Hou blog cover photo of basket weaving cutting boards"
      />

      <div
        className="absolute left-0 top-[22%] z-10 flex w-full flex-col items-center justify-center"
        style={{
          transform: `translateY(${scrollPageOffset / 5}px)`,
        }}
      >
        <FadeInView once>
          <img
            alt="Kevin Hou blog cover image"
            src={getCdnAsset("media/site/images/Blog_Landing_Content_png")}
            className="max-w-[500px] sm:max-w-[700px] md:max-w-[900px] 2xl:max-w-[1000px]"
          />
        </FadeInView>
      </div>
    </div>
  );
};
