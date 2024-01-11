import Link from "next/link";
import {
  ProgressiveImage,
  ProgressiveImageProps,
} from "../ProgressiveImage/ProgressiveImage";
import { PhotoIdType, getPhotoName, isPhotoID } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { getPhotoProgressiveImages } from "@/utils/photos/getPhotoProgressiveImages";
import { classNames } from "@/utils/style";

type HoverAnimationType = "scale" | "off";

type PhotoImageProps = {
  photoID: PhotoIdType;
  isLink?: boolean;
  hoverAnimation?: HoverAnimationType;
} & Omit<ProgressiveImageProps, "src">;

/**
 * Renders an image of a photo and applies some of the metadata and progressive image loading.
 */
export const PhotoImage: React.FC<PhotoImageProps> = ({
  photoID,
  isLink = false,
  hoverAnimation = "off",
  className,
  ...props
}) => {
  if (!isPhotoID(photoID)) {
    console.warn(`Invalid photoID: ${photoID}`);
  }

  const alt = props.alt ?? getPhotoName(photoID);

  const imgNode = (
    <ProgressiveImage
      {...props}
      alt={alt}
      src={getPhotoProgressiveImages(photoID)}
      className={classNames(
        className,
        hoverAnimation === "scale" &&
          "origin-center transition-transform duration-300 ease-in-out hover:scale-105",
      )}
    />
  );

  if (isLink) {
    return (
      <Link href={PAGES.PHOTOGRAPHY.PHOTO(photoID)} title={alt}>
        {imgNode}
      </Link>
    );
  }

  return imgNode;
};
