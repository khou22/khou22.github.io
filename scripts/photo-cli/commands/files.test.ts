/** @jest-environment node */
import fs from "fs";
import path from "path";
import { runCli } from "../cli";
import { generateAssetMap } from "../lib/assetMap";
import { confirm } from "../lib/prompt";
import {
  ALPHA,
  captureOutput,
  dbState,
  Fixture,
  PARTY,
  setupFixture,
  SUNSET,
  teardownFixture,
} from "../__fixtures__/setup";

jest.mock("@/utils/cdn/cdnAssets.generated", () =>
  jest.requireActual("../__fixtures__/assetMap"),
);
jest.mock("../lib/assetMap");
jest.mock("../lib/prompt");
const mockConfirm = confirm as jest.MockedFunction<typeof confirm>;

let fixture: Fixture;
let output: ReturnType<typeof captureOutput>;
const photo = (rel: string) => path.join(fixture.docs, "photography", rel);

beforeEach(async () => {
  jest.mocked(generateAssetMap).mockReset();
  mockConfirm.mockReset().mockResolvedValue(false);
  fixture = await setupFixture();
  output = captureOutput();
});
afterEach(async () => {
  output.restore();
  await teardownFixture(fixture);
});

describe("move", () => {
  const NEW_ID = "photography/sf/bridges/Golden_Gate_Dusk_jpg";

  it("moves the photo and thumbnail, renames DB rows, and regenerates assets", async () => {
    const before = await dbState();
    expect(
      await runCli([
        "move",
        "sunset",
        "docs/photography/sf/bridges/Golden Gate Dusk.jpg",
      ]),
    ).toBe(0);

    expect(fs.existsSync(photo("sf/Golden Gate Sunset.jpg"))).toBe(false);
    expect(fs.existsSync(photo("sf/Golden Gate Sunset.placeholder.jpg"))).toBe(
      false,
    );
    expect(fs.existsSync(photo("sf/bridges/Golden Gate Dusk.jpg"))).toBe(true);
    expect(
      fs.existsSync(photo("sf/bridges/Golden Gate Dusk.placeholder.jpg")),
    ).toBe(true);

    const after = await dbState();
    expect(after.tagsFor(NEW_ID)).toEqual(before.tagsFor(SUNSET));
    expect(after.ratingFor(NEW_ID)).toBe(3);
    expect(after.tagsFor(SUNSET)).toEqual([]);
    expect(after.ratingFor(SUNSET)).toBeNull();

    expect(generateAssetMap).toHaveBeenCalledTimes(1);
    expect(output.stdout()).toContain(`-> ${NEW_ID}`);
  });

  it("works without a thumbnail and with --no-regen", async () => {
    expect(
      await runCli([
        "move",
        PARTY,
        "/photography/Party Time.jpg",
        "--no-regen",
      ]),
    ).toBe(0);
    expect(fs.existsSync(photo("Party Time.jpg"))).toBe(true);
    expect(generateAssetMap).not.toHaveBeenCalled();
  });

  it.each([
    [["move", ALPHA], /exactly a photo and a destination/],
    [["move", ALPHA, "a.jpg", "b.jpg"], /exactly a photo and a destination/],
    [["move", ALPHA, "photography/Alpha.png"], /\.jpg or \.jpeg/],
    [["move", ALPHA, "blog/Alpha.jpg"], /must start with photography/],
    [["move", ALPHA, "photography/sf/Golden Gate Fog.jpg"], /already exists/],
  ])("rejects %p", async (args, message) => {
    expect(await runCli(args)).toBe(1);
    expect(output.stderr()).toMatch(message);
    expect(fs.existsSync(photo("Alpha.jpg"))).toBe(true);
    expect(generateAssetMap).not.toHaveBeenCalled();
  });

  it("rejects destinations that already exist on disk", async () => {
    fs.writeFileSync(photo("Untracked.jpg"), "");
    expect(await runCli(["move", ALPHA, "photography/Untracked.jpg"])).toBe(1);
    expect(output.stderr()).toMatch(/already exists/);
  });

  it("errors when the source file is missing", async () => {
    fs.rmSync(photo("Alpha.jpg"));
    expect(await runCli(["move", ALPHA, "photography/Beta.jpg"])).toBe(1);
    expect(output.stderr()).toMatch(/Source file is missing/);
  });
});

describe("delete", () => {
  it("aborts when not confirmed", async () => {
    expect(await runCli(["delete", ALPHA])).toBe(0);
    expect(mockConfirm).toHaveBeenCalled();
    expect(output.stdout()).toContain("Aborted");
    expect(fs.existsSync(photo("Alpha.jpg"))).toBe(true);
    expect((await dbState()).ratingFor(ALPHA)).toBe(5);
  });

  it("deletes after confirmation", async () => {
    mockConfirm.mockResolvedValue(true);
    expect(await runCli(["delete", ALPHA])).toBe(0);
    expect(fs.existsSync(photo("Alpha.jpg"))).toBe(false);
    expect(fs.existsSync(photo("Alpha.placeholder.jpg"))).toBe(false);
    expect(generateAssetMap).toHaveBeenCalledTimes(1);
  });

  it("deletes multiple photos with --yes, including files and DB rows", async () => {
    expect(
      await runCli(["delete", "--yes", ALPHA, SUNSET, PARTY, "--no-regen"]),
    ).toBe(0);
    expect(mockConfirm).not.toHaveBeenCalled();
    for (const file of [
      "Alpha.jpg",
      "Alpha.placeholder.jpg",
      "sf/Golden Gate Sunset.jpg",
      "sf/Golden Gate Sunset.placeholder.jpg",
      "events/Party.jpg",
    ]) {
      expect(fs.existsSync(photo(file))).toBe(false);
    }
    const state = await dbState();
    expect(state.tagsFor(ALPHA)).toEqual([]);
    expect(state.tagsFor(SUNSET)).toEqual([]);
    expect(state.ratingFor(ALPHA)).toBeNull();
    expect(fs.existsSync(photo("sf/Golden Gate Fog.jpg"))).toBe(true);
    expect(generateAssetMap).not.toHaveBeenCalled();
  });

  it("requires a valid photo", async () => {
    expect(await runCli(["delete", "--yes", "nope"])).toBe(1);
    expect(await runCli(["delete", "--yes"])).toBe(1);
  });
});
