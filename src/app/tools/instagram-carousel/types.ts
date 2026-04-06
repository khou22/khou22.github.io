export interface TextOverlay {
  id: string;
  text: string;
  /** X position as fraction of inner area width (0-1), 0.5 = centered */
  x: number;
  /** Y position as fraction of inner area height (0-1), 0.5 = centered */
  y: number;
  /** Font size as percentage of inner area width */
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: number;
}

export interface Slide {
  id: string;
  imageUrl: string | null;
  imageNaturalWidth: number;
  imageNaturalHeight: number;
  /** Horizontal offset from centered position, as fraction of inner width */
  offsetX: number;
  /** Vertical offset from centered position, as fraction of inner height */
  offsetY: number;
  /** Scale multiplier: 1 = fit inside canvas, >1 = zoom in */
  scale: number;
  texts: TextOverlay[];
}

export interface AspectRatioConfig {
  label: string;
  ratio: number;
  exportWidth: number;
  exportHeight: number;
}

export interface CarouselSettings {
  aspectRatioKey: string;
  backgroundColor: string;
  /** Padding as percentage of canvas width (0-20) */
  paddingPercent: number;
  borderColor: string;
}
