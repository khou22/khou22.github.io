import fs from "fs";
import path from "path";
import { getDataDirectory } from "@/data/dataDirs";

/**
 * Read the gpx file in the cycling/ data directory.
 */
export const getCyclingRoute = (fileName: string) => {
  const postsDirectory = getDataDirectory("cycling");
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  // const gpx = parseGpxXml(fileContents);
  return fileContents;
}