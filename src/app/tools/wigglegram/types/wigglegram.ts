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
  // External data needed for rendering
  extractedFrames: ExtractedFrame[];
  
  // Layer state from LayerControlPanel
  layerState: {
    visibility: LayerState;
    locked: LayerState;
    selected: DragLayer;
  };
  
  // Callbacks to parent
  onAlignmentChange?: (offsets: AlignmentOffsets) => void;
  onBaseFrameChange?: (index: number) => void;
}

export interface LayerControlPanelProps {
  // Read-only data for display
  alignmentOffsets: AlignmentOffsets;
  
  // Callbacks to parent
  onLayerStateChange?: (state: {
    visibility: LayerState;
    locked: LayerState;
    selected: DragLayer;
  }) => void;
  onResetAlignment?: () => void;
  onResetAllLayers?: () => void;
}

export interface CropParameters {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VideoCropSelectorProps {
  videoElement: HTMLVideoElement;
  onCropChange: (crop: CropParameters) => void;
  initialCrop?: CropParameters;
}

export interface VideoPreviewProps {
  // Data needed for video generation
  extractedFrames: ExtractedFrame[];
  animationSpeed: number;
  alignmentOffsets: AlignmentOffsets;
  isEditorMode: boolean;
  baseFrameIndex: number;
  
  // External crop state coordination
  cropParameters?: CropParameters | null;
  onCropParametersChange?: (crop: CropParameters | null) => void;
  
  // Callbacks to parent
  onVideoGenerated?: (videoUrl: string) => void;
}

export interface VideoGeneratorOptions {
  frames: {
    data: ExtractedFrame;
    offsets: AlignmentOffsets;
  }[]
  animationSpeed: number;
  cropParameters?: CropParameters;
  onProgress: (progress: number, message: string) => void;
}
