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

  return db;
};

type PhotoTagRowType = { photo_id: string; tag_name: string };

export const getTagsByPhotoID = async (): Promise<
  Partial<Record<PhotoIdType, PhotoTags[]>>
> => {
  const db = await connectToPhotoDb();
  const rows = await db.all<PhotoTagRowType[]>(
    `SELECT photo_id, tag_name FROM photo_tags`,
  );

  const tagsByPhotoID: Partial<Record<PhotoIdType, PhotoTags[]>> = {};
  rows.forEach((row) => {
    const photoID = row.photo_id as PhotoIdType;
    const tag = row.tag_name as PhotoTags;

    if (tagsByPhotoID[photoID]) {
      tagsByPhotoID[photoID]?.push(tag);
    } else {
      tagsByPhotoID[photoID] = [tag];
    }
  });

  return tagsByPhotoID;
};

/**
 * Get photo IDs that have the given tag.
 */
export const getPhotosWithTag = async (
  tag: PhotoTags,
): Promise<PhotoIdType[]> => {
  const db = await connectToPhotoDb();
  const rows = await db.all<PhotoTagRowType[]>(
    `SELECT photo_id, tag_name FROM photo_tags WHERE tag_name = ? ORDER BY photo_id ASC`,
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
 * Execute a rename for a photo ID. Updates the `photo_tags` table.
 */
export const renamePhotoID = async (
  original: PhotoIdType,
  destination: string,
): Promise<number> => {
  const db = await connectToPhotoDb();
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
  return tx.changes;
};
