import { PhotoIdType, getCdnAsset, getPhotoName } from "@/utils/cdn/cdnAssets";
import { getPhotoSize } from "@/utils/photos/getPhotoSize";
import PhotoAlbum from "react-photo-album";

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
      };
    }),
  );

  return (
    <div className="my-12 w-full">
      {/* Mobile */}
      <div className="block w-full md:hidden">
        <PhotoAlbum
          layout="masonry"
          columns={2}
          // Default container width is needed for SSR.
          defaultContainerWidth={450}
          photos={photos}
        />
      </div>

      {/* Desktop */}
      <div className="hidden w-full md:block">
        <PhotoAlbum
          layout="masonry"
          columns={4}
          // Default container width is needed for SSR.
          defaultContainerWidth={800}
          photos={photos}
        />
      </div>
    </div>
  );
};
