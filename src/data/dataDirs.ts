import path from "path";

/**
 * Data directories.
 */
const dataDirs = {
  blog: "src/data/blog",
};

/**
 * Get the directory that contains the data for a particular type.
 */
export const getDataDirectory = (dataType: keyof typeof dataDirs) => {
  return path.join(process.cwd(), dataDirs[dataType]);
};
