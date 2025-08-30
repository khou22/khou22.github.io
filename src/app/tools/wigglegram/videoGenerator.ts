import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { VideoGeneratorOptions } from "./types";

let ffmpegInstance: FFmpeg | null = null;

const initFFmpeg = async (
  onProgress: (progress: number, message: string) => void,
): Promise<FFmpeg> => {
  if (ffmpegInstance) {
    return ffmpegInstance;
  }

  onProgress(5, "Loading FFmpeg...");

  const ffmpeg = new FFmpeg();

  // Load FFmpeg with progress tracking
  ffmpeg.on("log", ({ message }) => {
    console.log("FFmpeg:", message);
  });

  ffmpeg.on("progress", ({ progress, time }) => {
    if (progress > 0) {
      const progressPercent = Math.round(progress * 100);
      const timeStr = time ? ` (${Math.round(time / 1000000)}s)` : "";
      onProgress(
        80 + progress * 15,
        `Encoding video... ${progressPercent}%${timeStr}`,
      );
    }
  });

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  ffmpegInstance = ffmpeg;
  onProgress(20, "FFmpeg loaded successfully");

  return ffmpeg;
};

// Helper function to calculate overlapping area of all frames
const calculateOverlappingArea = (
  frames: VideoGeneratorOptions["frames"],
): { x: number; y: number; width: number; height: number } => {
  if (frames.length === 0) {
    throw new Error("No frames to calculate overlap");
  }

  const firstFrame = frames[0].data;
  const baseWidth = firstFrame.canvas.width;
  const baseHeight = firstFrame.canvas.height;

  // Start with the full area of the first frame
  let minX = 0;
  let minY = 0;
  let maxX = baseWidth;
  let maxY = baseHeight;

  // For each frame, calculate its effective bounds considering offsets
  frames.forEach(({ offsets }) => {
    const offsetX = offsets?.left?.x || offsets?.right?.x || 0;
    const offsetY = offsets?.left?.y || offsets?.right?.y || 0;

    // Frame bounds with offset applied
    const frameMinX = offsetX;
    const frameMinY = offsetY;
    const frameMaxX = offsetX + baseWidth;
    const frameMaxY = offsetY + baseHeight;

    // Find intersection (overlapping area)
    minX = Math.max(minX, frameMinX);
    minY = Math.max(minY, frameMinY);
    maxX = Math.min(maxX, frameMaxX);
    maxY = Math.min(maxY, frameMaxY);
  });

  // Ensure we have a valid overlapping area
  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);

  if (width === 0 || height === 0) {
    // Fallback to original frame size if no overlap
    return { x: 0, y: 0, width: baseWidth, height: baseHeight };
  }

  return { x: minX, y: minY, width, height };
};

