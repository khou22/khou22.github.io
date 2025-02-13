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
    link: "https://photos.app.goo.gl/4sHBGQ9FCpqJpTiX9",
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
  {
    id: "lwhs-senior-night-2024",
    name: "Lick-Wilmerding High School Girls Varsity Basketball Senior Night 2024",
    cover: "photography/sports/LWHS_Girls_Varsity_Senior_Night_2024_5_jpg",
    link: "https://photos.app.goo.gl/RsBbNkD3eonGXTcr6",
    photos: [
      "photography/sports/LWHS_Girls_Varsity_Senior_Night_2024_1_jpg",
      "photography/sports/LWHS_Girls_Varsity_Senior_Night_2024_2_jpg",
      "photography/sports/LWHS_Girls_Varsity_Senior_Night_2024_3_jpg",
      "photography/sports/LWHS_Girls_Varsity_Senior_Night_2024_4_jpg",
      "photography/sports/LWHS_Girls_Varsity_Senior_Night_2024_5_jpg",
    ],
  },
  {
    id: "codeium-employee-headshots",
    name: "Codeium Headshots",
    link: "https://photos.app.goo.gl/xeZRnQycZX4BR5bv7",
    cover: "photography/portraits/Codeium_Headshots_4_jpg",
    photos: [
      "photography/portraits/Codeium_Headshots_1_jpg",
      "photography/portraits/Codeium_Headshots_2_jpg",
      "photography/portraits/Codeium_Headshots_3_jpg",
      "photography/portraits/Codeium_Headshots_4_jpg",
    ],
  },
  {
    id: "lwhs-senior-night-lacrosse-2024",
    name: "Lick-Wilmerding High School Girls Varsity Lacrosse Senior Night 2024",
    link: "https://photos.app.goo.gl/H1cRyWa8rHoZpQcr6",
    cover: "photography/sports/LWHS_Girls_Lacrosse_Senior_Night_2024_1_jpg",
    photos: [
      "photography/sports/LWHS_Girls_Lacrosse_Senior_Night_2024_1_jpg",
      "photography/sports/LWHS_Girls_Lacrosse_Senior_Night_2024_2_jpg",
      "photography/sports/LWHS_Girls_Lacrosse_Senior_Night_2024_3_jpg",
      "photography/sports/LWHS_Girls_Lacrosse_Senior_Night_2024_4_jpg",
    ],
  },
  {
    id: "farleys-august-2024",
    name: "Farley's Artist of the Month August 2024",
    link: "https://photos.app.goo.gl/g59E1N3io3BoE6aX9",
    cover: "photography/events/farleys_hangout_3_jpg",
    photos: [
      "photography/events/farleys_hangout_1_jpg",
      "photography/events/farleys_hangout_2_jpg",
      "photography/events/farleys_hangout_3_jpg",
      "photography/events/farleys_hangout_4_jpg",
      "photography/events/farleys_hangout_5_jpg",
    ],
  },
];
