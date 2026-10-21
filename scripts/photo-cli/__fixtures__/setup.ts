import fs from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";
import { connectToPhotoDb } from "@/data/photos/photoDbManager";

export const ALPHA = "photography/Alpha_jpg";
export const SUNSET = "photography/sf/Golden_Gate_Sunset_jpg";
export const FOG = "photography/sf/Golden_Gate_Fog_jpg";
export const PARTY = "photography/events/Party_jpg";

/**
 * Write a JPEG. `noise` produces incompressible (large) files.
 */
export const writeJpeg = async (
  file: string,
  {
    width = 120,
    height = 80,
    quality = 80,
    noise = false,
  }: {
    width?: number;
    height?: number;
    quality?: number;
    noise?: boolean;
  } = {},
) => {
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 50, g: 120, b: 200 },
      ...(noise ? { noise: { type: "gaussian", mean: 128, sigma: 60 } } : {}),
    },
  })
    .jpeg({ quality })
    .toFile(file);
};

export type Fixture = { root: string; docs: string; dbPath: string };

/**
 * Create a temp docs/ folder with photos matching `__fixtures__/assetMap.ts`
 * and a seeded temp DB, and point the CLI at them via env vars.
 *
 *   Alpha:              landscape, featured, san francisco, rated 5
 *   Golden Gate Sunset: city, san francisco, not for sale, rated 3
 *   Golden Gate Fog:    no tags, rated 2
 *   Party:              no metadata, no thumbnail
 */
export const setupFixture = async (): Promise<Fixture> => {
  const root = await fs.promises.mkdtemp(path.join(os.tmpdir(), "photo-cli-"));
  const docs = path.join(root, "docs");
  const dbPath = path.join(root, "photo_db.sqlite");
  process.env.PHOTO_DOCS_DIR = docs;
  process.env.PHOTO_DB_PATH = dbPath;

  const photo = (rel: string) => path.join(docs, "photography", rel);
  await writeJpeg(photo("Alpha.jpg"));
  await writeJpeg(photo("Alpha.placeholder.jpg"), { width: 60, height: 40 });
  await writeJpeg(photo("sf/Golden Gate Sunset.jpg"));
  await writeJpeg(photo("sf/Golden Gate Sunset.placeholder.jpg"), {
    width: 60,
    height: 40,
  });
  await writeJpeg(photo("sf/Golden Gate Fog.jpg"), { width: 80, height: 120 });
  await writeJpeg(photo("events/Party.jpg"));

  const db = await connectToPhotoDb();
  const tags: [string, string][] = [
    [ALPHA, "category_landscape"],
    [ALPHA, "other_featured"],
    [ALPHA, "location_san_francisco"],
    [SUNSET, "category_city"],
    [SUNSET, "location_san_francisco"],
    [SUNSET, "store_not_for_sale"],
  ];
  for (const [id, tag] of tags) {
    await db.run(`INSERT INTO photo_tags VALUES (?, ?)`, [id, tag]);
  }
  for (const [id, rating] of [
    [ALPHA, 5],
    [SUNSET, 3],
    [FOG, 2],
  ]) {
    await db.run(`INSERT INTO photo_metadata VALUES (?, ?)`, [id, rating]);
  }
  await db.close();

  return { root, docs, dbPath };
};

export const teardownFixture = async (fixture: Fixture) => {
  delete process.env.PHOTO_DOCS_DIR;
  delete process.env.PHOTO_DB_PATH;
  await fs.promises.rm(fixture.root, { recursive: true, force: true });
};

/**
 * Read all tags/ratings straight from the DB.
 */
export const dbState = async () => {
  const db = await connectToPhotoDb();
  const tags = await db.all<{ photo_id: string; tag_name: string }[]>(
    `SELECT * FROM photo_tags ORDER BY photo_id, tag_name`,
  );
  const ratings = await db.all<{ photo_id: string; rating: number }[]>(
    `SELECT * FROM photo_metadata ORDER BY photo_id`,
  );
  await db.close();
  const tagsFor = (id: string) =>
    tags.filter((row) => row.photo_id === id).map((row) => row.tag_name);
  const ratingFor = (id: string) =>
    ratings.find((row) => row.photo_id === id)?.rating ?? null;
  return { tags, ratings, tagsFor, ratingFor };
};

/**
 * Capture console output for the duration of a test.
 */
export const captureOutput = () => {
  const out: string[] = [];
  const err: string[] = [];
  const log = jest
    .spyOn(console, "log")
    .mockImplementation((...args) => void out.push(args.join(" ")));
  const error = jest
    .spyOn(console, "error")
    .mockImplementation((...args) => void err.push(args.join(" ")));
  return {
    stdout: () => out.join("\n"),
    stderr: () => err.join("\n"),
    restore: () => {
      log.mockRestore();
      error.mockRestore();
    },
  };
};
