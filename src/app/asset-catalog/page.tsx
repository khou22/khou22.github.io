import fs from "fs";
import path from "path";
import React from "react";
import matter from "gray-matter";
import { NextPage } from "next";
import { CustomMarkdown } from "@/components/molecules/CustomMarkdown/CustomMarkdown";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

/**
 * This page is used to display the asset catalog, which is a list of all assets available for
 * use in the website. The content is automatically generated.
 */
const AssetCatalogPage: NextPage = () => {
  const filePath = path.join(process.cwd(), "asset-catalog.md");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { content } = matter(fileContents);

  return (
    <PageWrapper>
      <CustomMarkdown>{content}</CustomMarkdown>
    </PageWrapper>
  );
};

export default AssetCatalogPage;
