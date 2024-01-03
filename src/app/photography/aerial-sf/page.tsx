import { CoordinatesLabel } from "@/components/atoms/CoordinatesLabel/CoordinatesLabel";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { FeaturedGallerySpread } from "@/components/templates/FeaturedGallerySpread/FeaturedGallerySpread";
import { PhotoTags } from "@/constants/photoTags";
import { getPhotosWithTags } from "@/data/photos/photoDbManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "San Francisco by Air | Kevin Hou Photography",
  description:
    "Kevin Hou Photography exhibiting San Francisco's beautiful views by air: drone, plane, satellite, and more.",
};

const AerialSfPage = async () => {
  const allPhotosIDs = await getPhotosWithTags([
    PhotoTags.Drone,
    PhotoTags.SanFrancisco,
  ]);

  return (
    <>
      <FeaturedGallerySpread
        title={{
          pretext: "High above the streets of",
          text: "San Francisco",
        }}
        subtitle="Birds Eye View"
        project={{
          author: "Kevin Hou",
          duration: "2017 - Present",
          location: (
            <CoordinatesLabel latitude={37.7790262} longitude={-122.419906} />
          ),
        }}
        blockSection={{
          text: "The 415",
          background:
            "photography/San_Francisco_Downtown_Twilight_Sunset_Drone_Panorama_jpg",
        }}
        cover={{
          hero: "photography/San_Francisco_Golden_Gate_Park_Satellite_Shot_jpg",
          left: "photography/Golden_Gate_Bridge_Aerial_Head_On_jpg",
          right:
            "photography/Downtown_San_Francisco_Birds_Eye_View_Top_Down_Powell_Street_Intersection_Drone_jpg",
        }}
        features={[
          {
            photoID:
              "photography/San_Francisco_Lombard_Street_Sunrise_Drone_Vertical_jpg",
            label: "Lombard Street at 6am, San Francisco",
            description: (
              <CoordinatesLabel
                latitude={37.80181121826172}
                longitude={-122.42108917236328}
              />
            ),
          },
          {
            photoID:
              "photography/Downtown_San_Francisco_Drone_Vertical_Powell_Street_Intersection_jpg",
            label: "Market Street",
            description: (
              <CoordinatesLabel
                latitude={37.78683207010421}
                longitude={-122.40317722776919}
              />
            ),
          },
          {
            photoID: "photography/Main_Post_Presidio_San_Francisco_jpg",
            label: "Main Post, Presidio",
            description: (
              <CoordinatesLabel
                latitude={37.80358670437733}
                longitude={-122.46400436380893}
              />
            ),
          },
          {
            photoID:
              "photography/Embarcadero_Drone_Ferry_Building_Night_Horizontal_jpg",
            label: "Ferry Building",
            description: (
              <CoordinatesLabel
                latitude={37.795829812869364}
                longitude={-122.39370902994662}
              />
            ),
          },
          {
            photoID: "photography/Bay_Bridge_at_Sunset_from_Plane_jpg",
            label: "Bay Bridge",
            description: (
              <CoordinatesLabel
                latitude={37.8367032779192}
                longitude={-122.40002831438571}
              />
            ),
          },
          {
            photoID: "photography/Lombard_Street_Drone_jpg",
            label: "Lombard Street",
            description: (
              <CoordinatesLabel
                className="text-center"
                latitude={37.80181121826172}
                longitude={-122.42108917236328}
              />
            ),
          },
        ]}
      />

      <PageWrapper>
        <PhotoGallery photoIDs={allPhotosIDs} />
      </PageWrapper>
    </>
  );
};

export default AerialSfPage;
