import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { ContactForm } from "./ContactForm";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PaperTexture } from "@/components/atoms/PaperTexture/PaperTexture";

const ContactPage = () => {
  return (
    <PageWrapper disableMaxWidth className="relative max-w-5xl xl:max-w-6xl">
      <div aria-label="contact background">
        <div className="float-left aspect-[4/5] w-1/2">
          <img
            src={getCdnAsset("media/photography/city_jpg")}
            alt="contact background"
            className="h-full w-full object-fill"
          />
        </div>
      </div>
      <div
        aria-label="foreground"
        className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-end justify-center px-8"
      >
        <div className="relative float-right w-2/3 overflow-hidden rounded p-6 shadow">
          <div className="absolute left-0 top-0 -z-10 h-full w-full bg-white">
            <PaperTexture className="h-full w-full" />
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <p className="caption text-center">GET IN TOUCH</p>
            <h3 className="text-center leading-loose">
              Let&apos;s create together.
            </h3>
            <p className="caption mb-2 max-w-lg text-center">
              I am ready and available for hire in San Francisco and the larger
              Bay Area. I have worked with clients & brands across many
              industries for product, food, landscape, and event photography as
              well as engagements, parties, and videography.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ContactPage;
