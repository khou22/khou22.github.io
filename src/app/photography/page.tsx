import { ImageCard } from "@/components/molecules/ImageCard/ImageCard";
import { FullCoverArticle } from "@/components/organisms/MagazineLayout/FullCoverArticle";
import { HalfTextArticle } from "@/components/organisms/MagazineLayout/HalfTextArticle";
import { MagazineLayout } from "@/components/organisms/MagazineLayout/MagazineLayout";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoTags, allLocationTags, tagMetadata } from "@/constants/photoTags";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import Link from "next/link";

const PhotographyHomepage = async () => {
  const categoryNodes = await Promise.all(
    allLocationTags.map(async (tag) => {
      const photoIDs = await getPhotosWithTag(tag);
      const thumbnail = tagMetadata[tag].thumbnailPhotoId || photoIDs[0];
      return (
        <Link
          key={tag}
          href={PAGES.PHOTOGRAPHY.TAG(tag)}
          className="col-span-1"
        >
          <ImageCard
            title={tagMetadata[tag].name}
            imageSrc={getCdnAsset(thumbnail)}
          />
        </Link>
      );
    }),
  );

  return (
    <>
      <PageWrapper maxWidth="none">
        <MagazineLayout>
          <FullCoverArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.SanFrancisco)}
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
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Japan)}
            title="Tokyo, Japan"
            category="Travel"
            description="Capturing the beauties of Japan."
            width={1}
            imageSrc={getCdnAsset("media/store/Hie_Shrine_Tokyo_Japan_jpg")}
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
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Drone)}
            title="Bird's Eye View"
            category="Collection"
            description="See the world from the top down."
            width={1}
            imageSrc={getCdnAsset(
              "photography/Ping_Shek_Estate_Drone_Top_Down_Vertical_jpg",
            )}
          />

          <FullCoverArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Landscape)}
            title="Landscapes"
            category="Prints"
            description="Images from all around the world."
            width={2}
            imageSrc={getCdnAsset(
              "photography/Grand_Teton_Bison_Landscape_jpg",
            )}
          />
          <HalfTextArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.City)}
            title="Street Photography"
            category="Collection"
            description="Urban and city photography. Capturing everyday life."
            imageSrc={getCdnAsset(
              "photography/Tokyo_Soba_Noodles_NIght_Market_Chef_jpg",
            )}
          />
          <FullCoverArticle
            href={PAGES.PHOTOGRAPHY.TAG(PhotoTags.Italy)}
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
      <PageWrapper>
        <h2 className="text-center">By Location 📍</h2>
        <div className="grid grid-cols-6">{categoryNodes}</div>
      </PageWrapper>
    </>
  );
};

export default PhotographyHomepage;
