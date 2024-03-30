import Image from "next/image";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { DownloadLink } from "@/components/molecules/DownloadLink/DownloadLink";
import { siteMetadata } from "@/constants/siteMetadata";

export const metadata = {
  title: "Media Kit | Kevin Hou",
  description: `Kevin Hou's media resources. ${siteMetadata.description}`,
};

const MediaPage = () => {
  return (
    <PageWrapper className="flex flex-col items-center justify-center space-y-4">
      <div className="mb-4 w-full border-b border-gray-300 pb-4 text-center">
        <h1 className="leading-loose">Media</h1>
        <p>Useful media resources both for my own use and for others!</p>
      </div>
      <div className="grid w-full grid-cols-3 gap-4">
        <div className="my-12 space-y-1">
          <Image
            src={getCdnAsset("media/site/logo/initials_logo_svg")}
            alt="Kevin Hou Logo"
            width={100}
            height={100}
          />
          <DownloadLink
            fileName="kevin_hou_logo.svg"
            url={getCdnAsset("media/site/logo/initials_logo_png")}
          >
            kevin_hou_logo.svg
          </DownloadLink>
          <DownloadLink
            fileName="kevin_hou_logo"
            url={getCdnAsset("media/site/logo/initials_logo_png")}
          >
            kevin_hou_logo.png
          </DownloadLink>
        </div>
        <div className="my-12 space-y-1">
          <Image
            src={getCdnAsset("media/site/logo/initials_logo_animated_svg")}
            alt="Kevin Hou Logo Animated"
            width={100}
            height={100}
          />
          <DownloadLink
            fileName="kevin_hou_logo_animated.svg"
            url={getCdnAsset("media/site/logo/initials_logo_animated_svg")}
          >
            kevin_hou_logo_animated.svg
          </DownloadLink>
        </div>
      </div>
    </PageWrapper>
  );
};

export default MediaPage;
