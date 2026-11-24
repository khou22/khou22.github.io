"use client";

import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePostHog } from "posthog-js/react";
import { toast } from "sonner";
import { VariantSelector } from "./VariantSelector";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PhotoTagBadge } from "@/components/atoms/PhotoTagBadge/PhotoTagBadge";
import { InputWithCopy } from "@/components/molecules/InputWithCopy/InputWithCopy";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { photoPricing, PhotoPrintMaterial } from "@/constants/photoPricing";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { siteMetadata } from "@/constants/siteMetadata";
import { PhotoIdType, getPhotoName } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { getPrintProduct } from "@/utils/printProduct";
import { PhotoSize } from "@/utils/photos/getPhotoSize";
import { useCart } from "@/components/organisms/Cart/CartProvider";

type ProductDetailsProps = {
  photoID: PhotoIdType;
  tags: PhotoTags[];
  photoSize: PhotoSize;
};

const defaultPhotoSize = photoPricing[2];

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  photoID,
  tags,
  photoSize,
}) => {
  const posthog = usePostHog();
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedSizeID, setSelectedSizeID] = useState(defaultPhotoSize.id);
  const selectedSize =
    photoPricing.find((pricing) => pricing.id === selectedSizeID) ??
    defaultPhotoSize;

  const orientation =
    (photoSize.width ?? 0) > (photoSize.height ?? 0)
      ? "horizontal"
      : "vertical";

  const printProduct = getPrintProduct(photoID, selectedSize);
  return (
    <div className="flex flex-col items-start justify-start space-y-6">
      <div>
        <h3 className="break-words">{getPhotoName(photoID)}</h3>
        <h4 className="mt-2 font-medium text-gray-800">
          ${selectedSize.price}
        </h4>
        <p className="sr-only">{printProduct.description}</p>

        <div className="mt-2 flex flex-row flex-wrap items-center justify-start gap-1">
          {tags.map((tag) => (
            <PhotoTagBadge key={tag} photoTag={tag} />
          ))}
        </div>
      </div>

      <div className="w-full">
        <VariantSelector
          priceVariants={photoPricing}
          selectedVariant={selectedSize}
          onSelectVariantId={setSelectedSizeID}
          orientation={orientation}
        />
      </div>
      <Button
        variant="primary"
        className="w-full"
        onClick={() => {
          if (!addItem(photoID, selectedSize.id)) {
            toast.error(
              "Your cart is full. Check out or remove an item first.",
              {
                action: {
                  label: "View cart",
                  onClick: () => router.push(PAGES.PHOTOGRAPHY.CART),
                },
              },
            );
            return;
          }
          posthog.capture("add_to_cart", {
            product_name: printProduct.name,
            product_id: printProduct.id,
            product_price: printProduct.price,
          });
          toast.custom((id) => (
            <button
              type="button"
              onClick={() => {
                toast.dismiss(id);
                router.push(PAGES.PHOTOGRAPHY.CART);
              }}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-950 shadow-lg transition-colors hover:bg-slate-50"
            >
              <CheckCircledIcon className="h-5 w-5 shrink-0 text-slate-900" />
              <span>Added {printProduct.name} to cart</span>
            </button>
          ));
          router.push(PAGES.PHOTOGRAPHY.CART);
        }}
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
        {selectedSize.material === PhotoPrintMaterial.GlossyMetal ? (
          <ul className="[&>li]:caption list-inside list-disc">
            <li>Modern metal with durable print</li>
            <li>Glossy with white base (extra shine)</li>
            <li>Float mount for optional, elevated hanging</li>
          </ul>
        ) : (
          <ul className="[&>li]:caption list-inside list-disc">
            <li>Fujicolor Crystal Archive Type II</li>
            <li>Fujicolor Crystal Archive resin-based paper</li>
            <li>Fade-resistant, high dynamic range</li>
          </ul>
        )}
      </div>
    </div>
  );
};
