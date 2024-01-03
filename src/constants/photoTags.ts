import { FeaturedGallerySpreadProps } from "@/components/templates/FeaturedGallerySpread/FeaturedGallerySpread";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";
import _ from "lodash";
import { featuredTagGalleryLayout } from "./gallery-layouts/featured";
import { tokyoGalleryLayout } from "./gallery-layouts/tokyo";

export enum PhotoTags {
  // Standard tag themes for category portfolios.
  Landscape = "category_landscape",
  Engagements = "category_engagements",
  Events = "category_events",
  Concert = "category_concert",
  Portraits = "category_portraits",
  City = "category_city",
  Astrophotography = "category_astrophotography",
  Product = "category_product",
  Food = "category_food",
  Cycling = "category_cycling",

  // Location specific tags.
  SanFrancisco = "location_san_francisco",
  HongKong = "location_hong_kong",
  NewYork = "location_new_york",
  DominicanRepublic = "location_dominican_republic",
  Princeton = "location_princeton",
  Seattle = "location_seattle",
  Korea = "location_korea",
  Japan = "location_japan",
  WashingtonDC = "location_washington_dc",
  Tahoe = "location_tahoe",
  Yosemite = "location_preague",
  Hawaii = "location_hawaii",
  Italy = "location_italy",
  Taiwan = "location_taiwan",
  Singapore = "location_singapore",
  Vietnam = "location_vietnam",
  Thailand = "location_thailand",
  Germany = "location_germany",
  Greece = "location_greece",

  // Camera specific.
  Drone = "camera_drone",
  Panerama = "camera_panerama",
  Satellite = "camera_satellite",

  // Other.
  CrossCountryRoadtrip = "other_cross_country_roadtrip",
  Featured = "other_featured",

  // Store tags.
  NotForSale = "store_not_for_sale",
}

export const allLocationTags = [
  PhotoTags.SanFrancisco,
  PhotoTags.HongKong,
  PhotoTags.NewYork,
  PhotoTags.DominicanRepublic,
  PhotoTags.Princeton,
  PhotoTags.Seattle,
  PhotoTags.Korea,
  PhotoTags.Japan,
  PhotoTags.WashingtonDC,
  PhotoTags.Tahoe,
  PhotoTags.Yosemite,
  PhotoTags.Hawaii,
  PhotoTags.Italy,
  PhotoTags.Taiwan,
  PhotoTags.Singapore,
  PhotoTags.Vietnam,
  PhotoTags.Thailand,
  PhotoTags.Germany,
  PhotoTags.Greece,
];

export const allCategoryTags = [
  PhotoTags.Landscape,
  PhotoTags.City,
  PhotoTags.Events,
  PhotoTags.Portraits,
  PhotoTags.Product,
  PhotoTags.Food,
  PhotoTags.Engagements,
  PhotoTags.Panerama,
  PhotoTags.Satellite,
  // PhotoTags.Concert,
  PhotoTags.Astrophotography,
  PhotoTags.Drone,
  PhotoTags.Cycling,
];

export type TagMetadataType = {
  name: string;
  slug: string;
  thumbnailPhotoId?: PhotoIdType;
  hidden?: boolean;
  galleryLayout?: FeaturedGallerySpreadProps;
};

