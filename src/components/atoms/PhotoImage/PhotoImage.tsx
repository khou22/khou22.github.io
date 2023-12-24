import {
  PhotoIdType,
  getCdnAsset,
  getPhotoName,
  getPhotoThumbnail,
  isPhotoID,
} from "@/utils/cdn/cdnAssets";
import {
  ProgressiveImage,
  ProgressiveImageProps,
} from "../ProgressiveImage/ProgressiveImage";
import Link from "next/link";
import { PAGES } from "@/utils/pages";
import { getPhotoProgressiveImages } from "@/utils/photos/getPhotoProgressiveImages";

type PhotoImageProps = {
  photoID: PhotoIdType;
  isLink?: boolean;
} & Omit<ProgressiveImageProps, "src">;

/**
 * Renders an image of a photo and applies some of the metadata and progressive image loading.
 */
export const PhotoImage: React.FC<PhotoImageProps> = ({
  photoID,
  isLink = false,
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
