"use client";

import { useEffect, useState } from "react";
import { BoundingBox } from "./types";

interface BoundingBoxSelectorProps {
  box: BoundingBox;
  onChange: (box: BoundingBox) => void;
  containerWidth: number;
  containerHeight: number;
}

export const BoundingBoxSelector = ({
  box,
  onChange,
  containerWidth,
  containerHeight,
}: BoundingBoxSelectorProps) => {
  const [action, setAction] = useState<
    | null
    | {
        type: "move" | "resize";
        corner?: "tl" | "tr" | "bl" | "br";
        startX: number;
        startY: number;
        startBox: BoundingBox;
      }
  >(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!action) return;
      const dx = e.clientX - action.startX;
      const dy = e.clientY - action.startY;
      let newBox = { ...action.startBox };
      if (action.type === "move") {
        newBox.x = Math.min(
          Math.max(0, action.startBox.x + dx),
          containerWidth - action.startBox.width,
        );
        newBox.y = Math.min(
          Math.max(0, action.startBox.y + dy),
          containerHeight - action.startBox.height,
        );
      } else if (action.type === "resize") {
        switch (action.corner) {
          case "tl":
            newBox.x = Math.min(
              action.startBox.x + dx,
              action.startBox.x + action.startBox.width - 20,
            );
            newBox.y = Math.min(
              action.startBox.y + dy,
              action.startBox.y + action.startBox.height - 20,
            );
            newBox.width = action.startBox.width - dx;
            newBox.height = action.startBox.height - dy;
            break;
          case "tr":
            newBox.y = Math.min(
              action.startBox.y + dy,
              action.startBox.y + action.startBox.height - 20,
            );
            newBox.width = action.startBox.width + dx;
            newBox.height = action.startBox.height - dy;
            break;
          case "bl":
            newBox.x = Math.min(
              action.startBox.x + dx,
              action.startBox.x + action.startBox.width - 20,
            );
            newBox.width = action.startBox.width - dx;
            newBox.height = action.startBox.height + dy;
            break;
          case "br":
            newBox.width = action.startBox.width + dx;
            newBox.height = action.startBox.height + dy;
            break;
        }
        if (newBox.width < 20) newBox.width = 20;
        if (newBox.height < 20) newBox.height = 20;
        if (newBox.x < 0) {
          newBox.width += newBox.x;
          newBox.x = 0;
        }
        if (newBox.y < 0) {
          newBox.height += newBox.y;
          newBox.y = 0;
        }
        if (newBox.x + newBox.width > containerWidth)
          newBox.width = containerWidth - newBox.x;
        if (newBox.y + newBox.height > containerHeight)
          newBox.height = containerHeight - newBox.y;
      }
      onChange(newBox);
    };
    const handleMouseUp = () => setAction(null);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [action, onChange, containerWidth, containerHeight]);

  const startMove = (
    e: React.MouseEvent<HTMLDivElement>,
    type: "move" | "resize",
    corner?: "tl" | "tr" | "bl" | "br",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setAction({
      type,
      corner,
      startX: e.clientX,
      startY: e.clientY,
      startBox: { ...box },
    });
  };

  return (
    <div
      className="absolute inset-0"
      style={{ width: containerWidth, height: containerHeight, pointerEvents: "none" }}
    >
      <div
        className="absolute border-2 border-blue-500 bg-blue-200/10"
        style={{
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
          cursor: action?.type === "move" ? "grabbing" : "move",
          pointerEvents: "auto",
        }}
        onMouseDown={(e) => startMove(e, "move")}
      >
        {(["tl", "tr", "bl", "br"] as const).map((corner) => (
          <div
            key={corner}
            className="absolute h-3 w-3 bg-blue-500"
            style={{
              left: corner.includes("l") ? -4 : undefined,
              right: corner.includes("r") ? -4 : undefined,
              top: corner.includes("t") ? -4 : undefined,
              bottom: corner.includes("b") ? -4 : undefined,
              cursor: `${corner}-resize`,
            }}
            onMouseDown={(e) => startMove(e, "resize", corner)}
          />
        ))}
      </div>
    </div>
  );
};

export type { BoundingBox };
