"use client";

import React, { useState } from "react";
import { OpacityIcon } from "@radix-ui/react-icons";
import { ImageCanvas } from "./ImageCanvas";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";
import { Button } from "@/components/ui/button";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type SocialMediaImageFrameProps = {
  photoID: PhotoIdType;
  imageClassName?: string;
};

export const SocialMediaImageFrame: React.FC<SocialMediaImageFrameProps> = ({
  photoID,
  imageClassName,
}) => {
  const [backgroundColor, setBackgroundColor] = useState("#000");
  const [textColor, setTextColor] = useState("#fff");
  const [backgroundOpacity, setBackgroundOpacity] = useState(80);
  const [blur, setBlur] = useState(64);

  return (
    <div className="w-fit space-y-2">
      <ImageCanvas
        photoID={photoID}
        className={imageClassName}
        backgroundColor={backgroundColor}
        backgroundOpacity={backgroundOpacity / 100}
        textColor={textColor}
        blur={blur}
      />
      <div className="flex flex-row items-end justify-between space-x-1">
        <div className="flex flex-row items-center justify-start space-x-3">
          <HoverCard openDelay={0} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="flex flex-col items-center justify-center space-y-1">
                <p className="text-xs">Bg</p>
                <div
                  className="h-8 w-8 rounded-full border-gray-300"
                  style={{ backgroundColor }}
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="flex flex-row items-center justify-between">
              <div className="flex flex-row space-x-2">
                {["#FFF", "#888", "#000"].map((color) => (
                  <button
                    key={color}
                    className="h-8 w-8 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                    type="button"
                    onClick={() => setBackgroundColor(color)}
                  />
                ))}
              </div>

              <Input
                placeholder="%"
                value={backgroundOpacity}
                className="max-w-[80px]"
                onChange={(e) => {
                  const opacity = parseInt(e.target.value);
                  if (!isNaN(opacity)) {
                    setBackgroundOpacity(opacity);
                  }
                }}
                type="number"
              />
            </HoverCardContent>
          </HoverCard>

          <HoverCard openDelay={0} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="flex flex-col items-center justify-center space-y-1">
                <p className="text-xs">Text</p>
                <div
                  className="h-8 w-8 rounded-full border border-gray-300"
                  style={{ backgroundColor: textColor }}
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="flex w-fit flex-row items-center justify-center space-x-2">
              {["#FFF", "#888", "#000"].map((color) => (
                <button
                  key={color}
                  className="h-8 w-8 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  type="button"
                  onClick={() => setTextColor(color)}
                />
              ))}
            </HoverCardContent>
          </HoverCard>

          <HoverCard openDelay={0} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="flex flex-col items-center justify-center space-y-1">
                <p className="text-xs">Blur</p>
                <Button variant="outline" size="icon">
                  <OpacityIcon />
                </Button>
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <Slider
                min={0}
                max={124}
                step={2}
                value={[blur]}
                onValueChange={(value) => setBlur(value[0])}
                className="w-40"
              />
            </HoverCardContent>
          </HoverCard>
        </div>
        <div>
          <Button>Download</Button>
        </div>
      </div>
    </div>
  );
};
