import { PhotoIdType } from "@/utils/cdn/cdnAssets";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

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
  Partial<Record<PhotoIdType, string[]>>
> => {
  const db = await connectToPhotoDb();
  const rows = await db.all<PhotoTagRowType[]>(
    `SELECT photo_id, tag_name FROM photo_tags`,
  );

  const tagsByPhotoID: Partial<Record<PhotoIdType, string[]>> = {};
  rows.forEach((row) => {
    const photoID = row.photo_id as PhotoIdType;
    const tag = row.tag_name;

    if (tagsByPhotoID[photoID]) {
      tagsByPhotoID[photoID]?.push(tag);
    } else {
      tagsByPhotoID[photoID] = [tag];
    }
  });

  return tagsByPhotoID;
};