export const tagMetadata: Record<PhotoTags, TagMetadataType> = {
  [PhotoTags.Landscape]: {
    name: "Landscape",
    slug: "landscape",
    thumbnailPhotoId: "photography/Moose_Reserve_Jackson_Hole_Wyoming_jpg",
  },
  [PhotoTags.Engagements]: {
    name: "Engagements",
    slug: "engagements",
    thumbnailPhotoId: "photography/engagements/Engagement_Ring_on_Rock_jpg",
  },
  [PhotoTags.Events]: {
    name: "Events",
    slug: "events",
    thumbnailPhotoId: "photography/events/apco_salon_dinner_discussion_jpg",
  },
  [PhotoTags.Concert]: {
    name: "Concert",
    slug: "concert",
  },
  [PhotoTags.Portraits]: {
    name: "Portraits",
    slug: "portraits",
    thumbnailPhotoId: "photography/portraits/Courtney_Fall_Leaves_Portrait_jpg",
  },
  [PhotoTags.City]: {
    name: "City",
    slug: "city",
    thumbnailPhotoId: "photography/portraits/Chinatown_Walking_Silhouette_jpg",
  },
  [PhotoTags.Astrophotography]: {
    name: "Astrophotography",
    slug: "astrophotography",
    thumbnailPhotoId: "photography/Pigeon_Point_Lighthouse_Milky_Way_jpg",
  },
  [PhotoTags.Product]: {
    name: "Product",
    slug: "product",
    thumbnailPhotoId: "photography/product/IWC_Watch_Shot_Landscape_jpg",
  },
  [PhotoTags.Food]: {
    name: "Food",
    slug: "food",
    thumbnailPhotoId: "photography/Black_Sheep_Foods_Single_Burger_jpg",
  },
  [PhotoTags.Cycling]: {
    name: "Cycling",
    slug: "cycling",
    thumbnailPhotoId:
      "photography/san_francisco/Rodeo_Beach_Gravel_Hill_Sunset_Ride_jpg",
  },
  [PhotoTags.SanFrancisco]: {
    name: "San Francisco",
    slug: "san-francisco",
    thumbnailPhotoId:
      "photography/Sunrise_Lombard_Street_Drone_Head_On_Vertical_jpg",
  },
  [PhotoTags.HongKong]: {
    name: "Hong Kong",
    slug: "hong-kong",
    thumbnailPhotoId:
      "photography/Hong_Kong_Red_Taxi_Motion_Blur_Horizontal_jpg",
  },
  [PhotoTags.NewYork]: {
    name: "New York",
    slug: "new-york",
    thumbnailPhotoId:
      "photography/New_York_Looking_Down_Street_from_High_Line_Vertical_jpg",
  },
  [PhotoTags.DominicanRepublic]: {
    name: "Dominican Republic",
    slug: "dominican-republic",
    thumbnailPhotoId:
      "photography/Shore_Stimulations_Dominican_Republic_Top_Down_Drone_Beach_jpg",
  },
  [PhotoTags.Princeton]: {
    name: "Princeton",
    slug: "princeton",
    thumbnailPhotoId: "photography/Nassau_Hall_Landscape_Drone_jpg",
  },
  [PhotoTags.Seattle]: {
    name: "Seattle",
    slug: "seattle",
    thumbnailPhotoId:
      "photography/Seattle_Vertical_Drone_Space_Needle_Sunset_jpg",
  },
  [PhotoTags.Korea]: {
    name: "Korea",
    slug: "korea",
    thumbnailPhotoId: "photography/Korea_Palace_Through_Doorway_jpg",
  },
  [PhotoTags.Japan]: {
    name: "Japan",
    slug: "japan",
    thumbnailPhotoId: "photography/Hie_Shrine_Tokyo_Japan_jpg",
    galleryLayout: tokyoGalleryLayout,
  },
  [PhotoTags.WashingtonDC]: {
    name: "Washington DC",
    slug: "washington-dc",
    thumbnailPhotoId:
      "photography/Capitol_Building_Walking_Towards_Building_on_Street_jpg",
  },
  [PhotoTags.Tahoe]: {
    name: "Tahoe",
    slug: "tahoe",
    thumbnailPhotoId: "photography/Milky_Way_in_Tahoe_Forest_jpg",
  },
  [PhotoTags.Yosemite]: {
    name: "Yosemite",
    slug: "yosemite",
    thumbnailPhotoId: "photography/Yosemite_Valley_Sunset_placeholder_jpg",
  },
  [PhotoTags.Hawaii]: {
    name: "Hawaii",
    slug: "hawaii",
    thumbnailPhotoId: "photography/Nakalele_Blowhole_placeholder_jpg",
  },
  [PhotoTags.Italy]: {
    name: "Italy",
    slug: "italy",
    thumbnailPhotoId:
      "photography/Bridge_with_Vatican_in_the_Background_placeholder_jpg",
  },
  [PhotoTags.Taiwan]: {
    name: "Taiwan",
    slug: "taiwan",
    thumbnailPhotoId: "photography/Jiufen_Taiwan_Drone_Vertical_jpg",
  },
  [PhotoTags.Singapore]: {
    name: "Singapore",
    slug: "singapore",
    thumbnailPhotoId: "photography/Marina_Bay_Drone_Panorama_jpg",
  },
  [PhotoTags.Vietnam]: {
    name: "Vietnam",
    slug: "vietnam",
    thumbnailPhotoId: "photography/Halong_Bay_Sunset_Panorama_placeholder_jpg",
  },
  [PhotoTags.Thailand]: {
    name: "Thailand",
    slug: "thailand",
  },
  [PhotoTags.Germany]: {
    name: "Germany",
    slug: "germany",
    thumbnailPhotoId:
      "photography/germany/Munich_Colorful_Houses_in_Winter_placeholder_jpg",
  },
  [PhotoTags.Greece]: {
    name: "Greece",
    slug: "greece",
    thumbnailPhotoId:
      "photography/greece/Acropolis_at_Sunset_from_Filopappou_Hill_placeholder_jpg",
  },
  [PhotoTags.Drone]: {
    name: "Aerial",
    slug: "aerial",
    thumbnailPhotoId:
      "photography/Single_Person_Lying_on_Beach_Top_Down_Drone_Las_Terrenas_Dominican_Republic_jpg",
  },
  [PhotoTags.Panerama]: {
    name: "Panerama",
    slug: "panerama",
    thumbnailPhotoId: "photography/Panorama_of_Arno_River_in_Pisa_Italy_jpg",
  },
  [PhotoTags.Satellite]: {
    name: "Satellite",
    slug: "satellite",
  },
  [PhotoTags.CrossCountryRoadtrip]: {
    name: "Cross-Country Roadtrip",
    slug: "cross-country-roadtrip",
    thumbnailPhotoId: "photography/Mount_Rushmore_Picture_of_iPhone_jpg",
  },
  [PhotoTags.Featured]: {
    name: "Featured",
    slug: "featured",
    thumbnailPhotoId:
      "photography/usa_road_trip/Grand_Teton_Astro_with_Grass_USA_Road_Trip_jpg",
    galleryLayout: featuredTagGalleryLayout,
  },
  [PhotoTags.NotForSale]: {
    name: "Not for sale",
    slug: "not-for-sale",
    hidden: true,
  },
};
