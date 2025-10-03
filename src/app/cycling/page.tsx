import { Metadata } from "next";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PAGES } from "@/utils/pages";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";

export const metadata: Metadata = {
  title: "Cycling Rides | Kevin Hou",
};

const ToolsPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <h1 className="mb-4 text-center leading-loose">Cycling Routes</h1>
      <p>
        Some routes that I particularly enjoy and want to recommend to my
        friends!
      </p>
      <ul className="list-inside list-disc">
        <li>
          <CustomLink href={PAGES.CYCLING.NICE}>
            Nice to Monaco via Coté D&apos;Ezé
          </CustomLink>
        </li>
      </ul>
    </PageWrapper>
  );
};

export default ToolsPage;
