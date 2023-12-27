import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { designProjects } from "@/constants/designProjects";
import { woodProjects } from "@/constants/woodProjects";
import Image from "next/image";

const DeisgnPortfolioPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <div className="mb-8 w-full md:mb-12">
        <h1 className="m-auto text-center leading-loose">Design</h1>
        <p className="m-auto max-w-lg text-center">
          Design is a skill I have been working on since high school to varying
          degrees. It enables me to think creatively about products and
          solutions before building them. My projects are all self-designed and
          implemented.
        </p>
      </div>
      <div className="grid w-full grid-cols-3 gap-x-2 gap-y-6">
        {designProjects.map(({ title, slug, image }, idx) => {
          const isExternal = slug?.startsWith("http");
          return (
            <div key={title} className="col-span-1">
              <a href={slug} target={isExternal ? "_blank" : undefined}>
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    priority={idx < 6}
                  />
                </div>
              </a>
              <p className="caption my-3 w-full text-center">{title}</p>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
};

export default DeisgnPortfolioPage;
