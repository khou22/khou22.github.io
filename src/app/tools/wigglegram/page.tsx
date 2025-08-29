import { Metadata } from "next";
import { WigglegramTool } from "./WigglegramTool";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

export const metadata: Metadata = {
  title: "Wigglegram Tool | Kevin Hou",
  description:
    "Create animated GIFs and videos from multi-frame images. Turn your wigglegram photos into dynamic animations.",
};

const WigglegramPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <h1 className="mb-4 text-center leading-loose">Wigglegram Tool</h1>
      <p className="mb-6 text-center text-gray-600">
        Transform multi-frame images into animated GIFs and videos. Upload your
        wigglegram photo and create dynamic animations with a 3D depth effect.
      </p>
      <WigglegramTool />
    </PageWrapper>
  );
};

export default WigglegramPage;
