/** @jest-environment node */
import fs from "fs";
import path from "path";
import {
  captureOutput,
  Fixture,
  setupFixture,
  teardownFixture,
  writeJpeg,
} from "../__fixtures__/setup";
import {
  cleanImages,
  collectJpegs,
  dimensions,
  generateThumbnails,
  humanBytes,
  isPlaceholder,
  resizeJpeg,
  thumbnailPathFor,
} from "./imaging";

jest.mock("@/utils/cdn/cdnAssets.generated", () =>
  jest.requireActual("../__fixtures__/assetMap"),
);

let fixture: Fixture;
let output: ReturnType<typeof captureOutput>;
const photo = (rel: string) => path.join(fixture.docs, "photography", rel);
const size = (file: string) => fs.statSync(file).size;

beforeEach(async () => {
  fixture = await setupFixture();
  output = captureOutput();
});
afterEach(async () => {
  output.restore();
  await teardownFixture(fixture);
});

describe("helpers", () => {
  it("builds thumbnail paths", () => {
    expect(thumbnailPathFor("/a/B c.jpg")).toBe("/a/B c.placeholder.jpg");
    expect(thumbnailPathFor("/a/b.jpeg")).toBe("/a/b.placeholder.jpeg");
    expect(thumbnailPathFor("/a/b.JPG")).toBe("/a/b.placeholder.JPG");
  });

  it("detects placeholders", () => {
    expect(isPlaceholder("a.placeholder.jpg")).toBe(true);
    expect(isPlaceholder("a.placeholder.jpeg")).toBe(true);
    expect(isPlaceholder("a.jpg")).toBe(false);
  });

  it("formats bytes", () => {
    expect(humanBytes(512)).toBe("512.00 B");
    expect(humanBytes(2048)).toBe("2.00 KB");
    expect(humanBytes(5 * 1024 * 1024)).toBe("5.00 MB");
  });
});

describe("collectJpegs", () => {
  it("recursively finds sorted JPEGs, skipping other files", async () => {
    fs.writeFileSync(photo("notes.txt"), "hi");
    const files = collectJpegs([fixture.docs], { includePlaceholders: false });
    expect(files.map((f) => path.relative(fixture.docs, f))).toEqual([
      "photography/Alpha.jpg",
      "photography/events/Party.jpg",
      "photography/sf/Golden Gate Fog.jpg",
      "photography/sf/Golden Gate Sunset.jpg",
    ]);
  });

  it("optionally includes placeholders", () => {
    expect(
      collectJpegs([photo("sf")], { includePlaceholders: true }),
    ).toHaveLength(3);
  });

  it("accepts individual files", () => {
    expect(
      collectJpegs([photo("Alpha.jpg")], { includePlaceholders: false }),
    ).toEqual([photo("Alpha.jpg")]);
  });

  it("errors on missing paths", () => {
    expect(() =>
      collectJpegs([photo("missing")], { includePlaceholders: false }),
    ).toThrow(/No such file/);
  });
});

describe("resizeJpeg", () => {
  it("fits within bounds and writes to dest", async () => {
    const dest = path.join(fixture.root, "out.jpg");
    const buffer = await resizeJpeg(photo("Alpha.jpg"), dest, {
      width: 60,
      height: 60,
      quality: 80,
    });
    expect(await dimensions(dest)).toEqual({ width: 60, height: 40 });
    expect(buffer.length).toBe(size(dest));
  });

  it("never enlarges", async () => {
    const dest = path.join(fixture.root, "out.jpg");
    await resizeJpeg(photo("Alpha.jpg"), dest, { width: 5000, quality: 80 });
    expect(await dimensions(dest)).toEqual({ width: 120, height: 80 });
  });

  it("bakes in EXIF orientation", async () => {
    const src = path.join(fixture.root, "rotated.jpg");
    await writeJpeg(src, { width: 120, height: 80 });
    fs.writeFileSync(
      src,
      await (await import("sharp"))
        .default(src)
        .withMetadata({ orientation: 6 })
        .toBuffer(),
    );
    const dest = path.join(fixture.root, "out.jpg");
    await resizeJpeg(src, dest, { width: 1000, quality: 80 });
    expect(await dimensions(dest)).toEqual({ width: 80, height: 120 });
  });
});

