import { ContactForm } from "./ContactForm";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PaperTexture } from "@/components/atoms/PaperTexture/PaperTexture";
import { FadeInView } from "@/components/atoms/FadeInView/FadeInView";
import { ImageStory } from "@/components/organisms/ImageStory/ImageStory";
import { PAGES } from "@/utils/pages";
import { PhotoTags } from "@/constants/photoTags";
import { SocialLinks } from "@/components/molecules/SocialLinks/SocialLinks";
import { PhotographyCustomersGrid } from "@/components/organisms/PhotographyCustomersGrid/PhotographyCustomersGrid";
import { BioSection } from "@/components/organisms/BioSection/BioSection";

const ContactPage = () => {
  return (
    <>
      <PageWrapper maxWidth="none" className="max-w-5xl xl:max-w-6xl">
        <div className="relative w-full">
          <div aria-label="contact background" className="w-full">
            <div className="float-left aspect-square w-full sm:aspect-[3/2] md:aspect-[4/5] md:w-[60%] lg:w-[55%] xl:w-1/2">
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
            className="pointer-events-none relative flex w-full flex-col items-end justify-center py-4 sm:py-2 md:absolute md:left-0 md:top-0 md:z-10 md:h-full md:px-4 md:py-4"
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

      <BioSection
        className="mb-24 lg:mb-36 xl:mb-52"
        order={["photography", "programming", "woodworking"]}
      />
    </>
  );
};

export default ContactPage;
