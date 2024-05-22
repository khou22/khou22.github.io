"use client";

import { useState } from "react";

import { CodeiumEditor, Document, Language } from "@codeium/react-code-editor";

const HTML_SNIPPET = `<html>
  <head>
    <title>Contact Form</title>
  </head>
  <body>
    <h1>Contact Form</h1>
    <p>I'm a simple contact form.</p>

    <form>
      <label for="name">Name:</label>
      <input type="text" id="name-field-id" name="name" />

      <label for="email">Email:</label>
      <input type="email" id="email-field-id" name="email" />
    </form>
  </body>
</html>
`;

const JAVSCRIPT_SNIPPET = `// You have context over a sample HTML page.
// Codeium's generation will take this context into account when suggesting.

// Get the contact form values by ID.`;

export const ContextAwareDemo = () => {
  const [htmlValue, setHtmlValue] = useState(HTML_SNIPPET);
  const [javascriptValue, setJavascriptValue] = useState(JAVSCRIPT_SNIPPET);

  return (
    <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
      <div>
        <CodeiumEditor
          language="html"
          value={htmlValue}
          onChange={(value) => value && setHtmlValue(value)}
          theme="vs-dark"
          height={400}
          otherDocuments={[
            new Document({
              absolutePath: "/script.js",
              relativePath: "script.js",
              text: javascriptValue,
              editorLanguage: "javascript",
              language: Language.JAVASCRIPT,
            }),
          ]}
        />
      </div>
      <div>
        <CodeiumEditor
          language="javascript"
          value={javascriptValue}
          onChange={(value) => value && setJavascriptValue(value)}
          theme="vs-dark"
          height={400}
          otherDocuments={[
            new Document({
              absolutePath: "/index.html",
              relativePath: "index.html",
              text: htmlValue,
              editorLanguage: "html",
              language: Language.HTML,
            }),
          ]}
        />
      </div>
    </div>
  );
};
