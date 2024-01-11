import { CoordinatesLabel } from "@/components/atoms/CoordinatesLabel/CoordinatesLabel";
import { FeaturedGallerySpreadProps } from "@/components/templates/FeaturedGallerySpread/FeaturedGallerySpread";

export const tokyoGalleryLayout: FeaturedGallerySpreadProps = {
  title: {
    pretext: "Exploring Japan",
    text: "Tokyo",
  },
  subtitle: "One Week Trip",
  project: {
    author: "Kevin Hou",
    duration: "2019",
    location: <CoordinatesLabel latitude={35.6764} longitude={139.65} />,
  },
  blockSection: {
    text: "Tokyo, Japan",
    background: "photography/Shinjuku_Tokyo_Japan_Horizontal_jpg",
  },
  cover: {
    hero: "photography/Tokyo_Soba_Noodles_NIght_Market_Chef_jpg",
    left: "photography/Tokyo_Shrine_jpg",
    right: "photography/Hie_Shrine_Tokyo_Japan_jpg",
  },
  features: [
    {
      photoID: "photography/Shibuya_Taxi_Motion_Blur_jpg",
      label: "Shibuya Crossing",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID: "photography/Tokyo_Cherry_Blossums_jpg",
      label: "Cherry Blossum Season",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID: "photography/Shinjuku_Tokyo_Japan_Horizontal_jpg",
      label: "Signage from Shinjuku",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID: "photography/Shibuya_Shopping_Tokyo_Vertical_jpg",
      label: "Shopping at Shibuya",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID: "photography/Tokyo_Shinjuku_Alley_Cyberpunk_Neon_jpg",
      label: "Home of Cyberpunk",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID: "photography/Shibuya_Crossing_Bike_Motion_Blur_jpg",
      label: "Crossing at Shibuya",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
  ],
};
