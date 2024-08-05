import { SearchInput } from "../SearchInput";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getPhotoName } from "@/utils/cdn/cdnAssets";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { TagImageCard } from "@/components/organisms/TagImageCard/TagImageCard";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";

const SearchPage = async ({
  searchParams: { query },
}: {
  params: {};
  searchParams: { query: string };
}) => {
  const matchingTags: PhotoTags[] = Object.values(PhotoTags).filter((tag) => {
    return (
      tag.toLowerCase().includes(query.toLowerCase()) ||
      tagMetadata[tag].name.toLowerCase().includes(query.toLowerCase())
    );
  });
  const tagNodes = await Promise.all(
    matchingTags.map(async (tag) => <TagImageCard key={tag} photoTag={tag} />),
  );

  const photoIDs = getPhotoIDs().filter((id) => {
    return (
      id.toLowerCase().includes(query.toLowerCase()) ||
      getPhotoName(id).toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <PageWrapper maxWidth="wide">
      <SearchInput initialQuery={query} />

      {tagNodes.length > 0 && (
        <div className="my-6 w-full">
          <p>Did you mean?</p>
          <div className="my-2 grid w-full grid-cols-3 gap-4">{tagNodes}</div>
        </div>
      )}

      <div className="mt-6 md:mt-12">
        <p>
          Showing {photoIDs.length} results for &quot;{query}&quot;
        </p>
        <PhotoGallery photoIDs={photoIDs} fadeIn />
      </div>
    </PageWrapper>
  );
};

export default SearchPage;
