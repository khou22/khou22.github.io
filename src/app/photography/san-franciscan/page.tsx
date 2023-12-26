import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import Image from "next/image";
import Link from "next/link";

const SanFranciscanFeaturePage = () => {
  return (
    <PageWrapper>
      <Link href="https://thesanfranciscanmagazine.com" target="_blank">
        <Image
          alt="San Franciscan"
          src={getCdnAsset("media/photography/customers/san_franciscan_png")}
          width={400}
          height={200}
          className="object-cover"
        />
      </Link>
      <p>Work featured in Winter 2022 Edition</p>
      <div className="my-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="relative col-span-full aspect-[4/5] w-full">
          <Image
            src={getCdnAsset(
              "media/photography/san_franciscan/article_page_jpg",
            )}
            alt="San Franciscan satellite photo article page"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative col-span-1 aspect-[4/5]">
          <Image
            src={getCdnAsset(
              "media/photography/san_franciscan/magazine_cover_jpg",
            )}
            alt="San Franciscan magazine cover Winter 2022"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative col-span-1 aspect-[4/5]">
          <Image
            src={getCdnAsset("media/photography/san_franciscan/author_bio_jpg")}
            alt="San Franciscan Kevin Hou author bio"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default SanFranciscanFeaturePage;
