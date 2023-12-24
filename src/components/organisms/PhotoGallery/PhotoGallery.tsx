import {
  PhotoIdType,
  getCdnAsset,
  getPhotoName,
  getPhotoThumbnail,
} from "@/utils/cdn/cdnAssets";
import { getPhotoSize } from "@/utils/photos/getPhotoSize";
import {
  PhotoGalleryClient,
  PhotoGalleryClientProps,
} from "./PhotoGalleryClient";

type PhotoGalleryProps = {
  photoIDs: PhotoIdType[];
} & Omit<PhotoGalleryClientProps, "photos">;

/**
 * Photo gallery component for displaying photos in a masonry layout. **Must be rendered in a
 * server-side component** as it needs access to the photo sizes on the disk.
 */
export const PhotoGallery = async ({
  photoIDs,
  ...galleryProps
}: PhotoGalleryProps) => {
  const photos = await Promise.all(
    photoIDs.map(async (photoID) => {
      const thumbnailID = getPhotoThumbnail(photoID);
      const fullSize = await getPhotoSize(photoID);
      const fullURL = getCdnAsset(photoID);
      const srcSet = [
        {
          src: fullURL,
          width: fullSize.width ?? 1,
          height: fullSize.height ?? 1,
        },
      ];

      let thumbnailURL: string | undefined;
      if (thumbnailID) {
        const thumbnailSize = await getPhotoSize(thumbnailID);
        thumbnailURL = getCdnAsset(thumbnailID);
        srcSet.push({
          src: thumbnailURL,
          width: thumbnailSize.width ?? 1,
          height: thumbnailSize.height ?? 1,
        });
      }

      return {
        src: thumbnailURL ?? fullURL,
        width: fullSize.width ?? 1,
        height: fullSize.height ?? 1,
        alt: getPhotoName(photoID),
        title: getPhotoName(photoID),
        photoID,
        srcSet,
      };
    }),
  );

  return (
    <div className="my-12 w-full">
      <PhotoGalleryClient photos={photos} {...galleryProps} />
    </div>
  );
};
