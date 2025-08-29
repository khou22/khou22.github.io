// Shared TypeScript definitions for Wigglegram components

export interface ExtractedFrame {
  canvas: HTMLCanvasElement;
  dataUrl: string;
}

export interface AlignmentOffsets {
  left: { x: number; y: number };
  right: { x: number; y: number };
}

export interface LayerState {
  left: boolean;
  right: boolean;
}

export type DragLayer = "left" | "right" | null;
export type FrameArrangement = "horizontal" | "vertical";

// Component Props Interfaces

export interface SimpleFrameEditorProps {
  extractedFrames: ExtractedFrame[];
  numFrames: number;
  frameArrangement: FrameArrangement;
  animationSpeed: number;
  onNumFramesChange: (value: number) => void;
  onFrameArrangementChange: (value: FrameArrangement) => void;
  onAnimationSpeedChange: (value: number) => void;
  onModeToggle: (isEditorMode: boolean) => void;
  isEditorMode: boolean;
}

export interface ImageAlignmentEditorProps {
  extractedFrames: ExtractedFrame[];
  baseFrameIndex: number;
  alignmentOffsets: AlignmentOffsets;
  isDragging: DragLayer;
  dragStart: { x: number; y: number } | null;
  layerVisibility: LayerState;
  layerLocked: LayerState;
  selectedLayer: DragLayer;
  onBaseFrameChange: (index: number) => void;
  onAlignmentOffsetsChange: (offsets: AlignmentOffsets) => void;
  onDraggingChange: (layer: DragLayer) => void;
  onDragStartChange: (start: { x: number; y: number } | null) => void;
  editorCanvasRef: React.RefObject<HTMLCanvasElement>;
}

export interface LayerControlPanelProps {
  layerVisibility: LayerState;
  layerLocked: LayerState;
  selectedLayer: DragLayer;
  alignmentOffsets: AlignmentOffsets;
  onLayerVisibilityChange: (visibility: LayerState) => void;
  onLayerLockedChange: (locked: LayerState) => void;
  onSelectedLayerChange: (layer: DragLayer) => void;
  onResetAlignment: () => void;
  onResetAllLayers: () => void;
}

export interface VideoPreviewProps {
  previewVideo: string | null;
  isGenerating: boolean;
  progress: number;
  progressMessage: string;
  errorMessage: string | null;
  onGenerateVideo: () => void;
  onDownloadVideo: () => void;
}

export interface VideoGeneratorOptions {
  frames: {
    data: ExtractedFrame;
    offsets: AlignmentOffsets;
  }[]
  animationSpeed: number;
  onProgress: (progress: number, message: string) => void;
}
