import React from "react";
import { RadioGroup } from "@headlessui/react";
import { PhotoPriceVariant } from "@/constants/photoPricing";
import { classNames } from "@/utils/style";

type VariantSelectorProps = {
  priceVariants: PhotoPriceVariant[];
  selectedVariant: PhotoPriceVariant;
  orientation: "vertical" | "horizontal";
};

const formatDimensions = (
  variant: PhotoPriceVariant,
  orientation: "vertical" | "horizontal",
) => {
  const first =
    orientation === "horizontal" ? variant.heightInches : variant.widthInches;
  const second =
    orientation === "horizontal" ? variant.widthInches : variant.heightInches;
  return `${first} × ${second}"`;
};

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  priceVariants,
  selectedVariant,
  orientation,
}) => {
  return (
    <div className="my-2">
      <RadioGroup.Label className="block text-sm text-gray-600">
        Print:{" "}
        <span className="font-semibold text-gray-900">
          {formatDimensions(selectedVariant, orientation)} ·{" "}
          {selectedVariant.material}
        </span>
      </RadioGroup.Label>

      <div className="mt-2.5 grid w-full grid-cols-2 gap-2.5 sm:grid-cols-3">
        {priceVariants.map((pricing) => (
          <RadioGroup.Option
            key={pricing.id}
            value={pricing.id}
            disabled={!pricing.inStock}
            className={({ active, checked }) =>
              classNames(
                pricing.inStock
                  ? "cursor-pointer focus:outline-none"
                  : "cursor-not-allowed opacity-40",
                checked
                  ? "border-blue-500 ring-2 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400",
                active && !checked ? "ring-2 ring-blue-500/50" : "",
                "flex flex-col overflow-hidden rounded-lg border bg-white text-left transition-colors",
              )
            }
          >
            {({ checked }) => (
              <>
                <div
                  className={classNames(
                    checked ? "bg-blue-50/70" : "bg-gray-50/70",
                    "px-3 py-2",
                  )}
                >
                  <RadioGroup.Label
                    as="div"
                    className="text-sm font-semibold text-gray-900"
                  >
                    {formatDimensions(pricing, orientation)}
                  </RadioGroup.Label>
                  <RadioGroup.Description
                    as="div"
                    className="mt-0.5 text-xs text-gray-600"
                  >
                    {pricing.material}
                  </RadioGroup.Description>
                </div>
                <div className="border-t border-gray-200 bg-white px-3 py-1.5">
                  <div className="text-sm font-semibold text-gray-900">
                    ${pricing.price}
                  </div>
                </div>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </div>
  );
};
