import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import path from "path";
import PhotoAlbum from "react-photo-album";
import { PhotoTags } from "@/constants/photoTags";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { imageSize } from "image-size";
import { _generatedCdnAssets } from "@/utils/cdn/cdnAssets.generated";

const PhotographyFeaturedPage = async () => {
  const photoIDs = await getPhotosWithTag(PhotoTags.Featured);

  // Get the sizes of the photos.
  const photos = await Promise.all(
    photoIDs.map(async (photoID) => {
      const url = getCdnAsset(photoID);

      const filePath = path.join(
        process.cwd(),
        "docs",
        decodeURIComponent(_generatedCdnAssets[photoID]),
      );
      const size = await imageSize(filePath);
      return {
        src: url,
        width: size.width ?? 1,
        height: size.height ?? 1,
      };
    }),
  );

  return (
    <PageWrapper maxWidth="wide">
      <h1>Featured</h1>

      <div className="my-12">
        {/* Mobile */}
        <div className="block md:hidden">
          <PhotoAlbum
            layout="masonry"
            columns={2}
            // Default container width is needed for SSR.
            defaultContainerWidth={450}
            photos={photos}
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <PhotoAlbum
            layout="masonry"
            columns={4}
            // Default container width is needed for SSR.
            defaultContainerWidth={800}
            photos={photos}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default PhotographyFeaturedPage;
