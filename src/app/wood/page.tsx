import { Metadata } from "next";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { woodProjects } from "@/constants/woodProjects";

export const metadata: Metadata = {
  title: "Wood Portfolio | Kevin Hou",
};

const WoodPortfolioPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <div className="mb-8 w-full md:mb-12">
        <h1 className="m-auto text-center leading-loose">Wood</h1>
        <p className="m-auto max-w-lg text-center">
          I&apos;ve been woodworking since I was in high school. Here are some
          of my favorite projects.
        </p>
      </div>
      <div className="grid w-full grid-cols-3 gap-x-2 gap-y-6">
        {woodProjects.map(({ title, link, image }, idx) => (
          <div key={title} className="col-span-1">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <div className="relative aspect-[3/2] w-full">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover"
                  fetchPriority={idx < 6 ? "high" : "low"}
                />
              </div>
            </a>
            <p className="caption my-3 w-full text-center">{title}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default WoodPortfolioPage;
