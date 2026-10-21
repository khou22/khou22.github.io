/** @jest-environment node */
import {
  ALPHA,
  FOG,
  Fixture,
  PARTY,
  setupFixture,
  SUNSET,
  teardownFixture,
} from "../__fixtures__/setup";
import {
  filterPhotos,
  formatPhoto,
  formatPhotoRow,
  loadPhotos,
  loadPhotosByID,
  PhotoRecord,
  stars,
} from "./catalog";
import { PhotoTags } from "@/constants/photoTags/photoTags";

jest.mock("@/utils/cdn/cdnAssets.generated", () =>
  jest.requireActual("../__fixtures__/assetMap"),
);

let fixture: Fixture;
let photos: PhotoRecord[];
beforeEach(async () => {
  fixture = await setupFixture();
  photos = await loadPhotos();
});
afterEach(() => teardownFixture(fixture));

const ids = (records: PhotoRecord[]) => records.map((photo) => photo.id);

describe("loadPhotos", () => {
  it("joins every photo (excluding thumbnails) with its metadata", () => {
    expect(ids(photos)).toEqual([ALPHA, PARTY, FOG, SUNSET]);
    expect(photos.find((p) => p.id === ALPHA)).toEqual({
      id: ALPHA,
      name: "Alpha",
      path: "/photography/Alpha.jpg",
      rating: 5,
      forSale: true,
      categories: [PhotoTags.Landscape],
      location: PhotoTags.SanFrancisco,
      tags: [PhotoTags.Landscape, PhotoTags.SanFrancisco, PhotoTags.Featured],
    });
  });

  it("decodes paths and marks not-for-sale photos", () => {
    const sunset = photos.find((p) => p.id === SUNSET);
    expect(sunset?.path).toBe("/photography/sf/Golden Gate Sunset.jpg");
    expect(sunset?.forSale).toBe(false);
  });

  it("keeps ratings for photos without tags", () => {
    expect(photos.find((p) => p.id === FOG)?.rating).toBe(2);
  });

  it("defaults photos with no metadata", () => {
    expect(photos.find((p) => p.id === PARTY)).toMatchObject({
      rating: null,
      forSale: true,
      tags: [],
      categories: [],
      location: null,
    });
  });

  it("loadPhotosByID filters to the given IDs", async () => {
    expect(ids(await loadPhotosByID([SUNSET, PARTY]))).toEqual([PARTY, SUNSET]);
  });
});

describe("filterPhotos", () => {
  it.each([
    ["no filter", {}, [ALPHA, PARTY, FOG, SUNSET]],
    ["query on ID", { query: "events/" }, [PARTY]],
    [
      "query on name (case-insensitive)",
      { query: "GOLDEN gate" },
      [FOG, SUNSET],
    ],
    ["subdir", { subdir: "sf" }, [FOG, SUNSET]],
    ["subdir with slashes", { subdir: "/sf/" }, [FOG, SUNSET]],
    [
      "withTags (AND)",
      { withTags: [PhotoTags.SanFrancisco, PhotoTags.City] },
      [SUNSET],
    ],
    ["withoutTags", { withoutTags: [PhotoTags.SanFrancisco] }, [PARTY, FOG]],
    ["untagged", { untagged: true }, [PARTY, FOG]],
    ["noCategory", { noCategory: true }, [PARTY, FOG]],
    ["noLocation", { noLocation: true }, [PARTY, FOG]],
    ["forSale", { forSale: true }, [ALPHA, PARTY, FOG]],
    ["notForSale", { notForSale: true }, [SUNSET]],
    ["unrated", { unrated: true }, [PARTY]],
    ["minRating", { minRating: 3 }, [ALPHA, SUNSET]],
    ["minRating 0 excludes unrated", { minRating: 0 }, [ALPHA, FOG, SUNSET]],
    ["combined", { subdir: "sf", minRating: 3 }, [SUNSET]],
  ])("%s", (_label, filter, expected) => {
    expect(ids(filterPhotos(photos, filter))).toEqual(expected);
  });
});

describe("formatting", () => {
  it("renders stars", () => {
    expect(stars(null)).toBe("unrated");
    expect(stars(0)).toBe("☆☆☆☆☆");
    expect(stars(3)).toBe("★★★☆☆");
  });

  it("formats a list row with tag labels and a for-sale marker", () => {
    const alpha = photos.find((p) => p.id === ALPHA)!;
    const sunset = photos.find((p) => p.id === SUNSET)!;
    const party = photos.find((p) => p.id === PARTY)!;
    expect(formatPhotoRow(alpha)).toBe(
      `★★★★★    $ ${ALPHA}  [Landscape, San Francisco, Featured]`,
    );
    expect(formatPhotoRow(sunset)).toBe(
      `★★★☆☆      ${SUNSET}  [City, San Francisco]`,
    );
    expect(formatPhotoRow(party)).toBe(`unrated  $ ${PARTY}`);
  });

  it("formats the detail view", () => {
    expect(formatPhoto(photos.find((p) => p.id === SUNSET)!))
      .toBe(`Golden Gate Sunset
  ID:         ${SUNSET}
  Path:       docs/photography/sf/Golden Gate Sunset.jpg
  Rating:     ★★★☆☆
  For Sale:   no
  Categories: City
  Location:   San Francisco
  Other:      -`);
  });
});
