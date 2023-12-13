"use client";

import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { Label } from "@/components/ui/label";
import { photoPricing } from "@/constants/photoPricing";
import { PhotoIdType, getPhotoName } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { classNames } from "@/utils/style";
import { RadioGroup } from "@headlessui/react";
import { useState } from "react";

type ProductDetailsProps = {
  photoID: PhotoIdType;
};

const defaultPhotoSize = photoPricing[0];

export const ProductDetails: React.FC<ProductDetailsProps> = ({ photoID }) => {
  const [selectedSizeID, setSelectedSizeID] = useState(defaultPhotoSize.id);
  const selectedSize =
    photoPricing.find((pricing) => pricing.id === selectedSizeID) ??
    defaultPhotoSize;

  return (
    <div>
      <h3 className="break-words">{getPhotoName(photoID)}</h3>
      <h4 className="font-medium text-gray-800">${selectedSize.price}</h4>

      <Label className="mt-6">Choose a print size</Label>
      <RadioGroup
        value={selectedSizeID}
        onChange={setSelectedSizeID}
        className="mt-2"
      >
        <RadioGroup.Label className="sr-only">
          Choose a print size
        </RadioGroup.Label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
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
      <p className="caption mt-6">
        Don&apos;t see a size you&apos;re looking for? I do custom orders
        (panorama, three panels, etc.){" "}
        <CustomLink href={PAGES.CONTACT}>by request</CustomLink>.
      </p>
    </div>
  );
};
