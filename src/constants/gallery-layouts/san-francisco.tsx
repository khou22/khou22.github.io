import { CoordinatesLabel } from "@/components/atoms/CoordinatesLabel/CoordinatesLabel";
import { FeaturedGallerySpreadProps } from "@/components/templates/FeaturedGallerySpread/types";

export const sanFranciscoTagGalleryLayout: FeaturedGallerySpreadProps = {
  title: {
    pretext: "Beautiful city of",
    text: "San Francisco",
  },
  subtitle: "Hills Fog Sunsets",
  project: {
    author: "Kevin Hou",
    duration: "2017 - Present",
    location: <CoordinatesLabel latitude={37.7749} longitude={-122.4194} />,
  },
  blockSection: {
    text: "San Francisco California",
    background: "photography/Presidio_in_San_Francisco_Satellite_jpg",
  },
  cover: {
    hero: "photography/San_Francisco_California_and_Powell_Street_Trolly_jpg",
    left: "photography/San_Francisco_Lombard_Street_Sunrise_Drone_Vertical_jpg",
    right: "photography/Transamerica_Building_San_Francisco_Drone_Vertical_jpg",
  },
  features: [
    {
      photoID:
        "photography/Brenizer_Method_Portrait_in_front_of_Golden_Gate_jpg",
      label: "Baker Beach",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID: "photography/At_T_Park_Mission_Bay_San_Francisco_jpg",
      label: "San Francisco Giants",
      description: "AT&T Park (Now Oracle Park)",
    },
    {
      photoID: "photography/Ferry_Building_with_Skyline_At_Night_jpg",
      label: "Views from Treasure Island",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID:
        "photography/San_Francisco_Downtown_Twilight_Sunset_Drone_Panorama_jpg",
      label: "Downtown San Francisco",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID:
        "photography/san_francisco/Gravel_Bike_at_Golden_Gate_Bridge_at_Sunset_jpg",
      label: "Gravel Cycling",
      description: "Some of the best biking in the world",
    },
    {
      photoID: "photography/San_Francisco_Golden_Gate_Park_Satellite_Shot_jpg",
      label: "Overview of San Francisco",
      description: "Unbeatable parks and weather.",
    },
  ],
};
