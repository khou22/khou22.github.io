/** @jest-environment node */
import { ALPHA, FOG, SUNSET } from "../__fixtures__/setup";
import { CliError } from "./errors";
import {
  resolvePhotoID,
  resolvePhotoIDs,
  resolveTag,
  resolveTags,
  tagGroup,
  tagLabel,
} from "./resolve";
import { PhotoTags } from "@/constants/photoTags/photoTags";

jest.mock("@/utils/cdn/cdnAssets.generated", () =>
  jest.requireActual("../__fixtures__/assetMap"),
);

describe("resolvePhotoID", () => {
  it.each([
    ["an exact ID", SUNSET],
    ["a docs/ path", "docs/photography/sf/Golden Gate Sunset.jpg"],
    ["a ./docs/ path", "./docs/photography/sf/Golden Gate Sunset.jpg"],
    ["a path relative to docs/", "photography/sf/Golden Gate Sunset.jpg"],
    ["a path relative to photography/", "sf/Golden Gate Sunset.jpg"],
    ["a file name", "Golden Gate Sunset.jpg"],
    ["a file name without extension", "Golden Gate Sunset"],
    ["a unique substring", "sunset"],
  ])("resolves %s", (_label, input) => {
    expect(resolvePhotoID(input)).toBe(SUNSET);
  });

  it("does not resolve thumbnails by file name", () => {
    expect(resolvePhotoID("Alpha")).toBe(ALPHA);
  });

  it("lists candidates for ambiguous input", () => {
    expect(() => resolvePhotoID("golden gate")).toThrow(
      /matches 2 photos[\s\S]*Golden_Gate_Fog_jpg[\s\S]*Golden_Gate_Sunset_jpg/,
    );
  });

  it("suggests regenerating assets for unknown photos", () => {
    expect(() => resolvePhotoID("Nope")).toThrow(/pnpm photos assets/);
    expect(() => resolvePhotoID("Nope")).toThrow(CliError);
  });
});

describe("resolvePhotoIDs", () => {
  it("dedupes", () => {
    expect(resolvePhotoIDs([SUNSET, "sunset", "fog"])).toEqual([SUNSET, FOG]);
  });
  it("requires at least one photo", () => {
    expect(() => resolvePhotoIDs([])).toThrow(/at least one photo/);
  });
});

describe("resolveTag", () => {
  it.each([
    ["category_landscape", PhotoTags.Landscape],
    ["Landscape", PhotoTags.Landscape],
    ["LANDSCAPE", PhotoTags.Landscape],
    ["san-francisco", PhotoTags.SanFrancisco],
    ["San Francisco", PhotoTags.SanFrancisco],
    ["SanFrancisco", PhotoTags.SanFrancisco],
    ["san_francisco", PhotoTags.SanFrancisco],
    ["drone", PhotoTags.Drone],
    ["aerial", PhotoTags.Drone],
    ["sports", PhotoTags.Cycling],
    ["yosemite", PhotoTags.Yosemite],
    ["not-for-sale", PhotoTags.NotForSale],
  ])("resolves %p", (input, tag) => {
    expect(resolveTag(input)).toBe(tag);
  });

  it("restricts to a prefix", () => {
    expect(resolveTag("landscape", "category_")).toBe(PhotoTags.Landscape);
    expect(() => resolveTag("drone", "category_")).toThrow(/Unknown tag/);
  });

  it("rejects unknown tags", () => {
    expect(() => resolveTag("bogus")).toThrow(/pnpm photos tags/);
  });
});

describe("resolveTags", () => {
  it("splits commas, trims, and dedupes", () => {
    expect(resolveTags(["landscape, city", "city", ""])).toEqual([
      PhotoTags.Landscape,
      PhotoTags.City,
    ]);
    expect(resolveTags([])).toEqual([]);
  });
});

describe("tag helpers", () => {
  it("groups by prefix", () => {
    expect(tagGroup(PhotoTags.Tahoe)).toBe("location");
    expect(tagGroup(PhotoTags.NotForSale)).toBe("store");
  });
  it("labels with tag metadata names", () => {
    expect(tagLabel(PhotoTags.Drone)).toBe("Aerial");
    expect(tagLabel("unknown_tag")).toBe("unknown_tag");
  });
});
