"use client";

import { useRef } from "react";
import { cloudsAssetURL, initialsLogoAssetURL, panoramaSlices } from "./assets";
import { FadeInView } from "@/components/atoms/FadeInView/FadeInView";
import { ProgressiveImage } from "@/components/atoms/ProgressiveImage/ProgressiveImage";
import { SocialLinks } from "@/components/molecules/SocialLinks/SocialLinks";
import { useIsClient } from "@/hooks/useIsClient/useIsClient";
import { useScreenSize } from "@/hooks/useScreenSize/useScreenSize";
import { useScrollPosition } from "@/hooks/useScrollPosition/useScrollPosition";
import { clamp } from "@/utils/math";
import { classNames } from "@/utils/style";
import { GlowingButton } from "@/components/atoms/GlowingButton/GlowingButton";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon/ArrowRightIcon";
import Link from "next/link";
import { PAGES } from "@/utils/pages";

export const ParallaxCover: React.FC = () => {
  const parallexContainer = useRef<HTMLDivElement>(null);
  const { scrollY } = useScrollPosition();
  const { height: screenHeight, width: screenWidth } = useScreenSize();
  const isClient = useIsClient();
  const isMobile = isClient && (screenWidth < 768);
  const isVisible = !isClient || scrollY <= screenHeight * 2;

  // Only calculate the scroll when the parallax is visible to save on performance.
  const scrollPageOffset = isVisible
    ? clamp(0, screenHeight * 1.5, scrollY)
    : 0;

  const getTransform = (i: number) => {
    const transform = "translateY(-" + (scrollPageOffset * i) / 4 + "px)";
    return transform;
  };

  // Class names for each slice of the parallax.
  const sliceClassName =
    "fixed top-0 bg-center w-full justify-center flex h-full pointer-events-none";

  return (
    <div
      className={classNames(
        "relative block h-screen",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      ref={parallexContainer}
    >
      <div className={sliceClassName}>
        <ProgressiveImage
          alt="Hong Kong Skyline"
          className="h-full w-full object-cover"
          src={[panoramaSlices[0].small, panoramaSlices[0].full]}
        />
      </div>

      {/* Clouds go behind the mountains and the logo */}
      <div
        aria-label="left animated clouds"
        className="pointer-events-none fixed left-[-400px] top-0 w-[500px] opacity-60"
        style={{ transform: `translateX(${scrollPageOffset * 0.5}px)` }}
      >
        <img alt="left cloud" src={cloudsAssetURL} />
      </div>
      <div
        aria-label="right animated clouds"
        className="pointer-events-none fixed right-[-800px] top-0 w-[900px] opacity-70"
        style={{ transform: `translateX(-${scrollPageOffset * 1.15}px)` }}
      >
        <img alt="right cloud" src={cloudsAssetURL} />
      </div>

      {/* Personal logo and name - second furthest back to give sense of depth */}
      <div
        className={sliceClassName}
        style={{
          transform: getTransform(1),
        }}
      >
        <span className="pointer-events-auto mt-[25%] flex flex-col items-center sm:mt-[7%] md:mt-[9%]">
          <FadeInView once durationMS={1000} delayMS={isMobile ? 500 : 3000}>
            <Link href={PAGES.PHOTOGRAPHY.HOME}>
              <GlowingButton
                containerClassName="mb-6 md:mb-8"
                className="px-3 py-1 flex flex-row space-x-2"
              >
                <span>
                  New Photo Prints
                </span>
                <ArrowRightIcon className="h-4 w-4" />
              </GlowingButton>
            </Link>
          </FadeInView>
          <img
            alt="Initials logo"
            className="h-24 w-24"
            src={initialsLogoAssetURL}
          />
          <FadeInView once durationMS={2000} delayMS={500}>
            <p className="pointer-events-auto mt-2 leading-loose">Kevin Hou</p>
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
          src={[panoramaSlices[1].small, panoramaSlices[1].full]}
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
          src={[panoramaSlices[2].small, panoramaSlices[2].full]}
        />
      </div>

      <div
        className="fixed bottom-[20%] left-0 z-10 flex w-full flex-row items-center justify-center px-8 xs:bottom-[12%] sm:bottom-8 sm:justify-start"
        style={{
          transform: getTransform(4.2),
        }}
      >
        <FadeInView once durationMS={1000} delayMS={900}>
          <SocialLinks className="space-x-4" showColors />
        </FadeInView>
      </div>
    </div>
  );
};
