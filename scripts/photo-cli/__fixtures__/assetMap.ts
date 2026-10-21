/**
 * Stand-in for `cdnAssets.generated.ts` in tests. Use with:
 *   jest.mock("@/utils/cdn/cdnAssets.generated", () =>
 *     jest.requireActual("<path>/__fixtures__/assetMap"),
 *   );
 */
export const _generatedCdnAssets = {
  index_html: { path: "/index.html", name: `index`, dimensions: [null, null] },
  "photography/Alpha_jpg": {
    path: "/photography/Alpha.jpg",
    name: `Alpha`,
    dimensions: [1200, 800],
  },
  "photography/Alpha_placeholder_jpg": {
    path: "/photography/Alpha.placeholder.jpg",
    name: `Alpha.placeholder`,
    dimensions: [600, 400],
  },
  "photography/sf/Golden_Gate_Sunset_jpg": {
    path: "/photography/sf/Golden%20Gate%20Sunset.jpg",
    name: `Golden Gate Sunset`,
    dimensions: [1200, 800],
  },
  "photography/sf/Golden_Gate_Sunset_placeholder_jpg": {
    path: "/photography/sf/Golden%20Gate%20Sunset.placeholder.jpg",
    name: `Golden Gate Sunset.placeholder`,
    dimensions: [600, 400],
  },
  "photography/sf/Golden_Gate_Fog_jpg": {
    path: "/photography/sf/Golden%20Gate%20Fog.jpg",
    name: `Golden Gate Fog`,
    dimensions: [800, 1200],
  },
  "photography/events/Party_jpg": {
    path: "/photography/events/Party.jpg",
    name: `Party`,
    dimensions: [1200, 800],
  },
};
