import { PhotoIdType } from "@/utils/cdn/cdnAssets";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { PhotoTags } from "@/constants/photoTags";

// Open a SQLite database, stored in the file db.sqlite
export const connectToPhotoDb = async () => {
  const db = await open({
    filename: path.join(process.cwd(), "src/data/photos/photo_db.sqlite"),
    driver: sqlite3.Database,
  });

  await db.exec(`CREATE TABLE IF NOT EXISTS photo_tags (
    photo_id TEXT NOT NULL,
    tag_name TEXT NOT NULL,
    PRIMARY KEY (photo_id, tag_name)
);`);

  await db.exec(`CREATE TABLE IF NOT EXISTS photo_metadata (
    photo_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    PRIMARY KEY (photo_id)
  )`);

  return db;
};

type PhotoTagRowType = { photo_id: string; tag_name: string };
type PhotoMetadataRowType = { photo_id: string; rating: number };

export const getMetadataByPhotoID = async (): Promise<
  Partial<Record<PhotoIdType, { tags: PhotoTags[]; rating: number | null }>>
> => {
  const db = await connectToPhotoDb();
  const tagRows = await db.all<PhotoTagRowType[]>(
    `SELECT photo_id, tag_name FROM photo_tags`,
  );

  const tagsByPhotoID: Partial<
    Record<PhotoIdType, { tags: PhotoTags[]; rating: number | null }>
  > = {};
  tagRows.forEach((row) => {
    const photoID = row.photo_id as PhotoIdType;
    const tag = row.tag_name as PhotoTags;

    if (tagsByPhotoID[photoID]) {
      tagsByPhotoID[photoID]?.tags.push(tag);
    } else {
      tagsByPhotoID[photoID] = {
        tags: [tag],
        rating: null,
      };
    }
  });

  const metadata = await db.all<PhotoMetadataRowType[]>(
    `SELECT photo_id, rating FROM photo_metadata`,
  );
  metadata.forEach((row) => {
    const photoID = row.photo_id as PhotoIdType;
    const rating = row.rating;
    if (tagsByPhotoID[photoID]) {
      tagsByPhotoID[photoID] = {
        tags: tagsByPhotoID[photoID]?.tags ?? [],
        rating: rating,
      };
    }
  });

  return tagsByPhotoID;
};

/**
 * Get the tags for the given photo ID.
 */
export const getTagsForPhotoID = async (
  photoID: PhotoIdType,
): Promise<PhotoTags[]> => {
  const db = await connectToPhotoDb();
  const rows = await db.all<PhotoTagRowType[]>(
    `SELECT tag_name FROM photo_tags WHERE photo_id = ?`,
    [photoID],
  );
  return rows.map((row) => row.tag_name as PhotoTags);
};

/**
 * Get photo IDs that have the given tag. Sorted in descending order by
 * rating.
 */
export const getPhotosWithTag = async (
  tag: PhotoTags,
): Promise<PhotoIdType[]> => {
  const db = await connectToPhotoDb();
  const rows = await db.all<{ photo_id: string }[]>(
    `SELECT
  DISTINCT photo_tags.photo_id as photo_id
FROM photo_tags
LEFT OUTER JOIN photo_metadata ON photo_tags.photo_id = photo_metadata.photo_id
WHERE
  photo_tags.tag_name = ?
ORDER BY
  photo_metadata.rating DESC,
  photo_tags.photo_id ASC`,
    [tag],
  );
  const photoIDs = rows.map((row) => row.photo_id as PhotoIdType);
  return photoIDs;
};

/**
 * Get photo IDs that have _all_ the given tags.
 */
export const getPhotosWithTags = async (
  tags: PhotoTags[],
): Promise<PhotoIdType[]> => {
  const db = await connectToPhotoDb();

  // Get photo IDs that have all the tags.
  const rows = await db.all<{ photo_id: string; tag_count: number }[]>(
    `SELECT
  photo_id,
  COUNT(DISTINCT tag_name) as tag_count
FROM photo_tags
WHERE
  tag_name IN (${tags.map(() => "?").join(", ")})
GROUP BY
  photo_id
HAVING
  COUNT(DISTINCT tag_name) = ?
ORDER BY
  photo_id ASC`,
    ...tags,
    tags.length,
  );

  const photoIDs = rows.map((row) => row.photo_id as PhotoIdType);
  return photoIDs;
};

/**
 * Set the rating for the given photo ID.
 */
export const setPhotoRating = async (
  photoID: PhotoIdType,
  rating: number | null,
): Promise<void> => {
  const db = await connectToPhotoDb();
  await db.run(
    `INSERT OR REPLACE INTO photo_metadata (photo_id, rating) VALUES (?, ?)`,
    [photoID, rating],
  );
};

/**
 * Execute a rename for a photo ID. Updates the `photo_tags` table.
 */
export const renamePhotoID = async (
  original: PhotoIdType,
  destination: string,
): Promise<number> => {
  const db = await connectToPhotoDb();

  // Update the photo_tags table.
  const tx = await db.run(
    `UPDATE photo_tags
SET photo_id = ?
WHERE photo_id = ?`,
    destination,
    original,
  );
  if (tx.changes === undefined) {
    throw new Error("transaction changes are undefined");
  }

  // Update the photo_metadata table.
  const tx2 = await db.run(
    `UPDATE photo_metadata
SET photo_id = ?
WHERE photo_id = ?`,
    destination,
    original,
  );
  if (tx2.changes === undefined) {
    throw new Error("transaction changes are undefined");
  }

  return tx.changes;
};

export const deletePhoto = async (photoID: PhotoIdType): Promise<void> => {
  const db = await connectToPhotoDb();
  await db.run(`DELETE FROM photo_tags WHERE photo_id = ?`, [photoID]);
  await db.run(`DELETE FROM photo_metadata WHERE photo_id = ?`, [photoID]);
};

/**
 * Get all the photo IDs in the database.
 */
export const getAllPhotoIdsInDb = async (): Promise<Set<PhotoIdType>> => {
  const db = await connectToPhotoDb();
  const photoIDs = new Set<PhotoIdType>();
  const tagRows = await db.all<{ photo_id: string }[]>(
    `SELECT DISTINCT photo_id FROM photo_tags ORDER BY photo_id ASC`,
  );
  tagRows.forEach((row) => photoIDs.add(row.photo_id as PhotoIdType));

  const metadataRows = await db.all<{ photo_id: string }[]>(
    `SELECT DISTINCT photo_id FROM photo_metadata ORDER BY photo_id ASC`,
  );
  metadataRows.forEach((row) => photoIDs.add(row.photo_id as PhotoIdType));

  return photoIDs;
};
