import { PhotoIdType, getCdnAsset, getPhotoName } from "@/utils/cdn/cdnAssets";
import { getPhotoSize } from "@/utils/photos/getPhotoSize";
import { PhotoGalleryClient } from "./PhotoGalleryClient";

type PhotoGalleryProps = {
  photoIDs: PhotoIdType[];
};

/**
 * Photo gallery component for displaying photos in a masonry layout. **Must be rendered in a
 * server-side component** as it needs access to the photo sizes on the disk.
 */
export const PhotoGallery = async ({ photoIDs }: PhotoGalleryProps) => {
  const photos = await Promise.all(
    photoIDs.map(async (photoID) => {
      const url = getCdnAsset(photoID);
      const size = await getPhotoSize(photoID);
      return {
        src: url,
        width: size.width ?? 1,
        height: size.height ?? 1,
        alt: getPhotoName(photoID),
        title: getPhotoName(photoID),
        photoID,
      };
    }),
  );

  return (
    <div className="my-12 w-full">
      <PhotoGalleryClient photos={photos} />
    </div>
  );
};