export const generateVideo = async (
  options: VideoGeneratorOptions,
): Promise<Blob> => {
  const { frames, animationSpeed, repeatCount, cropParameters, onProgress } =
    options;

  if (frames.length === 0) {
    throw new Error("No frames provided");
  }

  try {
    onProgress(0, "Initializing video generation...");

    // Create a progress callback that updates FFmpeg progress events
    const ffmpegProgressCallback = (progress: number, message: string) => {
      onProgress(progress, message);
    };

    const ffmpeg = await initFFmpeg(ffmpegProgressCallback);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Calculate canvas size - prioritize user crop, then auto-calculate overlap
    let canvasWidth, canvasHeight, cropArea;
    if (cropParameters) {
      canvasWidth = cropParameters.width;
      canvasHeight = cropParameters.height;
      cropArea = cropParameters;
    } else {
      // Auto-calculate overlapping area to eliminate background gaps
      onProgress(5, "Calculating overlapping area...");
      cropArea = calculateOverlappingArea(frames);
      canvasWidth = cropArea.width;
      canvasHeight = cropArea.height;
    }

    // Ensure even dimensions for better codec compatibility
    canvas.width = Math.ceil(canvasWidth / 2) * 2;
    canvas.height = Math.ceil(canvasHeight / 2) * 2;

    onProgress(25, "Processing frames...");

    // Create snake animation sequence (forward then backward for each repeat)
    const animationSequence: number[] = [];
    for (let repeat = 0; repeat < repeatCount; repeat++) {
      // Forward sequence
      for (let i = 0; i < frames.length; i++) {
        animationSequence.push(i);
      }
      // Backward sequence (excluding first and last to avoid duplicates)
      for (let i = frames.length - 2; i > 0; i--) {
        animationSequence.push(i);
      }
    }

    // Generate frame images and write to FFmpeg
    for (let seqIndex = 0; seqIndex < animationSequence.length; seqIndex++) {
      const frameIndex = animationSequence[seqIndex];
      const i = seqIndex; // Use sequence index for file naming
      const progress = 25 + (seqIndex / animationSequence.length) * 40;
      onProgress(
        progress,
        `Processing frame ${seqIndex + 1}/${animationSequence.length}...`,
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const currentFrame = frames[frameIndex];
      const { data: frameData, offsets } = currentFrame;

      // Apply frame offset
      const offsetX = offsets?.left?.x || offsets?.right?.x || 0;
      const offsetY = offsets?.left?.y || offsets?.right?.y || 0;

      // Calculate source coordinates relative to the frame's offset position
      const sourceX = cropArea.x - offsetX;
      const sourceY = cropArea.y - offsetY;

      // Draw the cropped area from the frame to fill the entire canvas
      ctx.drawImage(
        frameData.canvas,
        sourceX,
        sourceY,
        cropArea.width,
        cropArea.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      // Convert canvas to blob and write to FFmpeg
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/png");
      });

      const frameFileName = `frame${i.toString().padStart(3, "0")}.png`;
      await ffmpeg.writeFile(frameFileName, await fetchFile(blob));
    }

    onProgress(70, "Starting video encoding...");

    // Calculate frame rate from animation speed
    const fps = Math.max(5, Math.min(30, 1000 / animationSpeed));

    // Set up FFmpeg progress tracking for this specific encoding job
    const encodingProgressHandler = ({
      progress,
      time,
    }: {
      progress: number;
      time?: number;
    }) => {
      if (progress > 0) {
        const progressPercent = Math.round(progress * 100);
        const timeStr = time
          ? ` (${Math.round(time / 1000000)}s processed)`
          : "";
        onProgress(
          70 + progress * 25, // Map FFmpeg progress (0-1) to our range (70-95)
          `Encoding video... ${progressPercent}%${timeStr}`,
        );
      }
    };

    // Add temporary progress handler for this encoding
    ffmpeg.on("progress", encodingProgressHandler);

    try {
      // Create MP4 video using FFmpeg with iOS Safari compatibility
      await ffmpeg.exec([
        "-framerate",
        fps.toString(),
        "-i",
        "frame%03d.png",
        "-c:v",
        "libx264",
        "-profile:v",
        "main",
        "-level",
        "3.1",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "23",
        "-preset",
        "medium",
        "-movflags",
        "+faststart",
        "-f",
        "mp4",
        "output.mp4",
      ]);
    } finally {
      // Remove the temporary progress handler
      ffmpeg.off("progress", encodingProgressHandler);
    }

    onProgress(95, "Finalizing video...");

    // Read the output file
    const data = await ffmpeg.readFile("output.mp4");
    const videoBlob = new Blob([data], { type: "video/mp4" });

    // Store the actual mime type for proper file extension
    (videoBlob as any)._actualMimeType = "video/mp4";

    onProgress(100, "Video generation complete!");

    return videoBlob;
  } catch (error) {
    console.error("FFmpeg video generation failed:", error);
    throw new Error(
      `Video generation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
};

export const downloadVideo = (videoUrl: string, blob?: Blob): void => {
  if (!videoUrl) {
    console.error("No video URL provided for download");
    return;
  }

  // Determine file extension based on blob type - FFmpeg outputs MP4
  let filename = "wigglegram.mp4"; // default for FFmpeg output
  if (blob) {
    const mimeType = (blob as any)._actualMimeType || blob.type;
    if (mimeType.includes("webm")) {
      filename = "wigglegram.webm";
    } else if (mimeType.includes("mp4")) {
      filename = "wigglegram.mp4";
    }
  }

  try {
    // Create download link with proper attributes
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = filename;
    link.style.display = "none";

    // Add to DOM temporarily for better browser support
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);

    console.log("Video download initiated:", filename);
  } catch (error) {
    console.error("Error downloading video:", error);

    // Fallback: try opening in new window
    try {
      const newWindow = window.open(videoUrl, "_blank");
      if (!newWindow) {
        alert(
          'Please allow popups to download the video, or right-click the video and select "Save video as..."',
        );
      }
    } catch (fallbackError) {
      console.error("Fallback download also failed:", fallbackError);
      alert(
        'Download failed. Please right-click the video and select "Save video as..."',
      );
    }
  }
};
