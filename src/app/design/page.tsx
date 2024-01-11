import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { designProjects } from "@/constants/designProjects";

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
      <div className="grid w-full grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 md:gap-y-12">
        {designProjects.map(({ title, slug, image, description }, idx) => {
          const isExternal = slug?.startsWith("http");
          return (
            <div key={title} className="col-span-1">
              <a href={slug} target={isExternal ? "_blank" : undefined}>
                <div className="relative aspect-[3/2] w-full">
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                    fetchPriority={idx < 6 ? "high" : "low"}
                  />
                </div>
              </a>
              <p className="my-3 w-full text-center font-bold">{title}</p>
              <p className="caption w-full text-center">{description}</p>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
};

export default DeisgnPortfolioPage;
