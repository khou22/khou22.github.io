import React from "react";
import { RadioGroup } from "@headlessui/react";
import { PhotoPriceVariant } from "@/constants/photoPricing";
import { classNames } from "@/utils/style";
import { Label } from "@/components/ui/label";

type VariantCategoryProps = {
  categoryName: string;
  priceVariants: PhotoPriceVariant[];
  orientation: "vertical" | "horizontal";
};

export const VariantCategory: React.FC<VariantCategoryProps> = ({
  categoryName,
  priceVariants,
  orientation,
}) => {
  return (
    <div className="my-3">
      <RadioGroup.Label className="sr-only">{categoryName}</RadioGroup.Label>
      <Label>{categoryName}</Label>
      <div className="mt-2 grid w-full grid-cols-4 gap-2 sm:grid-cols-5">
        {priceVariants.map((pricing) => (
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
                "flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium sm:flex-1",
              )
            }
            disabled={!pricing.inStock}
          >
            <RadioGroup.Label
              as="span"
              className="inline-flex flex-row items-center justify-center gap-0.5"
            >
              <span>
                {orientation === "horizontal"
                  ? pricing.heightInches
                  : pricing.widthInches}
              </span>
              <span>x</span>
              <span>
                {orientation === "horizontal"
                  ? pricing.widthInches
                  : pricing.heightInches}
              </span>
            </RadioGroup.Label>
          </RadioGroup.Option>
        ))}
      </div>
    </div>
  );
};
