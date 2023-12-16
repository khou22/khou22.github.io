import { PhotoManagementCard } from "@/components/molecules/PhotoManagementCard/PhotoManagementCard";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getTagsByPhotoID } from "@/data/photos/photoDbManager";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";
import { NextPage } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    query: string[];
  };
};

const PhotoSearchPage: NextPage<PageProps> = async ({ params }) => {
  const query = params.query.join("/");

  if (!query) {
    notFound();
  }

  const photoIDs = getPhotoIDs().filter((id) => {
    return id.includes(query);
  });
  if (photoIDs.length === 0) {
    notFound();
  }

  const tagsByPhotoID = await getTagsByPhotoID();

  return (
    <PageWrapper maxWidth="wide">
      <h1>Search Results/</h1>
      <h5>{query}</h5>
      <p>Number of Photos: {photoIDs.length}</p>
      <div className="grid grid-cols-1 gap-4">
        {photoIDs.map((photoID) => (
          <PhotoManagementCard
            key={photoID}
            imageKey={photoID}
            tagIDs={tagsByPhotoID[photoID] ?? []}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default PhotoSearchPage;
