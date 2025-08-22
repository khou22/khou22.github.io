import { Metadata } from "next";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PAGES } from "@/utils/pages";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";

export const metadata: Metadata = {
  title: "Personal Tools | Kevin Hou",
};

const ToolsPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <h1 className="mb-4 text-center leading-loose">Personal Tools</h1>
      <p>Some tools that I have built for personal use that you can use too.</p>
      <ul className="list-inside list-disc">
        <li>
          <CustomLink href={PAGES.TOOLS.PHOTO_BLUR}>Photo Blur Tool</CustomLink>
        </li>
        <li>
          <CustomLink href={PAGES.TOOLS.TWEET_PREVIEW}>
            Tweet Preview
          </CustomLink>
        </li>
        <li>
          <CustomLink href={PAGES.TOOLS.RGB_TO_OKLCH}>
            RGB to OKLCH Converter
          </CustomLink>
        </li>
        <li>
          <CustomLink href={PAGES.TOOLS.PASSWORD_GENERATOR}>
            Password Generator
          </CustomLink>
        </li>
      </ul>
    </PageWrapper>
  );
};

export default ToolsPage;
