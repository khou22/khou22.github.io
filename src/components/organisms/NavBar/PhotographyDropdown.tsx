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
          <Link href={PAGES.PHOTOGRAPHY}>
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
      <ul className="space-y-3">
        <h6 className="font-bold text-blue-600">By Location</h6>
        <li className="border-b border-gray-200 pb-2">
          <LinkWithArrow href={PAGES.PHOTOGRAPHY}>San Francisco</LinkWithArrow>
        </li>
        <li className="border-b border-gray-200 pb-2">
          <LinkWithArrow href={PAGES.PHOTOGRAPHY}>New York</LinkWithArrow>
        </li>
        <li className="border-b border-gray-200 pb-2">
          <LinkWithArrow href={PAGES.PHOTOGRAPHY}>Hong Kong</LinkWithArrow>
        </li>
        <li className="pb-1">
          <LinkWithArrow href={PAGES.PHOTOGRAPHY}>All Locations</LinkWithArrow>
        </li>
      </ul>
    </div>
  );
};
