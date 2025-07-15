import { Metadata } from "next";
import { TweetPreview } from "./TweetPreview";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

export const metadata: Metadata = {
  title: "Tweet Preview | Kevin Hou",
};

const TweetPreviewPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <h1 className="mb-4 text-center leading-loose">Tweet Preview</h1>
      <TweetPreview />
    </PageWrapper>
  );
};

export default TweetPreviewPage;
