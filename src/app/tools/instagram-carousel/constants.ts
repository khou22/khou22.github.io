import { AspectRatioConfig, CarouselSettings } from "./types";

export const ASPECT_RATIOS: Record<string, AspectRatioConfig> = {
  reels: {
    label: "Reels / Stories (9:16)",
    ratio: 9 / 16,
    exportWidth: 1080,
    exportHeight: 1920,
  },
  portrait: {
    label: "Portrait (4:5)",
    ratio: 4 / 5,
    exportWidth: 1080,
    exportHeight: 1350,
  },
  square: {
    label: "Square (1:1)",
    ratio: 1,
    exportWidth: 1080,
    exportHeight: 1080,
  },
  landscape: {
    label: "Landscape (16:9)",
    ratio: 16 / 9,
    exportWidth: 1920,
    exportHeight: 1080,
  },
};

export const FONT_OPTIONS = [
  { label: "Sans Serif", value: "system-ui, -apple-system, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Monospace", value: "'Courier New', monospace" },
  { label: "Impact", value: "Impact, 'Arial Black', sans-serif" },
  { label: "Cursive", value: "'Brush Script MT', cursive" },
];

export const DEFAULT_SETTINGS: CarouselSettings = {
  aspectRatioKey: "reels",
  backgroundColor: "#ffffff",
  paddingPercent: 0,
  borderColor: "#ffffff",
};

export const DEFAULT_TEXT_OVERLAY = {
  fontSize: 6,
  fontFamily: FONT_OPTIONS[0].value,
  color: "#000000",
  fontWeight: 600,
};
