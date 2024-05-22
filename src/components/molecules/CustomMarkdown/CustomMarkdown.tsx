import React from "react";

import rangeParser from "parse-numeric-range";
import ReactMarkdown, {
  Components as CustomMarkdownComponents,
} from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark as dark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import rehypeRaw from "rehype-raw";

import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { classNames } from "@/utils/style";

type CustomMarkdownProps = {
  children: string;
  className?: string;
  skipHtml?: boolean;
};

export const CustomMarkdown: React.FC<CustomMarkdownProps> = ({
  children,
  className = "",
  skipHtml = false,
}) => {
  const MarkdownComponents: Partial<CustomMarkdownComponents> = {
    code({ node, className, ...props }) {
      const hasLang = /language-(\w+)/.exec(className || "");

      // @ts-expect-error
      const meta = node?.data?.meta?.replace(/\s/g, "") as string | undefined;
      const hasHighlights = Boolean(meta);

      // Get ranges of lines that are highlighted for this code block
      let highlightLines: number[] = [];
      if (meta) {
        const lineHighlightsRegex = new RegExp(/{([\d,-]+)}/);
        const strlineNumbers = lineHighlightsRegex.test(meta)
          ? lineHighlightsRegex.exec(meta)?.[1]
          : undefined;
        if (strlineNumbers) {
          highlightLines = rangeParser(strlineNumbers);
        }
      }

      /**
       * Function for each line to add or modify props for the line.
       */
      const getLineProps = (
        lineNumber: number,
      ): React.HTMLAttributes<HTMLElement> => {
        return {
          // @ts-expect-error do not use classname, instead use class (https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/391).
          class: highlightLines.includes(lineNumber)
            ? "bg-blue-500/50"
            : "bg-none",
        };
      };

      // If no language is specified, return the raw string
      if (!hasLang) {
        return <code className={className} {...props} />;
      }

      return (
        <SyntaxHighlighter
          style={dark}
          language={hasLang[1]}
          showLineNumbers={true}
          wrapLines={hasHighlights}
          useInlineStyles={true}
          customStyle={{
            background: "none",
          }}
          lineProps={getLineProps}
          PreTag="div"
        >
          {props.children as string | string[]}
        </SyntaxHighlighter>
      );
    },
    a: ({ children, href, ...props }) => {
      const isExternal = href?.startsWith("http");

      return (
        <CustomLink
          target={isExternal ? "_blank" : "_self"}
          {...props}
          href={href as string}
          underline={true}
        >
          {children}
        </CustomLink>
      );
    },
  };

  return (
    <ReactMarkdown
      components={MarkdownComponents}
      className={classNames(
        "prose lg:prose-xl prose-pre:px-3 prose-pre:py-2",
        className,
      )}
      rehypePlugins={[rehypeRaw]}
      skipHtml={skipHtml}
    >
      {children}
    </ReactMarkdown>
  );
};
