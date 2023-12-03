import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { ContactForm } from "./ContactForm";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";

const ContactPage = () => {
  return (
    <PageWrapper>
      <div aria-label="contact background" className="absolute -z-10 w-full">
        <div className="float-left aspect-[4/5] w-1/2">
          <img
            src={getCdnAsset("media/photography/city_jpg")}
            alt="contact background"
            className="h-full w-full object-fill"
          />
        </div>
      </div>
      <div aria-label="foreground" className="min-h-screen w-full">
        <div className="float-right w-2/3">
          <ContactForm />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ContactPage;
