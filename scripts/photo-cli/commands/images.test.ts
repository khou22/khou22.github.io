/** @jest-environment node */
import fs from "fs";
import path from "path";
import { runCli } from "../cli";
import { generateAssetMap } from "../lib/assetMap";
import { dimensions } from "../lib/imaging";
import {
  captureOutput,
  Fixture,
  setupFixture,
  teardownFixture,
  writeJpeg,
} from "../__fixtures__/setup";

jest.mock("@/utils/cdn/cdnAssets.generated", () =>
  jest.requireActual("../__fixtures__/assetMap"),
);
jest.mock("../lib/assetMap");

let fixture: Fixture;
let output: ReturnType<typeof captureOutput>;
const photo = (rel: string) => path.join(fixture.docs, "photography", rel);
const size = (file: string) => fs.statSync(file).size;
const writeBig = (file: string) =>
  writeJpeg(file, { width: 600, height: 400, quality: 100, noise: true });

beforeEach(async () => {
  jest.mocked(generateAssetMap).mockReset();
  fixture = await setupFixture();
  output = captureOutput();
});
afterEach(async () => {
  output.restore();
  await teardownFixture(fixture);
});

describe("clean", () => {
  it("is a dry run by default", async () => {
    await writeBig(photo("Big.jpg"));
    const before = size(photo("Big.jpg"));
    expect(await runCli(["clean", "--max-kb", "50"])).toBe(0);
    expect(size(photo("Big.jpg"))).toBe(before);
    expect(output.stdout()).toMatch(/Image Cleaning \(dry run\)/);
  });

  it("compresses with --no-dry-run, scoped to the given paths", async () => {
    await writeBig(photo("Big.jpg"));
    await writeBig(photo("sf/Other.jpg"));
    const before = size(photo("sf/Other.jpg"));
    expect(
      await runCli([
        "clean",
        photo("Big.jpg"),
        "--max-kb",
        "50",
        "--quality",
        "60",
        "--no-dry-run",
      ]),
    ).toBe(0);
    expect(size(photo("Big.jpg"))).toBeLessThan(before);
    expect(size(photo("sf/Other.jpg"))).toBe(before);
  });

  it("validates numeric options", async () => {
    expect(await runCli(["clean", "--max-kb", "big"])).toBe(1);
    expect(output.stderr()).toMatch(/--max-kb must be a positive number/);
  });
});

describe("thumbnails", () => {
  it("is a dry run by default", async () => {
    expect(await runCli(["thumbnails"])).toBe(0);
    expect(fs.existsSync(photo("events/Party.placeholder.jpg"))).toBe(false);
  });

  it("generates missing thumbnails at the given size", async () => {
    expect(await runCli(["thumbnails", "--size", "40", "--no-dry-run"])).toBe(
      0,
    );
    expect(await dimensions(photo("events/Party.placeholder.jpg"))).toEqual({
      width: 40,
      height: 27,
    });
    // Existing thumbnail is untouched.
    expect(await dimensions(photo("Alpha.placeholder.jpg"))).toEqual({
      width: 60,
      height: 40,
    });
  });

  it("regenerates existing thumbnails with --force", async () => {
    expect(
      await runCli([
        "thumbnails",
        photo("Alpha.jpg"),
        "--size",
        "40",
        "--force",
        "--no-dry-run",
      ]),
    ).toBe(0);
    expect(await dimensions(photo("Alpha.placeholder.jpg"))).toEqual({
      width: 40,
      height: 27,
    });
  });
});

describe("resize", () => {
  it("resizes a photo in place by reference", async () => {
    expect(await runCli(["resize", "alpha", "--max", "60"])).toBe(0);
    expect(await dimensions(photo("Alpha.jpg"))).toEqual({
      width: 60,
      height: 40,
    });
    expect(output.stdout()).toMatch(/120x80 -> 60x40/);
  });

  it("resizes files into --out without touching the originals", async () => {
    const out = path.join(fixture.root, "out");
    expect(
      await runCli([
        "resize",
        photo("Alpha.jpg"),
        photo("sf/Golden Gate Fog.jpg"),
        "--height",
        "40",
        "--out",
        out,
      ]),
    ).toBe(0);
    expect(await dimensions(path.join(out, "Alpha.jpg"))).toEqual({
      width: 60,
      height: 40,
    });
    expect(await dimensions(path.join(out, "Golden Gate Fog.jpg"))).toEqual({
      width: 27,
      height: 40,
    });
    expect(await dimensions(photo("Alpha.jpg"))).toEqual({
      width: 120,
      height: 80,
    });
  });

  it("respects --width", async () => {
    expect(await runCli(["resize", "alpha", "--width", "30"])).toBe(0);
    expect(await dimensions(photo("Alpha.jpg"))).toEqual({
      width: 30,
      height: 20,
    });
  });

  it.each([
    [["resize", "alpha"], /--max, --width/],
    [["resize", "--max", "10"], /Expected a file/],
    [["resize", "nope", "--max", "10"], /Unknown photo/],
    [["resize", "alpha", "--max", "0"], /--max must be/],
  ])("rejects %p", async (args, message) => {
    expect(await runCli(args)).toBe(1);
    expect(output.stderr()).toMatch(message);
  });
});

describe("assets", () => {
  it("regenerates the asset map", async () => {
    expect(await runCli(["assets"])).toBe(0);
    expect(generateAssetMap).toHaveBeenCalledTimes(1);
  });
});

describe("ingest", () => {
  it("cleans, regenerates assets, makes thumbnails, and regenerates again", async () => {
    const order: string[] = [];
    jest.mocked(generateAssetMap).mockImplementation(() => {
      order.push(
        fs.existsSync(photo("new/Fresh.placeholder.jpg"))
          ? "assets(with thumbnail)"
          : "assets(no thumbnail)",
      );
    });
    await writeBig(photo("new/Fresh.jpg"));
    const before = size(photo("new/Fresh.jpg"));

    expect(await runCli(["ingest", photo("new"), "--max-kb", "50"])).toBe(0);
    expect(size(photo("new/Fresh.jpg"))).toBeLessThan(before);
    expect(fs.existsSync(photo("new/Fresh.placeholder.jpg"))).toBe(true);
    // Only the given path is processed.
    expect(fs.existsSync(photo("events/Party.placeholder.jpg"))).toBe(false);
    expect(order).toEqual(["assets(no thumbnail)", "assets(with thumbnail)"]);
    expect(output.stdout()).toContain("pnpm photos list --untagged");
  });
});
