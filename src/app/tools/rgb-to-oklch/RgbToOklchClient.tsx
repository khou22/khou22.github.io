"use client";

import { useMemo, useState } from "react";
import { rgbToOklch } from "@/utils/rgbToOklch";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import { Label } from "@/components/ui/label";

export const RgbToOklchClient = () => {
  const [rgbInput, setRgbInput] = useState(`  --color-white: 255 255 255;
  --color-sand: 249 243 233;
  --color-sand-100: 246 238 222;
`);

  const processedColors = useMemo(() => {
    return rgbInput.split("\n").map((line) => {
      const variableNameMatch = /^\s*([\w-]+):/.exec(line);
      const variableName = variableNameMatch ? variableNameMatch[1] : "";
      const rgbStringMatch = new RegExp(/\d+ \d+ \d+/).exec(line);
      if (rgbStringMatch === null) {
        return { line, variableName, originalRgbString: null, oklchString: null, rgb: null, oklchColor: null };
      }

      const originalRgbString = rgbStringMatch[0];
      const [r, g, b] = originalRgbString.split(" ").map(Number);
      if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
        return { line, variableName, originalRgbString, oklchString: null, rgb: { r, g, b }, oklchColor: null };
      }

      const oklch = rgbToOklch({ r, g, b });
      if (
        oklch === null ||
        Number.isNaN(oklch.l) ||
        Number.isNaN(oklch.c) ||
        Number.isNaN(oklch.h)
      ) {
        return { line, variableName, originalRgbString, oklchString: "invalid", rgb: { r, g, b }, oklchColor: null };
      }
      const oklchString = `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${oklch.h.toFixed(2)})`;
      const oklchColorString = `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${oklch.h.toFixed(2)})`;
      return { line, variableName, originalRgbString, oklchString, rgb: { r, g, b }, oklchColor: oklchColorString };
    });
  }, [rgbInput]);

  const oklchOutput = useMemo(() => {
    return processedColors.map(item => {
      if (item.originalRgbString && item.oklchString && item.oklchString !== "invalid") {
        return item.line.replace(item.originalRgbString, item.oklchString.replace(/oklch\((.*)\)/, "oklch($1)"));
      }
      return item.line;
    }).join("\n");
  }, [processedColors]);

  return (
    <div className="grid w-full grid-cols-3 gap-2">
      <div>
        <Label>RGB Input</Label>
        <TextArea
          value={rgbInput}
          onChange={(e) => setRgbInput(e.target.value)}
          className="col-span-1 h-[500px] w-full resize-none p-2"
        />
      </div>
      <div>
        <Label>OKLCH Output (Read Only)</Label>
        <TextArea
          value={oklchOutput}
          readOnly
          className="col-span-1 h-[500px] w-full resize-none p-2"
        />
      </div>
      <div>
        <Label>Color Comparison</Label>
        <div className="col-span-1 h-[500px] w-full resize-none overflow-y-auto rounded-md border border-input p-2 text-sm font-mono">
          {processedColors.map((item, index) => {
            if (!item.rgb || !item.oklchColor) {
              return (
                <div key={index} className="whitespace-pre-wrap break-all">
                  {item.line || " "}
                </div>
              );
            }
            return (
              <div key={index} className="mb-1 flex items-center gap-2">
                <span className="inline-block w-8 h-8 rounded border" style={{ backgroundColor: `rgb(${item.rgb.r} ${item.rgb.g} ${item.rgb.b})` }} title={`rgb(${item.rgb.r}, ${item.rgb.g}, ${item.rgb.b})`} />
                <span className="inline-block w-8 h-8 rounded border" style={{ backgroundColor: item.oklchColor }} title={item.oklchColor} />
                <span className="text-xs truncate">{item.variableName || item.line.split(':')[0]?.trim() || 'N/A'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
