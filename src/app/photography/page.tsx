import { FullCoverArticle } from "@/components/organisms/MagazineLayout/FullCoverArticle";
import { HalfTextArticle } from "@/components/organisms/MagazineLayout/HalfTextArticle";
import { MagazineLayout } from "@/components/organisms/MagazineLayout/MagazineLayout";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import Image from "next/image";
import Link from "next/link";

const PhotographyHomepage = async () => {
  return (
    <PageWrapper maxWidth="none">
      <MagazineLayout>
        <FullCoverArticle
          href={PAGES.PHOTOGRAPHY.AERIAL}
          title="San Francisco by Air"
          category="Collection"
          description="An aerial photo series of San Francisco."
          width={2}
          imageSrc={getCdnAsset(
            "photography/Embarcadero_Aerial_View_at_Sunset_jpg",
          )}
        />
        <HalfTextArticle
          href={PAGES.PHOTOGRAPHY.FEATURED}
          title="Astrophotography"
          category="Collection"
          description="Undoutedly one of my favorite and most technically complex forms of photography"
          imageSrc={getCdnAsset(
            "photography/Pigeon_Point_Lighthouse_Milky_Way_jpg",
          )}
        />
        <FullCoverArticle
          href={PAGES.PHOTOGRAPHY.AERIAL}
          title="Tokyo, Japan"
          category="Travel"
          description="Capturing the beauties of Japan."
          width={1}
          imageSrc={getCdnAsset("media/store/Hie_Shrine_Tokyo_Japan_jpg")}
        />

        <FullCoverArticle
          href={PAGES.PHOTOGRAPHY.AERIAL}
          title="Satellite Photos"
          category="Collection"
          description="Partnered with satellite providers to capture the beauty of the world from space."
          width={1}
          imageSrc={getCdnAsset(
            "photography/San_Francisco_Golden_Gate_Park_Satellite_Shot_jpg",
          )}
        />
        <FullCoverArticle
          href={PAGES.PHOTOGRAPHY.FEATURED}
          title="Featured Works"
          category="Prints"
          description="A mixture of fan favorites and personal favorites."
          width={2}
          imageSrc={getCdnAsset("photography/Yosemite_Valley_Sunset_jpg")}
        />
        <FullCoverArticle
          href={PAGES.PHOTOGRAPHY.AERIAL}
          title="Bird's Eye View"
          category="Collection"
          description="See the world from the top down."
          width={1}
          imageSrc={getCdnAsset(
            "photography/Ping_Shek_Estate_Drone_Top_Down_Vertical_jpg",
          )}
        />

        <FullCoverArticle
          href={PAGES.PHOTOGRAPHY.FEATURED}
          title="Landscapes"
          category="Prints"
          description="Images from all around the world."
          width={2}
          imageSrc={getCdnAsset("photography/Grand_Teton_Bison_Landscape_jpg")}
        />
        <HalfTextArticle
          href={PAGES.PHOTOGRAPHY.AERIAL}
          title="Street Photography"
          category="Collection"
          description="Urban and city photography. Capturing everyday life."
          imageSrc={getCdnAsset(
            "photography/Tokyo_Soba_Noodles_NIght_Market_Chef_jpg",
          )}
        />
        <FullCoverArticle
          href={PAGES.PHOTOGRAPHY.AERIAL}
          title="Greece"
          category="Travel"
          description="Solo travel adventures."
          width={1}
          imageSrc={getCdnAsset(
            "photography/Meteora_Monastery_Perched_at_Sunset_jpg",
          )}
        />
      </MagazineLayout>
    </PageWrapper>
  );
};

export default PhotographyHomepage;
