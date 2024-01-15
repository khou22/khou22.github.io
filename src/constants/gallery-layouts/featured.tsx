import { CoordinatesLabel } from "@/components/atoms/CoordinatesLabel/CoordinatesLabel";
import { FeaturedGallerySpreadProps } from "@/components/templates/FeaturedGallerySpread/types";

export const featuredTagGalleryLayout: FeaturedGallerySpreadProps = {
  title: {
    pretext: "Curated collection of",
    text: "Features",
  },
  subtitle: "Landscape Urban Drone More",
  project: {
    author: "Kevin Hou",
    duration: "2016 - Present",
    location: "Earth",
  },
  blockSection: {
    text: "The Fan Favorites",
    background: "photography/New_York_Hudson_Yards_Rooftop_Panorama_jpg",
  },
  cover: {
    hero: "photography/Shore_Stimulations_Dominican_Republic_Top_Down_Drone_Beach_jpg",
    left: "photography/Ping_Shek_Estate_Drone_Top_Down_Vertical_jpg",
    right: "photography/San_Francisco_California_and_Powell_Street_Trolly_jpg",
  },
  features: [
    {
      photoID: "photography/Hie_Shrine_Tokyo_Japan_jpg",
      label: "Hie Shrine, Japan",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID: "photography/Road_to_Hana_Cliffside_jpg",
      label: "Road to Hana, Hawaii",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID: "photography/Yosemite_Valley_Red_Veil_Panorama_jpg",
      label: "Yosemite Valley",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID: "photography/THS_Tennis_Court_Drone_Drone_Art_jpg",
      label: "A Tennis Court",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID:
        "photography/usa_road_trip/Grand_Teton_Astro_with_Grass_USA_Road_Trip_jpg",
      label: "Nighttime in Wyoming",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
    {
      photoID:
        "photography/Florence_View_from_Piazzale_Michelangelo_at_Sunset_jpg",
      label: "View from Piazzale",
      description: (
        <CoordinatesLabel
          latitude={37.80181121826172}
          longitude={-122.42108917236328}
        />
      ),
    },
  ],
};
