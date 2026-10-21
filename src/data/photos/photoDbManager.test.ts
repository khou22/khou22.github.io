/** @jest-environment node */
import fs from "fs";
import os from "os";
import path from "path";
import {
  addPhotoTags,
  clearPhotoRating,
  connectToPhotoDb,
  deletePhoto,
  getAllPhotoIdsInDb,
  getAllPhotoTagsInDb,
  getMetadataByPhotoID,
  getPhotosWithTag,
  getPhotosWithTags,
  getTagsForPhotoID,
  removePhotoTags,
  renamePhotoID,
  setPhotoRating,
} from "./photoDbManager";
import { PhotoTags } from "@/constants/photoTags/photoTags";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";

const A = "photography/A_jpg" as PhotoIdType;
const B = "photography/B_jpg" as PhotoIdType;
const C = "photography/C_jpg" as PhotoIdType;

let dir: string;
beforeEach(async () => {
  dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "photo-db-"));
  process.env.PHOTO_DB_PATH = path.join(dir, "test.sqlite");
});
afterEach(async () => {
  delete process.env.PHOTO_DB_PATH;
  await fs.promises.rm(dir, { recursive: true, force: true });
});

it("creates the schema in the PHOTO_DB_PATH database", async () => {
  const db = await connectToPhotoDb();
  const tables = await db.all<{ name: string }[]>(
    `SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name`,
  );
  await db.close();
  expect(tables.map((t) => t.name)).toEqual(["photo_metadata", "photo_tags"]);
  expect(fs.existsSync(process.env.PHOTO_DB_PATH!)).toBe(true);
});

describe("tags", () => {
  it("adds tags idempotently", async () => {
    await addPhotoTags(A, [PhotoTags.Landscape, PhotoTags.Tahoe]);
    await addPhotoTags(A, [PhotoTags.Landscape]);
    expect((await getTagsForPhotoID(A)).sort()).toEqual([
      PhotoTags.Landscape,
      PhotoTags.Tahoe,
    ]);
  });

  it("removes only the given tags from the given photo", async () => {
    await addPhotoTags(A, [PhotoTags.Landscape, PhotoTags.Tahoe]);
    await addPhotoTags(B, [PhotoTags.Landscape]);
    await removePhotoTags(A, [PhotoTags.Landscape, PhotoTags.Drone]);
    expect(await getTagsForPhotoID(A)).toEqual([PhotoTags.Tahoe]);
    expect(await getTagsForPhotoID(B)).toEqual([PhotoTags.Landscape]);
  });

  it("no-ops on empty lists", async () => {
    await addPhotoTags(A, []);
    await removePhotoTags(A, []);
    expect(await getTagsForPhotoID(A)).toEqual([]);
  });
});

describe("ratings", () => {
  it("sets, overwrites, and clears ratings", async () => {
    await setPhotoRating(A, 3);
    await setPhotoRating(A, 5);
    expect((await getMetadataByPhotoID())[A]?.rating).toBe(5);
    await clearPhotoRating(A);
    expect((await getMetadataByPhotoID())[A]).toBeUndefined();
  });
});

describe("getMetadataByPhotoID", () => {
  it("joins tags and ratings, including photos with only a rating", async () => {
    await addPhotoTags(A, [PhotoTags.City]);
    await setPhotoRating(A, 4);
    await addPhotoTags(B, [PhotoTags.Food]);
    await setPhotoRating(C, 2);
    expect(await getMetadataByPhotoID()).toEqual({
      [A]: { tags: [PhotoTags.City], rating: 4 },
      [B]: { tags: [PhotoTags.Food], rating: null },
      [C]: { tags: [], rating: 2 },
    });
  });
});

describe("queries", () => {
  beforeEach(async () => {
    await addPhotoTags(A, [PhotoTags.City, PhotoTags.SanFrancisco]);
    await addPhotoTags(B, [PhotoTags.City]);
    await addPhotoTags(C, [PhotoTags.City, PhotoTags.SanFrancisco]);
    await setPhotoRating(A, 2);
    await setPhotoRating(C, 5);
  });

  it("getPhotosWithTag sorts by rating", async () => {
    expect(await getPhotosWithTag(PhotoTags.City)).toEqual([C, A, B]);
  });

  it("getPhotosWithTags requires every tag", async () => {
    expect(
      await getPhotosWithTags([PhotoTags.City, PhotoTags.SanFrancisco]),
    ).toEqual([A, C]);
  });

  it("lists all IDs and tags", async () => {
    expect(Array.from(await getAllPhotoIdsInDb()).sort()).toEqual([A, B, C]);
    expect(Array.from(await getAllPhotoTagsInDb())).toEqual([
      PhotoTags.City,
      PhotoTags.SanFrancisco,
    ]);
  });

  it("renames tags and ratings", async () => {
    const D = "photography/D_jpg";
    expect(await renamePhotoID(A, D)).toBe(2);
    expect(await getTagsForPhotoID(A)).toEqual([]);
    expect((await getMetadataByPhotoID())[D as PhotoIdType]).toEqual({
      tags: [PhotoTags.City, PhotoTags.SanFrancisco],
      rating: 2,
    });
  });

  it("deletes tags and ratings", async () => {
    await deletePhoto(C);
    expect(await getTagsForPhotoID(C)).toEqual([]);
    expect((await getMetadataByPhotoID())[C]).toBeUndefined();
    expect(await getTagsForPhotoID(A)).toHaveLength(2);
  });
});
