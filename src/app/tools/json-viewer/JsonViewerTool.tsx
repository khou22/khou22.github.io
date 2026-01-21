"use client";

import { useCallback, useState } from "react";
import { JsonView, darkStyles, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const EXAMPLE_JSON = {
  name: "Example",
  version: "1.0.0",
  settings: {
    enabled: true,
    count: 42,
    tags: ["json", "viewer", "tool"],
  },
  data: null,
};

export const JsonViewerTool = () => {
  const [input, setInput] = useState("");
  const [parsedJson, setParsedJson] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const parseJson = useCallback(() => {
    if (!input.trim()) {
      setParsedJson(null);
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setParsedJson(parsed);
      setError(null);
    } catch (e) {
      setParsedJson(null);
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }, [input]);

  const loadExample = useCallback(() => {
    setInput(JSON.stringify(EXAMPLE_JSON, null, 2));
    setParsedJson(EXAMPLE_JSON);
    setError(null);
  }, []);

  const clearAll = useCallback(() => {
    setInput("");
    setParsedJson(null);
    setError(null);
  }, []);

  const formatJson = useCallback(() => {
    if (!parsedJson) return;
    setInput(JSON.stringify(parsedJson, null, 2));
  }, [parsedJson]);

  const minifyJson = useCallback(() => {
    if (!parsedJson) return;
    setInput(JSON.stringify(parsedJson));
  }, [parsedJson]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Textarea
          placeholder="Paste your JSON here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={parseJson} variant="default">
            Parse JSON
          </Button>
          <Button onClick={formatJson} variant="outline" disabled={!parsedJson}>
            Format
          </Button>
          <Button onClick={minifyJson} variant="outline" disabled={!parsedJson}>
            Minify
          </Button>
          <Button onClick={loadExample} variant="outline">
            Load Example
          </Button>
          <Button onClick={clearAll} variant="ghost">
            Clear
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <p className="font-medium">Parse Error</p>
          <p className="mt-1 font-mono text-sm">{error}</p>
        </div>
      )}

      {parsedJson !== null && (
        <div className="overflow-auto rounded-md border bg-slate-50 p-4 dark:bg-slate-900">
          <JsonView
            data={parsedJson}
            shouldExpandNode={(level) => level < 3}
            style={resolvedTheme === "dark" ? darkStyles : defaultStyles}
          />
        </div>
      )}
    </div>
  );
};
