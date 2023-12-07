import { getCdnAsset } from "@/utils/cdn/cdnAssets";

export type OccupationType = {
  years: [number, number][];
  company: {
    name: string;
    logo: string;
  };
};

export const occupations: OccupationType[] = [
  {
    years: [[2020, 2023]],
    company: {
      name: "Nuro",
      logo: getCdnAsset("media/occupations/nuro_padding_png"),
    },
  },
  {
    years: [[2023, 2024]],
    company: {
      name: "Codeium",
      logo: getCdnAsset("media/occupations/codeium_png"),
    },
  },
  {
    years: [[2019, 2019]],
    company: {
      name: "Airbnb",
      logo: getCdnAsset("media/occupations/airbnb_png"),
    },
  },
  {
    years: [
      [2015, 2015],
      [2018, 2019],
    ],
    company: {
      name: "Salesforce",
      logo: getCdnAsset("media/occupations/salesforce_png"),
    },
  },
  {
    years: [[2017, 2017]],
    company: {
      name: "Moat (Oracle)",
      logo: getCdnAsset("media/occupations/moat_png"),
    },
  },
  {
    years: [[2016, 2016]],
    company: {
      name: "Breathometer",
      logo: getCdnAsset("media/occupations/breathometer_png"),
    },
  },
];
