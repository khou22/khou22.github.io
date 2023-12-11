import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoTags } from "@/constants/photoTags";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";

const PhotographyFeaturedPage = async () => {
  const photos = await getPhotosWithTag(PhotoTags.Featured);

  return (
    <PageWrapper>
      <h1>Featured</h1>

      <div className="grid grid-cols-4 gap-4">
        {photos.map((photo) => (
          <img
            src={getCdnAsset(photo)}
            key={photo}
            className="aspect-square h-full w-full object-contain"
            alt={photo}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default PhotographyFeaturedPage;
