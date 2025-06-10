import React from "react";
import { Metadata } from "next";
import { CoordinatesLabel } from "@/components/atoms/CoordinatesLabel/CoordinatesLabel";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { FeaturedGallerySpread } from "@/components/templates/FeaturedGallerySpread/FeaturedGallerySpread";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { getPhotosWithTags } from "@/data/photos/photoDbManager";
import { PrintShopCTA } from "@/components/organisms/PrintShopCTA/PrintShopCTA";

export const metadata: Metadata = {
  title: "San Francisco Print Shop | Kevin Hou Photography",
  description:
    "Top-rated San Francisco prints available for purchase. Featuring iconic landmarks, aerial views, and hidden gems of the city by the bay.",
};

const SFPrintShopPage = async () => {
  // Get top-rated San Francisco photos
  const sfPhotosIDs = await getPhotosWithTags([PhotoTags.SanFrancisco]);

  return (
    <>
      <FeaturedGallerySpread
        title={{
          pretext: "Prints from the",
          text: "City by the Bay",
        }}
        subtitle="San Francisco Print Collection"
        project={{
          author: "Kevin Hou",
          duration: "Limited Edition Prints",
          location: (
            <CoordinatesLabel latitude={37.7749} longitude={-122.4194} />
          ),
        }}
        blockSection={{
          text: "SF Prints",
          background:
            "photography/San_Francisco_Downtown_Twilight_Sunset_Drone_Panorama_jpg",
        }}
        cover={{
          hero: "photography/Golden_Gate_Bridge_Aerial_Head_On_jpg",
          left: "photography/San_Francisco_Lombard_Street_Sunrise_Drone_Vertical_jpg",
          right:
            "photography/Downtown_San_Francisco_Birds_Eye_View_Top_Down_Powell_Street_Intersection_Drone_jpg",
        }}
        features={[
          {
            photoID:
              "photography/Golden_Gate_Bridge_Aerial_Head_On_jpg",
            label: "Golden Gate Bridge",
            description: (
              <CoordinatesLabel
                latitude={37.8199}
                longitude={-122.4783}
              />
            ),
          },
          {
            photoID:
              "photography/San_Francisco_Lombard_Street_Sunrise_Drone_Vertical_jpg",
            label: "Lombard Street at Sunrise",
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
            label: "Downtown Powell Street",
            description: (
              <CoordinatesLabel
                latitude={37.78683207010421}
                longitude={-122.40317722776919}
              />
            ),
          },
          {
            photoID:
              "photography/Embarcadero_Drone_Ferry_Building_Night_Horizontal_jpg",
            label: "Ferry Building at Night",
            description: (
              <CoordinatesLabel
                latitude={37.795829812869364}
                longitude={-122.39370902994662}
              />
            ),
          },
          {
            photoID: "photography/Bay_Bridge_at_Sunset_from_Plane_jpg",
            label: "Bay Bridge Sunset",
            description: (
              <CoordinatesLabel
                latitude={37.8367032779192}
                longitude={-122.40002831438571}
              />
            ),
          },
          {
            photoID: "photography/San_Francisco_Golden_Gate_Park_Satellite_Shot_jpg",
            label: "Golden Gate Park from Above",
            description: (
              <CoordinatesLabel
                className="text-center"
                latitude={37.7694}
                longitude={-122.4862}
              />
            ),
          },
        ]}
      />

      <PageWrapper maxWidth="wide">
        <div className="my-12 w-full">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Limited Edition San Francisco Prints
          </h2>
          <p className="mx-auto max-w-3xl text-center text-lg">
            Each print is carefully produced using archival-quality materials to ensure vibrant colors and exceptional detail that will last for generations. Available in various sizes and framing options to perfectly complement your space.
          </p>
          
          <PrintShopCTA 
            title="Ready to bring San Francisco home?"
            description="Order your limited edition print today and receive free shipping on orders over $150."
            buttonText="Shop Now"
          />
        </div>
      </PageWrapper>

      <PageWrapper>
        <h3 className="mb-6 text-center text-2xl">Browse All San Francisco Prints</h3>
        <PhotoGallery photoIDs={sfPhotosIDs} />
      </PageWrapper>
    </>
  );
};

export default SFPrintShopPage;
