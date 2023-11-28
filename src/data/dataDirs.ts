import path from "path";

/**
 * Data directories.
 */
const dataDirs = {
  blog: "data/blog",
};

export const getDataDirectory = (key: keyof typeof dataDirs) => {
  return path.join(process.cwd(), dataDirs[key]);
};
