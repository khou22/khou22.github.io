"use client";

import { RadioGroup } from "@headlessui/react";
import { useState } from "react";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PhotoTagBadge } from "@/components/atoms/PhotoTagBadge/PhotoTagBadge";
import { InputWithCopy } from "@/components/molecules/InputWithCopy/InputWithCopy";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { photoPricing } from "@/constants/photoPricing";
import { PhotoTags } from "@/constants/photoTags";
import { siteMetadata } from "@/constants/siteMetadata";
import { PhotoIdType, getPhotoName } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { classNames } from "@/utils/style";

type ProductDetailsProps = {
  photoID: PhotoIdType;
  tags: PhotoTags[];
};

const defaultPhotoSize = photoPricing[1];

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  photoID,
  tags,
}) => {
  const [selectedSizeID, setSelectedSizeID] = useState(defaultPhotoSize.id);
  const selectedSize =
    photoPricing.find((pricing) => pricing.id === selectedSizeID) ??
    defaultPhotoSize;

  return (
    <div className="flex flex-col items-start justify-start space-y-6">
      <div>
        <h3 className="break-words">{getPhotoName(photoID)}</h3>
        <h4 className="mt-2 font-medium text-gray-800">
          ${selectedSize.price}
        </h4>

        <div className="mt-2 flex flex-row flex-wrap items-center justify-start gap-1">
          {tags.map((tag) => (
            <PhotoTagBadge key={tag} photoTag={tag} />
          ))}
        </div>
      </div>

      <div className="w-full">
        <Label>Choose a print size</Label>
        <RadioGroup
          value={selectedSizeID}
          onChange={setSelectedSizeID}
          className="mt-2"
        >
          <RadioGroup.Label className="sr-only">
            Choose a print size
          </RadioGroup.Label>
          <div className="grid w-full grid-cols-4 gap-3 sm:grid-cols-5">
            {photoPricing.map((pricing) => (
              <RadioGroup.Option
                key={pricing.id}
                value={pricing.id}
                className={({ active, checked }) =>
                  classNames(
                    pricing.inStock
                      ? "cursor-pointer focus:outline-none"
                      : "cursor-not-allowed opacity-25",
                    active ? "ring-2 ring-blue-500 ring-offset-2" : "",
                    checked
                      ? "border-transparent bg-blue-500 text-white hover:bg-blue-600"
                      : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                    "flex items-center justify-center rounded-md border px-3 py-3 text-sm font-medium sm:flex-1",
                  )
                }
                disabled={!pricing.inStock}
              >
                <RadioGroup.Label as="span">{pricing.name}</RadioGroup.Label>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
      <Button variant="primary" className="w-full">
        Add to cart
      </Button>
      <div className="[&>p]:mb-4">
        <Label>Description</Label>
        <p className="caption">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>

        <Label>Custom Sizes</Label>
        <p className="caption">
          Don&apos;t see a size you&apos;re looking for? I do custom orders
          (panorama, three panels, etc.){" "}
          <CustomLink href={PAGES.CONTACT}>by request</CustomLink>.
        </p>

        <Label>Share</Label>
        <InputWithCopy
          className="mb-4 mt-0.5"
          text={`${siteMetadata.siteUrl}${PAGES.PHOTOGRAPHY.PHOTO(photoID)}`}
        />

        <Label>Materials</Label>
        <p className="caption">Test</p>
      </div>
    </div>
  );
};
