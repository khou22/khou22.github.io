import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";
import { getTagsByPhotoID } from "@/data/photos/photoDbManager";
import { notFound } from "next/navigation";
import { PhotoManagementCard } from "@/components/molecules/PhotoManagementCard/PhotoManagementCard";

type PageProps = {
  params: {
    subdir: string;
  };
};

const PhotoAdminSubdirectoryPage: React.FC<PageProps> = async ({ params }) => {
  const photoIDs = getPhotoIDs().filter((id) => {
    return id.startsWith(`photography/${params.subdir}`);
  });
  if (photoIDs.length === 0) {
    notFound();
  }

  const tagsByPhotoID = await getTagsByPhotoID();

  return (
    <PageWrapper maxWidth="wide">
      <h1>Photos in {params.subdir}/</h1>
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

export default PhotoAdminSubdirectoryPage;
