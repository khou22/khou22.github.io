/** @jest-environment node */
import { runCli } from "../cli";
import {
  ALPHA,
  captureOutput,
  Fixture,
  FOG,
  PARTY,
  setupFixture,
  SUNSET,
  teardownFixture,
} from "../__fixtures__/setup";
import { PhotoTags } from "@/constants/photoTags/photoTags";

jest.mock("@/utils/cdn/cdnAssets.generated", () =>
  jest.requireActual("../__fixtures__/assetMap"),
);

let fixture: Fixture;
let output: ReturnType<typeof captureOutput>;
beforeEach(async () => {
  fixture = await setupFixture();
  output = captureOutput();
});
afterEach(async () => {
  output.restore();
  await teardownFixture(fixture);
});

const listIDs = async (...args: string[]) => {
  expect(await runCli(["list", "--ids", ...args])).toBe(0);
  return output.stdout().split("\n").filter(Boolean);
};

describe("list", () => {
  it("prints a table with a count", async () => {
    expect(await runCli(["list"])).toBe(0);
    expect(output.stdout()).toContain(
      `★★★★★    $ ${ALPHA}  [Landscape, San Francisco, Featured]`,
    );
    expect(output.stdout().split("\n")).toHaveLength(4);
    expect(output.stderr()).toContain("4 photo(s)");
  });

  it.each([
    [["golden"], [FOG, SUNSET]],
    [["--query", "party"], [PARTY]],
    [
      ["--subdir", "sf"],
      [FOG, SUNSET],
    ],
    [["--tag", "san-francisco", "--tag", "city"], [SUNSET]],
    [["--tag", "san-francisco,featured"], [ALPHA]],
    [
      ["--without-tag", "san-francisco"],
      [PARTY, FOG],
    ],
    [["--untagged"], [PARTY, FOG]],
    [["--no-category"], [PARTY, FOG]],
    [["--no-location"], [PARTY, FOG]],
    [["--for-sale"], [ALPHA, PARTY, FOG]],
    [["--not-for-sale"], [SUNSET]],
    [["--unrated"], [PARTY]],
    [
      ["--min-rating", "3"],
      [ALPHA, SUNSET],
    ],
    [
      ["--limit", "2"],
      [ALPHA, PARTY],
    ],
  ])("filters with %p", async (args, expected) => {
    expect(await listIDs(...args)).toEqual(expected);
  });

  it("outputs JSON", async () => {
    expect(await runCli(["list", "--json", "--subdir", "events"])).toBe(0);
    expect(JSON.parse(output.stdout())).toEqual([
      expect.objectContaining({ id: PARTY, rating: null, forSale: true }),
    ]);
  });

  it("rejects unknown tags", async () => {
    expect(await runCli(["list", "--tag", "sf"])).toBe(1);
    expect(output.stderr()).toMatch(/Unknown tag "sf"/);
  });

  it("validates --min-rating and --limit", async () => {
    expect(await runCli(["list", "--min-rating", "9"])).toBe(1);
    expect(await runCli(["list", "--limit", "x"])).toBe(1);
  });
});

describe("show", () => {
  it("prints metadata and file details", async () => {
    expect(await runCli(["show", "sunset", "party"])).toBe(0);
    const out = output.stdout();
    expect(out).toContain(`ID:         ${SUNSET}`);
    expect(out).toContain("For Sale:   no");
    expect(out).toMatch(/File: {7}120x80, [\d.]+ K?B/);
    expect(out).toMatch(/Golden Gate Sunset[\s\S]*Thumbnail: {2}[\d.]+ K?B/);
    expect(out).toMatch(/Party[\s\S]*Thumbnail: {2}missing/);
  });

  it("reports files missing on disk", async () => {
    const fs = await import("fs");
    fs.rmSync(`${fixture.docs}/photography/Alpha.jpg`);
    expect(await runCli(["show", ALPHA])).toBe(0);
    expect(output.stdout()).toContain("missing on disk");
  });

  it("outputs JSON", async () => {
    expect(await runCli(["show", "--json", ALPHA])).toBe(0);
    expect(JSON.parse(output.stdout())[0]).toMatchObject({
      id: ALPHA,
      rating: 5,
      location: PhotoTags.SanFrancisco,
    });
  });

  it("requires a photo", async () => {
    expect(await runCli(["show"])).toBe(1);
  });
});

describe("tags", () => {
  it("lists every tag grouped with counts", async () => {
    expect(await runCli(["tags"])).toBe(0);
    const out = output.stdout();
    expect(out).toMatch(/CATEGORY[\s\S]*LOCATION[\s\S]*CAMERA[\s\S]*STORE/);
    expect(out).toMatch(/location_san_francisco\s+San Francisco\s+2/);
    expect(out).toMatch(/store_not_for_sale\s+Not for sale\s+1/i);
  });

  it("outputs JSON", async () => {
    expect(await runCli(["tags", "--json"])).toBe(0);
    const rows = JSON.parse(output.stdout());
    expect(rows).toHaveLength(Object.values(PhotoTags).length);
    expect(rows).toContainEqual({
      tag: PhotoTags.Drone,
      key: "Drone",
      name: "Aerial",
      slug: "aerial",
      count: 0,
    });
  });
});

describe("subdirs", () => {
  it("counts photos per directory", async () => {
    expect(await runCli(["subdirs"])).toBe(0);
    expect(output.stdout().split("\n")).toEqual([
      "    1  photography/",
      "    1  photography/events/",
      "    2  photography/sf/",
    ]);
  });
});
