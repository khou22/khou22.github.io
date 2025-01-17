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

  // TODO (k): Rename to sports.
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
  Turkey = "location_turkey",

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
  PhotoTags.Turkey,
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
  PhotoTags.Concert,
  PhotoTags.Astrophotography,
  PhotoTags.Drone,
  PhotoTags.Cycling,
];
