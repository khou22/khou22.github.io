import { Metadata } from "next";
import { BoundingBoxClient } from "./BoundingBoxClient";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getStorePhotoIDs } from "@/utils/photos/getStorePhotoIDs";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";

export const metadata: Metadata = {
  title: "Bounding Box Tool | Kevin Hou",
};

const BoundingBoxPage = () => {
  const ids = getStorePhotoIDs();
  const randomID = ids[Math.floor(Math.random() * ids.length)];
  const imageUrl = getCdnAsset(randomID);
  return (
    <PageWrapper maxWidth="wide">
      <h1 className="mb-4 text-center leading-loose">Bounding Box Tool</h1>
      <BoundingBoxClient imageUrl={imageUrl} />
    </PageWrapper>
  );
};

export default BoundingBoxPage;
