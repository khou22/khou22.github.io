import { PhotoManagementCard } from "@/components/molecules/PhotoManagementCard/PhotoManagementCard";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { getTagsByPhotoID } from "@/data/photos/photoDbManager";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { PhotoSearchForm } from "../../PhotoSearchForm";
import { getPhotoName, getPhotoPath } from "@/utils/cdn/cdnAssets";

type PageProps = {
  params: {
    query: string[];
  };
};

const PhotoSearchPage: NextPage<PageProps> = async ({ params }) => {
  const query = decodeURIComponent(params.query.join("/"));
  if (!query) {
    notFound();
  }

  const photoIDs = getPhotoIDs().filter((id) => {
    return (
      id.toLowerCase().includes(query.toLowerCase()) ||
      getPhotoName(id).toLowerCase().includes(query.toLowerCase())
    );
  });
  const tagsByPhotoID = photoIDs.length > 0 ? await getTagsByPhotoID() : {};

  return (
    <PageWrapper maxWidth="wide">
      <h1 className="leading-relaxed">Search Results</h1>
      <div className="my-4 w-full">
        <Label>Search for Photo</Label>
        <PhotoSearchForm initialValue={query} />
      </div>
      <p className="mb-2">Number of Photos: {photoIDs.length}</p>
      {photoIDs.length === 0 ? (
        <Alert variant="destructive" className="my-2">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error Searching Photo</AlertTitle>
          <AlertDescription>
            No results found for &quot;{query}&quot;
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {photoIDs.map((photoID) => (
            <PhotoManagementCard
              key={photoID}
              path={getPhotoPath(photoID)}
              imageKey={photoID}
              tagIDs={tagsByPhotoID[photoID] ?? []}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default PhotoSearchPage;
