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

  ffmpeg.on("progress", ({ progress }) => {
    if (progress > 0) {
      onProgress(
        80 + progress * 15,
        `Encoding video... ${Math.round(progress * 100)}%`,
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

export const generateVideo = async (
  options: VideoGeneratorOptions,
): Promise<Blob> => {
  const { frames, animationSpeed, cropParameters, onProgress } = options;

  if (frames.length === 0) {
    throw new Error("No frames provided");
  }

  try {
    onProgress(0, "Initializing video generation...");

    const ffmpeg = await initFFmpeg(onProgress);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Calculate canvas size
    const firstFrame = frames[0].data;
    let canvasWidth, canvasHeight;
    if (cropParameters) {
      canvasWidth = cropParameters.width;
      canvasHeight = cropParameters.height;
    } else {
      canvasWidth = firstFrame.canvas.width;
      canvasHeight = firstFrame.canvas.height;
    }

    // Ensure even dimensions for better codec compatibility
    canvas.width = Math.ceil(canvasWidth / 2) * 2;
    canvas.height = Math.ceil(canvasHeight / 2) * 2;

    onProgress(25, "Processing frames...");

    // Generate frame images and write to FFmpeg
    for (let i = 0; i < frames.length; i++) {
      const progress = 25 + (i / frames.length) * 40;
      onProgress(progress, `Processing frame ${i + 1}/${frames.length}...`);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const currentFrame = frames[i];
      const { data: frameData, offsets } = currentFrame;

      if (cropParameters) {
        const offsetX = offsets?.left?.x || offsets?.right?.x || 0;
        const offsetY = offsets?.left?.y || offsets?.right?.y || 0;
        const sourceX = cropParameters.x - offsetX;
        const sourceY = cropParameters.y - offsetY;

        ctx.drawImage(
          frameData.canvas,
          sourceX,
          sourceY,
          cropParameters.width,
          cropParameters.height,
          0,
          0,
          canvas.width,
          canvas.height,
        );
      } else {
        const offsetX = offsets?.left?.x || offsets?.right?.x || 0;
        const offsetY = offsets?.left?.y || offsets?.right?.y || 0;
        ctx.drawImage(frameData.canvas, offsetX, offsetY);
      }

      // Convert canvas to blob and write to FFmpeg
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/png");
      });

      const frameFileName = `frame${i.toString().padStart(3, "0")}.png`;
      await ffmpeg.writeFile(frameFileName, await fetchFile(blob));
    }

    onProgress(70, "Creating video with FFmpeg...");

    // Calculate frame rate from animation speed
    const fps = Math.max(5, Math.min(30, 1000 / animationSpeed));

    // Create MP4 video using FFmpeg
    await ffmpeg.exec([
      "-framerate",
      fps.toString(),
      "-i",
      "frame%03d.png",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-crf",
      "23",
      "-preset",
      "medium",
      "-movflags",
      "+faststart",
      "-loop",
      "0",
      "output.mp4",
    ]);

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
