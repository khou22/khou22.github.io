import Link from "next/link";

import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { FadeInView } from "@/components/atoms/FadeInView/FadeInView";
import { Button } from "@/components/ui/button";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { classNames } from "@/utils/style";

import { PageWrapper } from "../PageWrapper/PageWrapper";

type PortfolioType = "programming" | "photography" | "woodworking";

type BioSectionProps = {
  className?: string;
  order?: PortfolioType[];
};

export const BioSection: React.FC<BioSectionProps> = ({
  className = "",
  order = ["programming", "photography", "woodworking"],
}) => {
  return (
    <div
      className={classNames(
        "relative w-full bg-gray-800 pb-20 sm:pb-24 xl:pb-0",
        className,
      )}
    >
      <PageWrapper maxWidth="wide">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-[calc(50%-19rem)] top-[calc(50%-36rem)] transform-gpu blur-3xl">
            <div
              className="aspect-[1097/1023] w-[68.5625rem] bg-gradient-to-r from-[#ff8d46] to-[#6fc5ff] opacity-25"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
        <div className="mx-auto flex max-w-full flex-col items-center gap-x-8 gap-y-10 px-6 sm:max-w-7xl sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch">
          <div className="-mt-8 w-full max-w-2xl xl:-mb-8 xl:w-96 xl:flex-none">
            <div className="relative aspect-[5/3] h-full sm:aspect-[4/3] md:-mx-8 xl:mx-0 xl:aspect-auto">
              <FadeInView once>
                <img
                  className="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
                  src={getCdnAsset(
                    "media/profile_pictures/Side_Outdoors_Portrait_jpg",
                  )}
                  alt="Kevin Hou (photographer, engineer, woodworker) portrait"
                />
              </FadeInView>
            </div>
          </div>
          <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
            <figure className="relative isolate pt-6 sm:pt-12">
              <blockquote className="text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
                <p>
                  I have been creating all my life both in the physical and in
                  the digital. I&apos;m always building something new whether it
                  be an app, a{" "}
                  <CustomLink href="https://codeium.com" target="_blank">
                    startup
                  </CustomLink>{" "}
                  feature, photo project, wood desk, or something entirely
                  different.
                </p>
                <span className="sr-only">
                  Kevin Hou is an engineer at Codeium — an AI developer tools
                  startup in Mountain View, California.
                </span>
              </blockquote>
              <figcaption className="mt-8 text-base">
                <div className="font-semibold text-white">Kevin Hou</div>
                <div className="mt-1 text-gray-400">
                  {order
                    .map((item) => {
                      switch (item) {
                        case "programming":
                          return "Engineer";
                        case "photography":
                          return "Photographer";
                        case "woodworking":
                          return "Woodworker";
                      }
                    })
                    .join(", ")}
                </div>
              </figcaption>
              <FadeInView
                delayMS={400}
                className="mt-4 flex flex-row items-center justify-start space-x-2 lg:mt-8"
              >
                {order.map((item, idx) => {
                  let label = "";
                  let link = "";
                  switch (item) {
                    case "programming":
                      label = "Programming";
                      link = PAGES.PROGRAMMING;
                      break;
                    case "photography":
                      label = "Photo Portfolio";
                      link = PAGES.PHOTOGRAPHY.HOME;
                      break;
                    case "woodworking":
                      label = "Wood";
                      link = PAGES.WOOD;
                      break;
                  }

                  if (idx === 0) {
                    return (
                      <Link href={link} key={item}>
                        <Button variant="secondary">{label}</Button>
                      </Link>
                    );
                  }
                  return (
                    <Link href={link} key={item}>
                      <Button
                        variant="link"
                        className="text-white/80 hover:text-white/100"
                      >
                        {label}
                      </Button>
                    </Link>
                  );
                })}
              </FadeInView>
            </figure>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};
