import fs from "fs";
import path from "path";
import matter from "gray-matter";
import moment from "moment";
import { getPosts } from "./posts";

describe("Blog Posts Integrity Tests", () => {
  const postsDirectory = path.join(process.cwd(), "src/data/blog");
  const docsDirectory = path.join(process.cwd(), "docs");

  test("All markdown files compile properly without metadata errors", () => {
    expect(() => {
      const posts = getPosts({ includeArchived: true });
      expect(posts.length).toBeGreaterThan(0);
    }).not.toThrow();
  });

  test("Check unique slugs and valid frontmatter metadata schema", () => {
    const fileNames = fs.readdirSync(postsDirectory);
    const seenSlugs = new Set<string>();
    const errors: string[] = [];

    fileNames.forEach((filename) => {
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      let matterResult;
      try {
        matterResult = matter(fileContents);
      } catch (e) {
        errors.push(`[Malformed frontmatter] Failed to parse frontmatter in "${filename}": ${e.message}`);
        return;
      }

      const { title, author, date: dateStr, description, tags } = matterResult.data;

      if (title === undefined || (typeof title === "string" && title.trim() === "")) {
        errors.push(`[Missing metadata] Post "${filename}" is missing or has an empty title field.`);
      }
      if (author === undefined || (typeof author === "string" && author.trim() === "")) {
        errors.push(`[Missing metadata] Post "${filename}" is missing or has an empty author field.`);
      }
      if (dateStr === undefined) {
        errors.push(`[Missing metadata] Post "${filename}" is missing date.`);
      } else {
        const parsedDate = moment(dateStr);
        if (!parsedDate.isValid()) {
          errors.push(`[Invalid Date] Post "${filename}" has malformed date: "${dateStr}".`);
        }
      }

      if (tags !== undefined && !Array.isArray(tags)) {
        errors.push(`[Schema Violation] Post "${filename}" has tags field which is not an array.`);
      }

      const slug = filename.replace(/\.mdx?$/, "").replaceAll(/[^a-z0-9]/gi, "-");
      if (seenSlugs.has(slug)) {
        errors.push(`[Slug Collision] Post "${filename}" generates a duplicated slug "${slug}".`);
      }
      seenSlugs.add(slug);
    });

    if (errors.length > 0) {
      throw new Error(`Metadata Integrity failed with errors:\n${errors.join("\n")}`);
    }
  });

  test("Check for broken cross-references, relative link integrity, and reference loops", () => {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPosts = getPosts({ includeArchived: true });
    const validSlugs = new Set(allPosts.map((p) => p.frontMatter.slug));

    const errors: string[] = [];
    const adjList = new Map();

    // Regex to capture both Markdown links and Markdown images
    const linkRegex = /\[.*?\]\((.*?)\)/g;
    const imgHtmlRegex = /<img\s+[^>]*?src=["']([^"']+)["']/gi;

    fileNames.forEach((filename) => {
      const slug = filename.replace(/\.mdx?$/, "").replaceAll(/[^a-z0-9]/gi, "-");
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const matterResult = matter(fileContents);
      const content = matterResult.content;

      if (!adjList.has(slug)) {
        adjList.set(slug, new Set());
      }

      let match;

      // Test Links
      while ((match = linkRegex.exec(content)) !== null) {
        const href = match[1].split("#")[0].split("?")[0].trim();

        if (
          !href ||
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("mailto:") ||
          href.startsWith("#") ||
          href.startsWith("//")
        ) {
          continue;
        }

        // Check relative path cross-references to other blog files
        if (href.includes(".md") || href.includes(".mdx")) {
          errors.push(
            `[File link problem] Blog post "${filename}" has raw link to file ending in .md/mdx: "${href}". Format should be updated to slug routing target reference!`,
          );
        }

        if (href.startsWith("/blog/")) {
          const targetSlug = href.replace(/^\/blog\//, "").replace(/\/$/, "");
          if (!validSlugs.has(targetSlug)) {
            errors.push(
              `[Broken post reference] Blog post "${filename}" contains broken cross-reference: slug target "${targetSlug}" not found! (href: "${href}")`,
            );
          } else {
            adjList.get(slug).add(targetSlug);
          }
        }
      }

      // Test Images
      while ((match = imgHtmlRegex.exec(content)) !== null) {
        const src = match[1].trim();

        if (
          !src ||
          src.startsWith("http://") ||
          src.startsWith("https://") ||
          src.startsWith("//")
        ) {
          continue;
        }

        // Validate local assets referenced relatively or via absolute root paths
        if (src.startsWith("/media/") || src.startsWith("/photography/")) {
          const relativePath = src.replace(/^\//, "");
          const assetPath = path.join(docsDirectory, relativePath);
          if (!fs.existsSync(assetPath)) {
            errors.push(
              `[Broken image embed] Blog post "${filename}" contains broken embedded image: local asset does not exist in target output directory "${assetPath}" (src: "${src}")`,
            );
          }
        }
      }
    });

    // Test directed reference graph for cycle audit findings (loops)
    const visited = new Map();
    const recStack = new Map();
    const cycles = [];

    const detectCycleDFS = (node, pathTrace) => {
      visited.set(node, true);
      recStack.set(node, true);
      pathTrace.push(node);

      const neighbors = adjList.get(node);
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited.get(neighbor)) {
            detectCycleDFS(neighbor, [...pathTrace]);
          } else if (recStack.get(neighbor)) {
            const cycleStartIndex = pathTrace.indexOf(neighbor);
            if (cycleStartIndex !== -1) {
              cycles.push([...pathTrace.slice(cycleStartIndex), neighbor]);
            }
          }
        }
      }

      recStack.set(node, false);
    };

    for (const node of adjList.keys()) {
      if (!visited.get(node)) {
        detectCycleDFS(node, []);
      }
    }

    if (cycles.length > 0) {
      console.warn("\n⚠️ Audited internal reciprocal reference loops found:\n");
      cycles.forEach((cycle) => console.warn(`   🔁 Loop: ${cycle.join(" -> ")}`));
    }

    if (errors.length > 0) {
      console.error("\nCollected anomalies during verification:\n");
      errors.forEach((err) => console.error(`❌ ${err}`));
      throw new Error(`Cross-reference Integrity Test failed with ${errors.length} validation anomalies found.`);
    }
  });

  test("Code fences conform fully to valid formatting parameters", () => {
    const fileNames = fs.readdirSync(postsDirectory);
    const errors = [];

    fileNames.forEach((filename) => {
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const matterResult = matter(fileContents);
      const content = matterResult.content;

      const lines = content.split(/\r?\n/);
      let inCodeBlock = false;
      let openDelimiter = "";
      let openLineNum = 0;

      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const trimmed = line.trim();

        // Match code fences opening or closing
        const match = trimmed.match(/^(`{3,}|~{3,})(.*)$/);

        if (match) {
          const delimiter = match[1];
          const params = match[2].trim();

          if (!inCodeBlock) {
            // Opening fence
            inCodeBlock = true;
            openDelimiter = delimiter;
            openLineNum = lineNum;

            // Validate language name syntax
            // Format could be "language" or "language {1,3-5}"
            const langMatch = params.match(/^([a-zA-Z0-9\-+._]*)(?:\s*(\{.*\}))?$/);
            if (!langMatch) {
              errors.push(
                `[Invalid code fence] Post "${filename}" at line ${lineNum}: opening code block contains unusual metadata string "${params}".`,
              );
            }
          } else {
            // Closing fence - needs to be at least the length of the opening delimiter
            if (delimiter.startsWith(openDelimiter)) {
              inCodeBlock = false;
              openDelimiter = "";
            }
          }
        }
      });

      if (inCodeBlock) {
        errors.push(
          `[Unclosed code block] Post "${filename}": code block opened on line ${openLineNum} is not properly closed before the end of the document!`,
        );
      }
    });

    if (errors.length > 0) {
      throw new Error(`Code fence conformance validations failed:\n${errors.join("\n")}`);
    }
  });
});
