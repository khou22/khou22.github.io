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

  const oklchOutput = useMemo(() => {
    const oklchValues = rgbInput.split("\n").map((line) => {
      const rgbString = new RegExp(/\d+ \d+ \d+/).exec(line);
      if (rgbString === null) {
        return line;
      }

      const originalRgbString = rgbString[0];

      const [r, g, b] = originalRgbString.split(" ").map(Number);
      if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
        return line;
      }

      const oklch = rgbToOklch({ r, g, b });
      if (
        Number.isNaN(oklch.l) ||
        Number.isNaN(oklch.c) ||
        Number.isNaN(oklch.h)
      ) {
        return "invalid";
      }
      const oklchString = `oklch(${oklch.l.toFixed(4)}, ${oklch.c.toFixed(
        4,
      )}, ${oklch.h.toFixed(2)})`;
      return line.replace(originalRgbString, oklchString);
    });
    return oklchValues.join("\n");
  }, [rgbInput]);

  return (
    <div className="grid w-full grid-cols-2 gap-2">
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
    </div>
  );
};
