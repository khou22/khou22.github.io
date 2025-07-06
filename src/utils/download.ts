/**
 * Download a URL's contents to a file name.
 */
export const downloadURL = (url: string, fileName: string) => {
  const a = document.createElement("a");
  a.setAttribute("download", fileName);
  a.setAttribute("href", url);
  a.click();
};
