import { Metadata } from "next";
import { JsonViewerTool } from "./JsonViewerTool";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

export const metadata: Metadata = {
  title: "JSON Viewer | Kevin Hou",
  description: "Paste JSON and view it in an interactive tree viewer",
};

const JsonViewerPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <h1 className="mb-4 text-center leading-loose">JSON Viewer</h1>
      <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
        Paste your JSON below to view it in an interactive tree.
      </p>
      <JsonViewerTool />
    </PageWrapper>
  );
};

export default JsonViewerPage;
