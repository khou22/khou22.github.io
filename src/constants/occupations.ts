import { getCdnAsset } from "@/utils/cdn/cdnAssets";

export type OccupationType = {
  years: [number, number][];
  featured?: boolean;
  fullTime?: boolean;
  company: {
    name: string;
    /**
     * URL of the company. This must begin with http(s) so that the router know it is an external link.
     */
    url: string;
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
      url: "https://nuro.ai",
      logo: getCdnAsset("media/occupations/nuro_padding_png"),
      logoLight: getCdnAsset("media/occupations/nuro_padding_light_png"),
    },
  },
  {
    years: [[2023, 2024]],
    featured: true,
    fullTime: true,
    company: {
      name: "Codeium",
      url: "https://codeium.com",
      logo: getCdnAsset("media/occupations/codeium_png"),
    },
  },
  {
    years: [[2019, 2019]],
    featured: true,
    company: {
      name: "Airbnb",
      url: "https://airbnb.com",
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
      url: "https://salesforce.com",
      logo: getCdnAsset("media/occupations/salesforce_png"),
    },
  },
  {
    years: [[2017, 2017]],
    company: {
      name: "Moat (Oracle)",
      // TODO (kevin): Find a news article about the aquisition.
      url: "https://oracle.com",
      logo: getCdnAsset("media/occupations/moat_png"),
    },
  },
  {
    years: [[2016, 2016]],
    company: {
      name: "Breathometer",
      // TODO (kevin): Populate with a business insider link or something of that sort.
      url: "#",
      logo: getCdnAsset("media/occupations/breathometer_png"),
    },
  },
];
