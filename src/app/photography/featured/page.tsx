import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoTags } from "@/constants/photoTags";
import { getPhotosWithTag } from "@/data/photos/photoDbManager";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { FeaturedGallerySpread } from "@/components/templates/FeaturedGallerySpread/FeaturedGallerySpread";

const PhotographyFeaturedPage = async () => {
  const photoIDs = await getPhotosWithTag(PhotoTags.Featured);

  return (
    <PageWrapper maxWidth="wide">
      <FeaturedGallerySpread
        title={{
          pretext: "Curated collection of",
          text: "Features",
        }}
        subtitle="Landscape Urban Drone More"
        project={{
          author: "Kevin Hou",
          duration: "2016 - Present",
          location: "Earth",
        }}
        blockSection={{
          text: "The Fan Favorites",
          background: "photography/Yosemite_Valley_Red_Veil_Panorama_jpg",
        }}
        cover={{
          hero: "photography/Shore_Stimulations_Dominican_Republic_Top_Down_Drone_Beach_jpg",
          left: "photography/Ping_Shek_Estate_Drone_Top_Down_Vertical_jpg",
          right:
            "photography/San_Francisco_California_and_Powell_Street_Trolly_jpg",
        }}
      />

      <PhotoGallery photoIDs={photoIDs} />
    </PageWrapper>
  );
};

export default PhotographyFeaturedPage;
