import { Metadata } from "next";
import { PhotoBlurTool } from "./PhotoBlurTool";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

export const metadata: Metadata = {
  title: "Photo Blur Tool | Kevin Hou",
};

const PhotoBlurPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <h1 className="mb-4 text-center leading-loose">Photo Blur Tool</h1>
      <PhotoBlurTool />
    </PageWrapper>
  );
};

export default PhotoBlurPage;
