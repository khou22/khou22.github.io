import React from "react";
import { RadioGroup } from "@headlessui/react";
import {
  PhotoPriceVariant,
  PhotoPrintMaterial,
} from "@/constants/photoPricing";
import { classNames } from "@/utils/style";

type VariantSelectorProps = {
  priceVariants: PhotoPriceVariant[];
  selectedVariant: PhotoPriceVariant;
  onSelectVariantId: (variantId: string) => void;
  orientation: "vertical" | "horizontal";
};

const MATERIAL_OPTIONS: {
  material: PhotoPrintMaterial;
  subtitle: string;
}[] = [
  {
    material: PhotoPrintMaterial.PhotoPaper,
    subtitle: "Archival Fujicolor paper",
  },
  {
    material: PhotoPrintMaterial.GlossyMetal,
    subtitle: "Vibrant gloss aluminum",
  },
];

const formatDimensions = (
  variant: PhotoPriceVariant,
  orientation: "vertical" | "horizontal",
  compact = false,
) => {
  const first =
    orientation === "horizontal" ? variant.heightInches : variant.widthInches;
  const second =
    orientation === "horizontal" ? variant.widthInches : variant.heightInches;
  return compact ? `${first}×${second}"` : `${first} × ${second}"`;
};

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  priceVariants,
  selectedVariant,
  onSelectVariantId,
  orientation,
}) => {
  const selectedMaterial = selectedVariant.material;
  const sizesForMaterial = priceVariants.filter(
    (v) => v.material === selectedMaterial,
  );

  const handleMaterialChange = (nextMaterial: PhotoPrintMaterial) => {
    const candidates = priceVariants.filter(
      (v) => v.material === nextMaterial && v.inStock,
    );
    if (candidates.length === 0) return;

    // Keep the same physical dimensions if available in the new material.
    const sameDimensions = candidates.find(
      (v) =>
        v.widthInches === selectedVariant.widthInches &&
        v.heightInches === selectedVariant.heightInches,
    );
    const defaultPaper = candidates.find((v) => v.id === "11x14-photo-paper");
    onSelectVariantId((sameDimensions ?? defaultPaper ?? candidates[0]).id);
  };

  return (
    <div className="w-full space-y-5">
      {/* Step 1: Material */}
      <RadioGroup value={selectedMaterial} onChange={handleMaterialChange}>
        <RadioGroup.Label className="flex items-center gap-2 text-sm text-gray-600">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
            1
          </span>
          <span>
            Material:{" "}
            <span className="font-semibold text-gray-900">
              {selectedMaterial}
            </span>
          </span>
        </RadioGroup.Label>

        <div className="mt-2.5 grid w-full grid-cols-2 gap-2.5">
          {MATERIAL_OPTIONS.map(({ material, subtitle }) => {
            const variants = priceVariants.filter(
              (v) => v.material === material && v.inStock,
            );
            const inStock = variants.length > 0;
            const minPrice = inStock
              ? Math.min(...variants.map((v) => v.price))
              : null;

            return (
              <RadioGroup.Option
                key={material}
                value={material}
                disabled={!inStock}
                className={({ active, checked }) =>
                  classNames(
                    inStock
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
                        {material}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="div"
                        className="mt-0.5 text-xs text-gray-600"
                      >
                        {subtitle}
                      </RadioGroup.Description>
                    </div>
                    {minPrice !== null && (
                      <div className="border-t border-gray-200 bg-white px-3 py-1.5">
                        <div className="text-xs font-medium text-gray-700">
                          From{" "}
                          <span className="text-sm font-semibold text-gray-900">
                            ${minPrice}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </RadioGroup.Option>
            );
          })}
        </div>
      </RadioGroup>

      {/* Step 2: Size */}
      <RadioGroup value={selectedVariant.id} onChange={onSelectVariantId}>
        <RadioGroup.Label className="flex items-center gap-2 text-sm text-gray-600">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
            2
          </span>
          <span>
            Size:{" "}
            <span className="font-semibold text-gray-900">
              {formatDimensions(selectedVariant, orientation)}
            </span>
          </span>
        </RadioGroup.Label>

        <div className="mt-2.5 grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4">
          {sizesForMaterial.map((pricing) => (
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
                      "px-2.5 py-2",
                    )}
                  >
                    <RadioGroup.Label
                      as="div"
                      className="whitespace-nowrap text-sm font-semibold text-gray-900"
                    >
                      {formatDimensions(pricing, orientation, true)}
                    </RadioGroup.Label>
                  </div>
                  <div className="border-t border-gray-200 bg-white px-2.5 py-1.5">
                    <div className="whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${pricing.price}
                    </div>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};
