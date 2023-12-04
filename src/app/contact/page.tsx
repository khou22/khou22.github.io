import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { ContactForm } from "./ContactForm";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PaperTexture } from "@/components/atoms/PaperTexture/PaperTexture";
import { photographyCustomers } from "@/constants/photographyCustomers";

const ContactPage = () => {
  return (
    <>
      <PageWrapper disableMaxWidth className="max-w-5xl xl:max-w-6xl">
        <div className="relative">
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
          <h5 className="mb-8 text-center leading-loose md:mb-12">
            I have worked and collaborated with some incredible brands
          </h5>
          <div className="grid grid-cols-3 gap-12 sm:grid-cols-4 md:grid-cols-5">
            {photographyCustomers.map(({ name, logo, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full w-full flex-col items-center justify-between"
              >
                <img
                  src={logo}
                  alt={name}
                  className="aspect-[3/2] w-full object-contain opacity-80 saturate-0 transition duration-200 group-hover:opacity-100 group-hover:saturate-100"
                />
                <p className="text-center opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
                  {name}
                </p>
              </a>
            ))}
          </div>
          <p className="caption text-center">
            and many more across many industries
          </p>
        </div>
      </PageWrapper>
    </>
  );
};

export default ContactPage;
