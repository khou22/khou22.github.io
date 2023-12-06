import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { programmingProjects } from "@/constants/programmingProjects";
import Image from "next/image";

const ProgrammingPortfolioPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <div className="mb-8 w-full md:mb-12">
        <h1 className="m-auto text-center leading-loose">
          Programming Projects
        </h1>
        <p className="m-auto max-w-lg text-center">
          Side projects I have worked on over the years. I&apos;ve been
          programming since I was a kid and some of the code shows. Regardless,
          every project added something to my toolkit and continued to fuel my
          passion for building products.
        </p>
      </div>
      <div className="grid w-full grid-cols-3 gap-x-2 gap-y-6">
        {programmingProjects.map((project) => (
          <div key={project.name} className="col-span-1">
            <a href={project.slug} target="_blank" rel="noopener noreferrer">
              <div className="relative aspect-[3/2] w-full">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
              </div>
            </a>
            <p className="caption my-3 w-full text-center">{project.name}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default ProgrammingPortfolioPage;
