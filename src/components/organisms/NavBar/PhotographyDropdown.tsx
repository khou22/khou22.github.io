import { ImageCard } from "@/components/molecules/ImageCard/ImageCard";
import { LinkWithArrow } from "@/components/molecules/LinkWithArrow/LinkWithArrow";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import Link from "next/link";
import React from "react";

export const PhotographyDropdown: React.FC = () => {
  return (
    <div className="mx-auto grid max-w-screen-xl gap-x-8 gap-y-4 px-4 py-5 text-gray-900 sm:grid-cols-3 md:px-6">
      <ul>
        <li className="row-span-3 h-full">
          <Link href={PAGES.PHOTOGRAPHY.HOME}>
            <ImageCard
              title="Buy Prints"
              description="Elegant home decor"
              imageSrc={getCdnAsset("media/photography/cover/featured_jpg")}
              containerClassName="w-full h-full rounded-xl"
              contentClassName="p-4"
            />
          </Link>
        </li>
      </ul>
      <ul className="space-y-4">
        <h6 className="font-bold text-blue-500">Featured</h6>
        <li className="border-b border-gray-400/50 pb-2">
          <LinkWithArrow href={PAGES.PHOTOGRAPHY.FEATURED} className="text-sm">
            Fan Favorites
          </LinkWithArrow>
        </li>
        <li className="border-b border-gray-400/50 pb-2">
          <LinkWithArrow href={PAGES.PHOTOGRAPHY.AERIAL} className="text-sm">
            Aerial & Drone
          </LinkWithArrow>
        </li>
        <li className="border-b border-gray-400/50 pb-2">
          <LinkWithArrow href={PAGES.PHOTOGRAPHY.HOME} className="text-sm">
            Landscapes
          </LinkWithArrow>
        </li>
      </ul>
      <ul className="space-y-4">
        <h6 className="font-bold text-blue-500">Top Locations</h6>
        <li className="border-b border-gray-400/50 pb-2">
          <LinkWithArrow href={PAGES.PHOTOGRAPHY.HOME} className="text-sm">
            San Francisco
          </LinkWithArrow>
        </li>
        <li className="border-b border-gray-400/50 pb-2">
          <LinkWithArrow href={PAGES.PHOTOGRAPHY.HOME} className="text-sm">
            New York
          </LinkWithArrow>
        </li>
        <li className="border-b border-gray-400/50 pb-2">
          <LinkWithArrow href={PAGES.PHOTOGRAPHY.HOME} className="text-sm">
            Hong Kong
          </LinkWithArrow>
        </li>
        <li className="pb-1">
          <LinkWithArrow href={PAGES.PHOTOGRAPHY.HOME} className="text-sm">
            All Locations
          </LinkWithArrow>
        </li>
      </ul>
    </div>
  );
};
