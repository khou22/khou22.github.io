/** @jest-environment node */
import { runCli } from "../cli";
import {
  ALPHA,
  captureOutput,
  dbState,
  Fixture,
  FOG,
  PARTY,
  setupFixture,
  SUNSET,
  teardownFixture,
} from "../__fixtures__/setup";

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

const tagsFor = async (id: string) => (await dbState()).tagsFor(id);

describe("tag", () => {
  it("adds and removes tags on multiple photos", async () => {
    expect(
      await runCli([
        "tag",
        PARTY,
        "fog",
        "--add",
        "drone,events",
        "--add",
        "featured",
      ]),
    ).toBe(0);
    for (const id of [PARTY, FOG]) {
      expect(await tagsFor(id)).toEqual([
        "camera_drone",
        "category_events",
        "other_featured",
      ]);
    }
    expect(
      await runCli(["tag", PARTY, "--remove", "drone", "-r", "featured"]),
    ).toBe(0);
    expect(await tagsFor(PARTY)).toEqual(["category_events"]);
  });

  it("is idempotent", async () => {
    expect(await runCli(["tag", ALPHA, "--add", "featured"])).toBe(0);
    expect(await runCli(["tag", PARTY, "--remove", "featured"])).toBe(0);
    expect(await tagsFor(ALPHA)).toContain("other_featured");
    expect(await tagsFor(PARTY)).toEqual([]);
  });

  it("prints the updated photo", async () => {
    await runCli(["tag", PARTY, "--add", "events"]);
    expect(output.stdout()).toContain("Categories: Events");
  });

  it("validates input before writing", async () => {
    expect(await runCli(["tag", PARTY])).toBe(1);
    expect(output.stderr()).toMatch(/--add and\/or --remove/);
    expect(await runCli(["tag", PARTY, "--add", "bogus"])).toBe(1);
    expect(await runCli(["tag", "nope", "--add", "events"])).toBe(1);
    expect(await tagsFor(PARTY)).toEqual([]);
  });
});

describe("category", () => {
  it("adds and removes categories", async () => {
    expect(
      await runCli([
        "category",
        ALPHA,
        "--add",
        "city",
        "--remove",
        "landscape",
      ]),
    ).toBe(0);
    expect(await tagsFor(ALPHA)).toEqual([
      "category_city",
      "location_san_francisco",
      "other_featured",
    ]);
  });

  it("--set replaces only categories", async () => {
    expect(await runCli(["category", ALPHA, "--set", "food,product"])).toBe(0);
    expect(await tagsFor(ALPHA)).toEqual([
      "category_food",
      "category_product",
      "location_san_francisco",
      "other_featured",
    ]);
  });

  it("--set '' clears categories", async () => {
    expect(await runCli(["category", ALPHA, SUNSET, "--set", ""])).toBe(0);
    expect(await tagsFor(ALPHA)).toEqual([
      "location_san_francisco",
      "other_featured",
    ]);
    expect(await tagsFor(SUNSET)).toEqual([
      "location_san_francisco",
      "store_not_for_sale",
    ]);
  });

  it("rejects non-category tags", async () => {
    expect(await runCli(["category", ALPHA, "--add", "drone"])).toBe(1);
    expect(await runCli(["category", ALPHA])).toBe(1);
  });
});

describe("location", () => {
  it("replaces the existing location", async () => {
    expect(await runCli(["location", "tahoe", ALPHA, PARTY])).toBe(0);
    expect(await tagsFor(ALPHA)).toEqual([
      "category_landscape",
      "location_tahoe",
      "other_featured",
    ]);
    expect(await tagsFor(PARTY)).toEqual(["location_tahoe"]);
    expect(output.stdout()).toContain("Location:   Tahoe");
  });

  it("keeps the location when set to the same value", async () => {
    expect(await runCli(["location", "san-francisco", ALPHA])).toBe(0);
    expect(await tagsFor(ALPHA)).toContain("location_san_francisco");
  });

  it.each(["none", "clear"])("clears with %s", async (value) => {
    expect(await runCli(["location", value, ALPHA])).toBe(0);
    expect(await tagsFor(ALPHA)).toEqual([
      "category_landscape",
      "other_featured",
    ]);
  });

  it("rejects non-location tags and missing args", async () => {
    expect(await runCli(["location", "landscape", ALPHA])).toBe(1);
    expect(await runCli(["location"])).toBe(1);
    expect(await runCli(["location", "tahoe"])).toBe(1);
  });
});

describe("sell", () => {
  it("toggles the not-for-sale tag", async () => {
    expect(await runCli(["sell", "off", ALPHA])).toBe(0);
    expect(await tagsFor(ALPHA)).toContain("store_not_for_sale");
    expect(output.stdout()).toContain("For Sale:   no");

    expect(await runCli(["sell", "on", ALPHA, SUNSET])).toBe(0);
    expect(await tagsFor(ALPHA)).not.toContain("store_not_for_sale");
    expect(await tagsFor(SUNSET)).not.toContain("store_not_for_sale");
  });

  it("rejects invalid values", async () => {
    expect(await runCli(["sell", "maybe", ALPHA])).toBe(1);
    expect(await runCli(["sell", "on"])).toBe(1);
  });
});

describe("rate", () => {
  it("sets ratings on multiple photos", async () => {
    expect(await runCli(["rate", "4", ALPHA, PARTY])).toBe(0);
    const state = await dbState();
    expect(state.ratingFor(ALPHA)).toBe(4);
    expect(state.ratingFor(PARTY)).toBe(4);
    expect(output.stdout()).toContain("Rating:     ★★★★☆");
  });

  it("clears ratings", async () => {
    expect(await runCli(["rate", "clear", FOG])).toBe(0);
    expect((await dbState()).ratingFor(FOG)).toBeNull();
  });

  it("rejects invalid ratings", async () => {
    expect(await runCli(["rate", "6", ALPHA])).toBe(1);
    expect(await runCli(["rate"])).toBe(1);
    expect((await dbState()).ratingFor(ALPHA)).toBe(5);
  });
});
