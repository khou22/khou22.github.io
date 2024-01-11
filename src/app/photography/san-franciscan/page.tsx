import Link from "next/link";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";

const SanFranciscanFeaturePage = () => {
  return (
    <PageWrapper>
      <Link href="https://thesanfranciscanmagazine.com" target="_blank">
        <img
          alt="San Franciscan"
          src={getCdnAsset("media/photography/customers/san_franciscan_png")}
          width={400}
          height={200}
          className="object-cover"
        />
      </Link>
      <p>
        My work was featured in the Winter 2022 Edition of the local San
        Franciscan magezine. My satellite photo was used with permission and it
        was a great time workign with their team.
      </p>
      <div className="my-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="relative col-span-full aspect-[4/5] w-full">
          <img
            src={getCdnAsset(
              "media/photography/san_franciscan/article_page_jpg",
            )}
            alt="San Franciscan satellite photo article page"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative col-span-1 aspect-[4/5]">
          <img
            src={getCdnAsset(
              "media/photography/san_franciscan/magazine_cover_jpg",
            )}
            alt="San Franciscan magazine cover Winter 2022"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative col-span-1 aspect-[4/5]">
          <img
            src={getCdnAsset("media/photography/san_franciscan/author_bio_jpg")}
            alt="San Franciscan Kevin Hou author bio"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default SanFranciscanFeaturePage;
