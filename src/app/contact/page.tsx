import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { ContactForm } from "./ContactForm";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PaperTexture } from "@/components/atoms/PaperTexture/PaperTexture";
import { FadeInView } from "@/components/atoms/FadeInView/FadeInView";
import { ImageStory } from "@/components/organisms/ImageStory/ImageStory";
import { PAGES } from "@/utils/pages";
import { PhotoTags } from "@/constants/photoTags";
import { SocialLinks } from "@/components/molecules/SocialLinks/SocialLinks";
import { PhotographyCustomersGrid } from "@/components/organisms/PhotographyCustomersGrid/PhotographyCustomersGrid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";

const ContactPage = () => {
  return (
    <>
      <PageWrapper maxWidth="none" className="max-w-5xl xl:max-w-6xl">
        <div className="relative w-full">
          <div aria-label="contact background" className="w-full">
            <div className="float-left aspect-square w-full sm:aspect-[3/2] md:aspect-[4/5] md:w-1/2">
              <ImageStory
                autoForward
                storyDuration={3500}
                stories={[
                  {
                    title: "Food",
                    link: PAGES.PHOTOGRAPHY.TAG(PhotoTags.Food),
                    imageSrc: getCdnAsset(
                      "photography/Black_Sheep_Foods_Single_Burger_jpg",
                    ),
                  },
                  {
                    title: "Concert",
                    link: PAGES.PHOTOGRAPHY.TAG(PhotoTags.Concert),
                    imageSrc: getCdnAsset(
                      "photography/Mariposa_Sounds_Asher_Gevisser_jpg",
                    ),
                  },
                  {
                    title: "Landscape",
                    link: PAGES.PHOTOGRAPHY.TAG(PhotoTags.Landscape),
                    imageSrc: getCdnAsset("media/photography/mountains_jpg"),
                  },
                  {
                    title: "Engagements",
                    link: PAGES.PHOTOGRAPHY.TAG(PhotoTags.Engagements),
                    imageSrc: getCdnAsset(
                      "photography/David_and_Wenyi_Engagement_Sutro_Baths_jpg",
                    ),
                  },
                  {
                    title: "Events",
                    link: PAGES.PHOTOGRAPHY.TAG(PhotoTags.Events),
                    imageSrc: getCdnAsset("media/photography/korea_jpg"),
                  },
                  {
                    title: "Food",
                    link: PAGES.PHOTOGRAPHY.TAG(PhotoTags.Food),
                    imageSrc: getCdnAsset(
                      "photography/Black_Sheep_Foods_Table_of_Food_jpg",
                    ),
                  },
                ]}
                className="h-full w-full"
              />
            </div>
          </div>
          <div
            aria-label="foreground"
            className="pointer-events-none relative flex w-full flex-col items-end justify-center py-4 md:absolute md:left-0 md:top-0 md:z-10 md:h-full md:px-4 md:py-0"
          >
            <div className="pointer-events-auto relative float-right w-full overflow-hidden rounded p-6 shadow md:w-2/3">
              <div className="absolute left-0 top-0 -z-10 h-full w-full bg-white">
                <PaperTexture className="h-full w-full" />
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <p className="caption text-center">GET IN TOUCH</p>
                <h3 className="mb-3 mt-2 text-center">
                  Let&apos;s create together.
                </h3>
                <SocialLinks className="mb-3 space-x-4" />
                <p className="caption mb-2 max-w-lg text-center">
                  I am ready and available for hire in San Francisco and the
                  larger Bay Area. I have worked with clients & brands across
                  many industries for product, food, landscape, and event
                  photography as well as engagements, parties, and videography.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
      <PageWrapper>
        <div className="my-16 md:my-24 lg:my-36">
          <FadeInView once>
            <h5 className="mb-4 text-center leading-loose md:mb-6">
              Prior experience with brands including
            </h5>
          </FadeInView>
          <FadeInView once>
            <PhotographyCustomersGrid className="my-4" />
          </FadeInView>
          <FadeInView once>
            <p className="caption text-center">
              and many more across many industries
            </p>
          </FadeInView>
        </div>
      </PageWrapper>

      <div className="relative z-10 mb-24 w-full bg-gray-800 pb-20 sm:pb-24 lg:mb-36 xl:mb-52 xl:pb-0">
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
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-8 gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch">
            <div className="-mt-8 w-full max-w-2xl xl:-mb-8 xl:w-96 xl:flex-none">
              <div className="relative aspect-[5/3] h-full sm:aspect-[4/3] md:-mx-8 xl:mx-0 xl:aspect-auto">
                <FadeInView once>
                  <img
                    className="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
                    src={getCdnAsset(
                      "media/profile_pictures/Side_Outdoors_Portrait_jpg",
                    )}
                    alt=""
                  />
                </FadeInView>
              </div>
            </div>
            <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
              <figure className="relative isolate pt-6 sm:pt-12">
                <blockquote className="text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
                  <p>
                    I have been creating all my life both in the physical and in
                    the digital. I&apos;m always building something new whether
                    it be an app, a{" "}
                    <CustomLink href="https://codeium.com" target="_blank">
                      startup
                    </CustomLink>{" "}
                    feature, photo project, wood desk, or something entirely
                    different.
                  </p>
                </blockquote>
                <figcaption className="mt-8 text-base">
                  <div className="font-semibold text-white">Kevin Hou</div>
                  <div className="mt-1 text-gray-400">
                    Photographer, Engineering, Woodworker
                  </div>
                </figcaption>
                <FadeInView
                  delayMS={400}
                  className="mt-4 flex flex-row items-center justify-start space-x-2 lg:mt-8"
                >
                  <Link href={PAGES.PHOTOGRAPHY.CATEGORIES}>
                    <Button variant="secondary">Photo Portfolio</Button>
                  </Link>
                  <Link href={PAGES.PROGRAMMING}>
                    <Button
                      variant="link"
                      className="text-white/80 hover:text-white/100"
                    >
                      Programming
                    </Button>
                  </Link>
                  <Link href={PAGES.WOOD}>
                    <Button
                      variant="link"
                      className="text-white/80 hover:text-white/100"
                    >
                      Wood
                    </Button>
                  </Link>
                </FadeInView>
              </figure>
            </div>
          </div>
        </PageWrapper>
      </div>
    </>
  );
};

export default ContactPage;
