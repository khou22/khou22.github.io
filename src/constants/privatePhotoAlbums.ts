import { PhotoIdType } from "@/utils/cdn/cdnAssets";

export type PrivatePhotoAlbumType = {
  id: string;
  name: string;
  cover: PhotoIdType;
  photos: PhotoIdType[];

  /**
   * Link to a full distrubution of the album.
   */
  link?: string;
};

export const privatePhotoAlbums: PrivatePhotoAlbumType[] = [
  {
    id: "lwhs-chase-center-2024",
    name: "Lick-Wilmerding High School vs. University High School at Chase Center 2024",
    cover: "photography/sports/LWHS_at_Chase_Center_2024_1_jpg",
    link: "https://photos.app.goo.gl/5LWPj1eM3BY4g2ACA",
    photos: [
      "photography/sports/LWHS_at_Chase_Center_2024_1_jpg",
      "photography/sports/LWHS_at_Chase_Center_2024_2_jpg",
      "photography/sports/LWHS_at_Chase_Center_2024_3_jpg",
      "photography/sports/LWHS_at_Chase_Center_2024_4_jpg",
      "photography/sports/LWHS_at_Chase_Center_2024_5_jpg",
      "photography/sports/LWHS_at_Chase_Center_2024_6_jpg",
      "photography/sports/LWHS_at_Chase_Center_2024_7_jpg",
      "photography/sports/LWHS_at_Chase_Center_2024_8_jpg",
    ],
  },
];