describe("cleanImages", () => {
  const big = () => photo("Big.jpg");
  beforeEach(() =>
    writeJpeg(big(), { width: 600, height: 400, quality: 100, noise: true }),
  );

  it("only reports in a dry run", async () => {
    const before = size(big());
    const stats = await cleanImages({
      targets: [],
      maxKb: 50,
      quality: 75,
      dryRun: true,
    });
    expect(stats).toMatchObject({ oversized: 1, compressed: 0, scanned: 7 });
    expect(size(big())).toBe(before);
    expect(output.stdout()).toMatch(/Big\.jpg/);
    expect(output.stdout()).toMatch(/--no-dry-run/);
  });

  it("compresses oversized images", async () => {
    const before = size(big());
    const stats = await cleanImages({
      targets: [photo("")],
      maxKb: 50,
      quality: 75,
      dryRun: false,
    });
    expect(stats.compressed).toBe(1);
    expect(size(big())).toBeLessThan(before);
    expect(stats.bytesSaved).toBe(before - size(big()));
    expect(await dimensions(big())).toEqual({ width: 600, height: 400 });
  });

  it("caps height at 3000px but allows wide panoramas", async () => {
    const tall = photo("Tall.jpg");
    const pano = photo("Pano.jpg");
    await writeJpeg(tall, { width: 2000, height: 4000, quality: 100 });
    await writeJpeg(pano, { width: 9000, height: 1000, quality: 100 });
    await cleanImages({
      targets: [tall, pano],
      maxKb: 1,
      quality: 75,
      dryRun: false,
    });
    expect(await dimensions(tall)).toEqual({ width: 1500, height: 3000 });
    expect(await dimensions(pano)).toEqual({ width: 9000, height: 1000 });
  });

  it("leaves files alone when re-encoding would not shrink them", async () => {
    const small = photo("Small.jpg");
    await writeJpeg(small, {
      width: 600,
      height: 400,
      quality: 20,
      noise: true,
    });
    const before = fs.readFileSync(small);
    const stats = await cleanImages({
      targets: [small],
      maxKb: 1,
      quality: 100,
      dryRun: false,
    });
    expect(stats).toMatchObject({ oversized: 1, unchanged: 1, compressed: 0 });
    expect(fs.readFileSync(small).equals(before)).toBe(true);
  });

  it("skips images under the limit", async () => {
    const stats = await cleanImages({
      targets: [photo("Alpha.jpg")],
      maxKb: 2100,
      quality: 75,
      dryRun: false,
    });
    expect(stats).toMatchObject({ scanned: 1, oversized: 0 });
  });
});

describe("generateThumbnails", () => {
  const options = {
    targets: [] as string[],
    maxKb: 250,
    size: 50,
    quality: 75,
    force: false,
    dryRun: false,
  };

  it("generates only missing thumbnails", async () => {
    const stats = await generateThumbnails(options);
    expect(stats).toMatchObject({ total: 4, generated: 2, skipped: 2 });
    expect(await dimensions(photo("events/Party.placeholder.jpg"))).toEqual({
      width: 50,
      height: 33,
    });
    expect(
      await dimensions(photo("sf/Golden Gate Fog.placeholder.jpg")),
    ).toEqual({ width: 33, height: 50 });
  });

  it("does not write in a dry run", async () => {
    const stats = await generateThumbnails({ ...options, dryRun: true });
    expect(stats).toMatchObject({ pending: 2, generated: 0 });
    expect(fs.existsSync(photo("events/Party.placeholder.jpg"))).toBe(false);
    expect(output.stdout()).toMatch(/\[dry run\].*Party\.jpg/);
  });

  it("regenerates oversized thumbnails", async () => {
    await writeJpeg(photo("Alpha.placeholder.jpg"), {
      width: 600,
      height: 400,
      quality: 100,
      noise: true,
    });
    const stats = await generateThumbnails({ ...options, maxKb: 10 });
    expect(stats).toMatchObject({ oversized: 1, generated: 3, skipped: 1 });
    expect(await dimensions(photo("Alpha.placeholder.jpg"))).toEqual({
      width: 50,
      height: 33,
    });
  });

  it("regenerates everything with force", async () => {
    const stats = await generateThumbnails({
      ...options,
      targets: [photo("sf")],
      force: true,
    });
    expect(stats).toMatchObject({ total: 2, generated: 2, skipped: 0 });
  });
});
