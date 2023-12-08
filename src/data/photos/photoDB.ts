import path from "path";
import { Database } from "sqlite3";

// Open a SQLite database, stored in the file db.sqlite
export const connectToPhotoDb = async () => {
  const db = new Database(
    path.join(process.cwd(), "src/data/photos/photo_db.sqlite"),
  );

  await db.exec(`CREATE TABLE IF NOT EXISTS photo_tags (
    photo_id TEXT NOT NULL,
    tag_name TEXT NOT NULL
);`);

  return db;
};
