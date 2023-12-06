import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { woodProjects } from "@/constants/woodProjects";
import Image from "next/image";

const WoodPortfolioPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <h1 className="leading-loose">Wood</h1>
      <div className="grid grid-cols-3 gap-x-2 gap-y-6">
        {woodProjects.map(({ title, link, image }) => (
          <div key={title} className="col-span-1">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <div className="relative aspect-[3/2] w-full">
                <Image src={image} alt={title} fill className="object-cover" />
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
