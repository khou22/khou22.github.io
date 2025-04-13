import { Metadata } from "next";
import Link from "next/link";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { FadeInView } from "@/components/atoms/FadeInView/FadeInView";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { occupations } from "@/constants/occupations";
import { programmingProjects } from "@/constants/programmingProjects";
import { CDN_DOCUMENTS, PAGES } from "@/utils/pages";

export const metadata: Metadata = {
  title: "Programming Portfolio | Kevin Hou",
};

const ProgrammingPortfolioPage = () => {
  return (
    <>
      <h1 className="m-auto text-center leading-loose">Software</h1>
      <p className="w-full px-6 text-center">
        Building products since 2013. Computer Science B.S.E at Princeton
        University.
      </p>

      <PageWrapper
        maxWidth="wide"
        className="m-auto mb-12 mt-12 grid max-w-5xl grid-cols-1 gap-x-8 md:mb-8 md:grid-cols-12 md:gap-x-16"
      >
        <div className="col-span-1 md:col-span-5">
          <h2 className="mb-4 text-center md:text-left">Full Stack Engineer</h2>
          <p className="caption text-center md:text-left">
            While I work across a variety of roles, I&apos;m first and foremost
            a software engineer. I specialize in the intersection of AI and
            product, most recently working on generative AI dev tools and
            automous driving. I have many years of{" "}
            <CustomLink href={PAGES.DESIGN}>design</CustomLink> experience and
            have building projects end to end from ideation and design to
            implementation and production.
          </p>
        </div>
        <div className="col-span-1 mt-6 flex h-full w-full items-center justify-center md:col-span-7 md:mt-0">
          <div className="grid w-full grid-cols-3 gap-8">
            {occupations.map((occupation) => (
              <div
                key={occupation.company.name}
                className="relative aspect-[7/2] w-full scale-100 transition-transform duration-200 ease-in-out hover:scale-110"
              >
                <Link href={occupation.company.url} target="_blank">
                  <img
                    src={occupation.company.logo}
                    alt={occupation.company.name}
                    className="h-full w-full object-contain"
                  />
                </Link>
                <span className="sr-only">{occupation.company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </PageWrapper>
      <PageWrapper maxWidth="wide" className="mb-8 w-full md:mb-12">
        <h4 className="mb-2 mt-4 text-center md:text-left">Patents</h4>
        <p className="caption mb-2 text-center md:text-left">
          I have also authored a number of patents. Some of which have been
          officially granted, including:
        </p>
        <ul className="[&>li]:caption mx-auto max-w-sm list-decimal pl-4 md:mx-0 md:max-w-none">
          <li>
            Automatic Identification of Types of User Interface Components{" "}
            <CustomLink
              href={CDN_DOCUMENTS.DOCUMENTS.PATENTS[10761818]}
              target="_blank"
            >
              [10761818]
            </CustomLink>
          </li>
          <li>
            Automatic Grouping of User Interface Elements into Components{" "}
            <CustomLink
              href={CDN_DOCUMENTS.DOCUMENTS.PATENTS[10928982]}
              target="_blank"
            >
              [10928982]
            </CustomLink>
          </li>
          <li>
            Automatic Classification of User Interface Elements{" "}
            <CustomLink
              href={CDN_DOCUMENTS.DOCUMENTS.PATENTS[10949174]}
              target="_blank"
            >
              [10949174]
            </CustomLink>
          </li>
        </ul>
      </PageWrapper>
      <PageWrapper maxWidth="wide" className="mb-8 w-full md:mb-12">
        <h2 className="m-auto text-center leading-loose">
          Side (-ish) Projects
        </h2>
        <FadeInView className="m-auto">
          <p className="m-auto mb-6 max-w-lg text-center md:mb-12">
            Side projects and some fully released, revenue generating products I
            have worked on over the years.
          </p>
        </FadeInView>
        <div className="grid w-full grid-cols-2 gap-x-2 gap-y-6 sm:grid-cols-3">
          {programmingProjects.map((project) => (
            <div key={project.name} className="col-span-1">
              <a href={project.slug} target="_blank" rel="noopener noreferrer">
                <div className="relative aspect-[3/2] w-full">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </a>
              <p className="caption my-3 w-full text-center">{project.name}</p>
              <span className="sr-only">{project.description}</span>
            </div>
          ))}
        </div>
      </PageWrapper>
    </>
  );
};

export default ProgrammingPortfolioPage;
