import { Metadata } from "next";
import { Autoscroll } from "@/components/atoms/Autoscroll/Autoscroll";
import { FullCoverArticle } from "@/components/organisms/MagazineLayout/FullCoverArticle";
import { HalfTextArticle } from "@/components/organisms/MagazineLayout/HalfTextArticle";
import { MagazineLayout } from "@/components/organisms/MagazineLayout/MagazineLayout";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { TagImageCard } from "@/components/organisms/TagImageCard/TagImageCard";
import {
  PhotoTags,
  allCategoryTags,
  allLocationTags,
} from "@/constants/photoTags/photoTags";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";

const fadeAnimationDeltaMS = 130;

export const metadata: Metadata = {
  title: "Kevin Hou Photography",
  description:
    "Kevin Hou is a freelance photographer in San Francisco and the surrounding Bay Area specializing in drone, landscape, product, portrait, and event photography.",
};

const PhotographyHomepage = async () => {
  const locationNodes = await Promise.all(
    allLocationTags.map(async (tag) => (
      <TagImageCard key={tag} photoTag={tag} />
    )),
  );

  const categoryNodes = await Promise.all(
    allCategoryTags.map(async (tag) => (
      <TagImageCard key={tag} photoTag={tag} />
    )),
  );
  return (
    <>
      <Autoscroll />
      <PageWrapper maxWidth="none">
        <MagazineLayout>
          <FullCoverArticle
            href={PAGES.PHOTOGRAPHY.AERIAL_SF}
            title="San Francisco by Air"
            category="Collection"
            description="An aerial photo series of San Francisco."
            width={2}
            imageSrc={getCdnAsset(
              "photography/Embarcadero_Aerial_View_at_Sunset_jpg",
            )}
            priority
            className="fade-appear"
            style={{ animationDelay: `${1 * fadeAnimationDeltaMS}ms` }}
          />
          <HalfTextArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Astrophotography)}
            title="Astrophotography"
            category="Collection"
            description="Undoutedly one of my favorite and most technically complex forms of photography"
            imageSrc={getCdnAsset(
              "photography/Pigeon_Point_Lighthouse_Milky_Way_jpg",
            )}
            priority
            className="fade-appear"
            style={{ animationDelay: `${2 * fadeAnimationDeltaMS}ms` }}
          />
          <FullCoverArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Japan)}
            title="Tokyo, Japan"
            category="Travel"
            description="Capturing the beauties of Japan."
            width={1}
            imageSrc={getCdnAsset("photography/Hie_Shrine_Tokyo_Japan_jpg")}
            priority
            className="fade-appear"
            style={{ animationDelay: `${3 * fadeAnimationDeltaMS}ms` }}
          />

          <FullCoverArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Satellite)}
            title="Satellite Photos"
            category="Collection"
            description="Partnered with satellite providers to capture the beauty of the world from space."
            width={1}
            imageSrc={getCdnAsset(
              "photography/San_Francisco_Golden_Gate_Park_Satellite_Shot_jpg",
            )}
            className="fade-appear"
            style={{ animationDelay: `${4 * fadeAnimationDeltaMS}ms` }}
          />
          <FullCoverArticle
            href={PAGES.PHOTOGRAPHY.FEATURED}
            title="Featured Works"
            category="Prints"
            description="A mixture of fan favorites and personal favorites."
            width={2}
            imageSrc={getCdnAsset("photography/Yosemite_Valley_Sunset_jpg")}
            className="fade-appear"
            style={{ animationDelay: `${5 * fadeAnimationDeltaMS}ms` }}
          />
          <FullCoverArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Drone)}
            title="Bird's Eye View"
            category="Collection"
            description="See the world from the top down."
            width={1}
            imageSrc={getCdnAsset(
              "photography/Ping_Shek_Estate_Drone_Top_Down_Vertical_jpg",
            )}
            className="fade-appear"
            style={{ animationDelay: `${6 * fadeAnimationDeltaMS}ms` }}
          />

          <FullCoverArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Landscape)}
            title="Landscapes"
            category="Prints"
            description="Images from all around the world."
            width={2}
            imageSrc={getCdnAsset(
              "photography/Lonely_Barn_at_the_Base_of_Grand_Tetons_jpg",
            )}
            className="fade-appear"
            style={{ animationDelay: `${7 * fadeAnimationDeltaMS}ms` }}
          />
          <HalfTextArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.City)}
            title="Street Photography"
            category="Collection"
            description="Urban and city photography. Capturing everyday life."
            imageSrc={getCdnAsset(
              "photography/Tokyo_Soba_Noodles_NIght_Market_Chef_jpg",
            )}
            className="fade-appear"
            style={{ animationDelay: `${8 * fadeAnimationDeltaMS}ms` }}
          />
          <FullCoverArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Greece)}
            title="Greece"
            category="Travel"
            description="Solo travel adventures."
            width={1}
            imageSrc={getCdnAsset(
              "photography/Meteora_Monastery_Perched_at_Sunset_jpg",
            )}
            className="fade-appear"
            style={{ animationDelay: `${9 * fadeAnimationDeltaMS}ms` }}
          />
          <HalfTextArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Product)}
            title="Product Photography"
            category="Collection"
            description="Sample work from clients over the years."
            imageSrc={getCdnAsset(
              "photography/product/IWC_Watch_Aviator_Display_placeholder_jpg",
            )}
            className="fade-appear"
            style={{ animationDelay: `${10 * fadeAnimationDeltaMS}ms` }}
          />
          <FullCoverArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Engagements)}
            title="Engagements"
            category="Collection"
            description="Engagement and proposal photography"
            width={1}
            imageSrc={getCdnAsset(
              "photography/engagements/Engagement_Ring_on_Rock_placeholder_jpg",
            )}
            className="fade-appear"
            style={{ animationDelay: `${10 * fadeAnimationDeltaMS}ms` }}
          />
          <FullCoverArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.CrossCountryRoadtrip)}
            title="X-Country Roadtrip 🇺🇸"
            category="Travel"
            description="Multi week road trip across the United States from San Francisco to Princeton."
            width={1}
            imageSrc={getCdnAsset(
              "photography/_USA_Road_Trip_5_placeholder_jpg",
            )}
            className="fade-appear"
            style={{ animationDelay: `${10 * fadeAnimationDeltaMS}ms` }}
          />
          <HalfTextArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Food)}
            title="Food"
            category="Collection"
            description="Camera eats first. Mostly photos I've taken for clients."
            imageSrc={getCdnAsset(
              "photography/food/Black_Sheep_Logo_with_Food_Spread_jpg",
            )}
            className="fade-appear"
            style={{ animationDelay: `${10 * fadeAnimationDeltaMS}ms` }}
          />
        </MagazineLayout>
      </PageWrapper>
      <span className="h-0 w-full" id="browse" />
      <PageWrapper maxWidth="wide" className="my-6">
        <h1 className="w-full text-center">Browse</h1>

        <span className="h-0 w-full" id="locations" />
        <h3 className="mt-6 w-full text-center leading-loose">
          By Location 📍
        </h3>
        <div className="my-6 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
          {locationNodes}
        </div>

        <span className="h-0 w-full" id="categories" />
        <h3 className="mt-6 w-full text-center leading-loose">
          By Category 🗂️
        </h3>
        <div className="my-6 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
          {categoryNodes}
        </div>
      </PageWrapper>
    </>
  );
};

export default PhotographyHomepage;
