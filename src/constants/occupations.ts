import { getCdnAsset } from "@/utils/cdn/cdnAssets";

export type OccupationType = {
  years: [number, number][];
  featured?: boolean;
  fullTime?: boolean;
  company: {
    name: string;
    logo: string;
    logoLight?: string;
  };
};

export const occupations: OccupationType[] = [
  {
    years: [[2020, 2023]],
    featured: true,
    fullTime: true,
    company: {
      name: "Nuro",
      logo: getCdnAsset("media/occupations/nuro_padding_png"),
      logoLight: getCdnAsset("media/occupations/nuro_padding_light_png"),
    },
  },
  {
    years: [[2023, 2025]],
    featured: true,
    fullTime: true,
    company: {
      name: "Windsurf",
      logo: getCdnAsset("media/occupations/windsurf_png"),
    },
  },
  {
    years: [[2023, 2025]],
    featured: true,
    fullTime: true,
    company: {
      name: "Codeium",
      logo: getCdnAsset("media/occupations/codeium_png"),
    },
  },
  {
    years: [[2019, 2019]],
    featured: true,
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
    featured: true,
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
