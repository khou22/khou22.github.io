"use client";

import { RadioGroup } from "@headlessui/react";
import { useState } from "react";
import { groupBy } from "lodash";
import { VariantCategory } from "./VariantCategory";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PhotoTagBadge } from "@/components/atoms/PhotoTagBadge/PhotoTagBadge";
import { InputWithCopy } from "@/components/molecules/InputWithCopy/InputWithCopy";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  PhotoPriceVariant,
  photoPricing,
  PhotoPrintMaterial,
} from "@/constants/photoPricing";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { siteMetadata } from "@/constants/siteMetadata";
import { PhotoIdType, getPhotoName } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { getSnipcartProduct } from "@/utils/snipcart";
import { PhotoSize } from "@/utils/photos/getPhotoSize";

type ProductDetailsProps = {
  photoID: PhotoIdType;
  tags: PhotoTags[];
  photoSize: PhotoSize;
};

const defaultPhotoSize = photoPricing[1];

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  photoID,
  tags,
  photoSize,
}) => {
  const [selectedSizeID, setSelectedSizeID] = useState(defaultPhotoSize.id);
  const selectedSize =
    photoPricing.find((pricing) => pricing.id === selectedSizeID) ??
    defaultPhotoSize;

  const pricingByMaterial = groupBy(
    photoPricing,
    (pricing) => pricing.material,
  ) as Record<PhotoPrintMaterial, PhotoPriceVariant[]>;
  const orientation =
    (photoSize.width ?? 0) > (photoSize.height ?? 0)
      ? "horizontal"
      : "vertical";

  const snipcartProduct = getSnipcartProduct(photoID, selectedSize);
  return (
    <div className="flex flex-col items-start justify-start space-y-6">
      <div>
        <h3 className="break-words">{getPhotoName(photoID)}</h3>
        <h4 className="mt-2 font-medium text-gray-800">
          ${selectedSize.price}
        </h4>
        <p className="sr-only">{snipcartProduct.description}</p>

        <div className="mt-2 flex flex-row flex-wrap items-center justify-start gap-1">
          {tags.map((tag) => (
            <PhotoTagBadge key={tag} photoTag={tag} />
          ))}
        </div>
      </div>

      <div className="w-full">
        <RadioGroup
          value={selectedSizeID}
          onChange={setSelectedSizeID}
          className="mt-2"
        >
          <VariantCategory
            categoryName="Photo Print"
            priceVariants={pricingByMaterial[PhotoPrintMaterial.PhotoPaper]}
            orientation={orientation}
          />
          <VariantCategory
            categoryName="Glossy Metal"
            priceVariants={pricingByMaterial[PhotoPrintMaterial.GlossyMetal]}
            orientation={orientation}
          />
        </RadioGroup>
      </div>
      <Button
        variant="primary"
        className="snipcart-add-item w-full"
        data-item-id={snipcartProduct.id}
        data-item-name={snipcartProduct.name}
        data-item-price={snipcartProduct.price}
        data-item-url={snipcartProduct.url}
        data-item-image={snipcartProduct.image}
      >
        Add to cart
      </Button>
      <div>
        <Label>Description</Label>
        <p className="caption mb-4">
          Introducing my premium collection of high-quality photo prints,
          meticulously captured and curated to perfection. Each print is a true
          work of art, showcasing stunning landscapes, captivating portraits,
          and mesmerizing moments frozen in time. Elevate your space and immerse
          yourself in the beauty of these curated masterpieces.
        </p>

        <Label>Custom Sizes</Label>
        <p className="caption mb-4">
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
        <p className="caption mb-2">
          Prints are produced by my printing partner to the highest standards,
          ensuring vibrant colors and exquisite details:
        </p>
        <ul className="[&>li]:caption list-inside list-disc">
          <li>Fujicolor Crystal Archive Type II</li>
          <li>Fujicolor Crystal Archive resin-based paper</li>
          <li>Fade-resistant, high dynamic range</li>
        </ul>
      </div>
    </div>
  );
};
