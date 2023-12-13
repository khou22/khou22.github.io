import { PhotoIdType } from "@/utils/cdn/cdnAssets";

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

  // Camera specific.
  Drone = "camera_drone",
  Panerama = "camera_panerama",
  Satellite = "camera_satellite",

  // Other.
  CrossCountryRoadtrip = "other_cross_country_roadtrip",
  Featured = "other_featured",
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
];

export type TagMetadataType = {
  name: string;
  slug: string;
  thumbnailPhotoId?: PhotoIdType;
};

export const tagMetadata: Record<PhotoTags, TagMetadataType> = {
  [PhotoTags.Landscape]: {
    name: "Landscape",
    slug: "landscape",
  },
  [PhotoTags.Engagements]: {
    name: "Engagements",
    slug: "engagements",
  },
  [PhotoTags.Events]: {
    name: "Events",
    slug: "events",
  },
  [PhotoTags.Concert]: {
    name: "Concert",
    slug: "concert",
  },
  [PhotoTags.Portraits]: {
    name: "Portraits",
    slug: "portraits",
  },
  [PhotoTags.City]: {
    name: "City",
    slug: "city",
  },
  [PhotoTags.Astrophotography]: {
    name: "Astrophotography",
    slug: "astrophotography",
  },
  [PhotoTags.Product]: {
    name: "Product",
    slug: "product",
  },
  [PhotoTags.SanFrancisco]: {
    name: "San Francisco",
    slug: "san-francisco",
  },
  [PhotoTags.HongKong]: {
    name: "Hong Kong",
    slug: "hong-kong",
  },
  [PhotoTags.NewYork]: {
    name: "New York",
    slug: "new-york",
  },
  [PhotoTags.DominicanRepublic]: {
    name: "Dominican Republic",
    slug: "dominican-republic",
  },
  [PhotoTags.Princeton]: {
    name: "Princeton",
    slug: "princeton",
  },
  [PhotoTags.Seattle]: {
    name: "Seattle",
    slug: "seattle",
  },
  [PhotoTags.Korea]: {
    name: "Korea",
    slug: "korea",
  },
  [PhotoTags.Japan]: {
    name: "Japan",
    slug: "japan",
  },
  [PhotoTags.WashingtonDC]: {
    name: "Washington DC",
    slug: "washington-dc",
  },
  [PhotoTags.Tahoe]: {
    name: "Tahoe",
    slug: "tahoe",
  },
  [PhotoTags.Yosemite]: {
    name: "Yosemite",
    slug: "yosemite",
  },
  [PhotoTags.Hawaii]: {
    name: "Hawaii",
    slug: "hawaii",
  },
  [PhotoTags.Italy]: {
    name: "Italy",
    slug: "italy",
  },
  [PhotoTags.Taiwan]: {
    name: "Taiwan",
    slug: "taiwan",
  },
  [PhotoTags.Singapore]: {
    name: "Singapore",
    slug: "singapore",
  },
  [PhotoTags.Vietnam]: {
    name: "Vietnam",
    slug: "vietnam",
  },
  [PhotoTags.Thailand]: {
    name: "Thailand",
    slug: "thailand",
  },
  [PhotoTags.Drone]: {
    name: "Aerial",
    slug: "aerial",
  },
  [PhotoTags.Panerama]: {
    name: "Panerama",
    slug: "panerama",
  },
  [PhotoTags.Satellite]: {
    name: "Satellite",
    slug: "satellite",
  },
  [PhotoTags.CrossCountryRoadtrip]: {
    name: "Cross-Country Roadtrip",
    slug: "cross-country-roadtrip",
  },
  [PhotoTags.Featured]: {
    name: "Featured",
    slug: "featured",
  },
};
