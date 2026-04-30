/**
 * Usage:
 *  pnpm fetch-og <SOME_URL>
 */

import { parse } from "node-html-parser";

const targetUrl = process.argv[2] || "http://localhost:3000";

async function fetchOgMetadata(url: string) {
  console.log(`Fetching metadata for: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
      );
    }
    const html = await response.text();
    const root = parse(html);

    const getMetaContent = (property: string) => {
      const element =
        root.querySelector(`meta[property="${property}"]`) ||
        root.querySelector(`meta[name="${property}"]`);
      return element?.getAttribute("content") || null;
    };

    const title =
      getMetaContent("og:title") ||
      root.querySelector("title")?.text ||
      "No title found";
    const description =
      getMetaContent("og:description") ||
      getMetaContent("description") ||
      "No description found";
    const image = getMetaContent("og:image") || "No image found";
    const urlMeta = getMetaContent("og:url") || "No URL found";
    const type = getMetaContent("og:type") || "No type found";

    console.log("\n--- OG Metadata ---");
    console.log(`Title:       ${title}`);
    console.log(`Description: ${description}`);
    console.log(`Image:       ${image}`);
    console.log(`URL:         ${urlMeta}`);
    console.log(`Type:        ${type}`);
    console.log("-------------------\n");
  } catch (error) {
    console.error("Error fetching metadata:", error);
    process.exit(1);
  }
}

fetchOgMetadata(targetUrl);
