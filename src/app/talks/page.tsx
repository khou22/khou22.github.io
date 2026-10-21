import { Metadata } from "next";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { TalksGrid } from "@/components/organisms/TalksGrid/TalksGrid";
import { talks } from "@/constants/talks";
import { siteMetadata } from "@/constants/siteMetadata";

export const metadata: Metadata = {
  title: "Talks | Kevin Hou",
  description: `Talks, podcasts, and presentations by Kevin Hou on Codeium, Windsurf, and Google Antigravity. ${siteMetadata.description}`,
};

const TalksPage = () => {
  return (
    <PageWrapper maxWidth="wide" className="mb-12">
      <div className="mb-8 w-full border-b border-gray-200 pb-6 text-center">
        <h1 className="leading-loose">Talks</h1>
        <p className="mx-auto max-w-2xl">
          Conference talks, podcasts, and product presentations on AI-powered
          developer tools &mdash; from Codeium to Windsurf to Google
          Antigravity.
        </p>
      </div>
      <TalksGrid talks={talks} />
    </PageWrapper>
  );
};

export default TalksPage;
