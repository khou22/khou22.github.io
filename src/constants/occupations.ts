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
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Microsoft_logo_%282019%29.svg",
    },
  },
  {
    years: [[2023, 2024]],
    company: {
      name: "Codeium",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Microsoft_logo_%282019%29.svg",
    },
  },
  {
    years: [[2019, 2019]],
    company: {
      name: "Airbnb",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Microsoft_logo_%282019%29.svg",
    },
  },
  {
    years: [
      [2015, 2015],
      [2018, 2019],
    ],
    company: {
      name: "Salesforce",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Microsoft_logo_%282019%29.svg",
    },
  },
  {
    years: [[2017, 2017]],
    company: {
      name: "Moat (Oracle)",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Microsoft_logo_%282019%29.svg",
    },
  },
  {
    years: [[2016, 2016]],
    company: {
      name: "Breathometer",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Microsoft_logo_%282019%29.svg",
    },
  },
];
