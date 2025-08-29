import { VideoGeneratorOptions } from '../types/wigglegram';

export const generateVideo = async (options: VideoGeneratorOptions): Promise<Blob> => {
  const { frames, animationSpeed, onProgress } = options;

  if (frames.length === 0) {
    throw new Error('No frames provided');
  }

  onProgress(0, "Setting up video recorder...");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Calculate canvas size - use first frame as reference
  const firstFrame = frames[0].data;
  
  // Ensure canvas dimensions are even numbers (some encoders require this)
  canvas.width = Math.ceil(firstFrame.canvas.width / 2) * 2;
  canvas.height = Math.ceil(firstFrame.canvas.height / 2) * 2;

  onProgress(20, "Initializing video stream...");

  // Constrain frame rate to reasonable range (5-30 FPS)
  const targetFPS = Math.max(5, Math.min(30, 1000 / animationSpeed));
  const stream = canvas.captureStream(targetFPS);

  // More conservative codec selection - start with WebM which has better support
  let mimeType = "video/webm";
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = "video/webm;codecs=vp8";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/mp4";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        throw new Error('No supported video format found');
      }
    }
  }

  const mediaRecorder = new MediaRecorder(stream, { mimeType });
  const chunks: Blob[] = [];

  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      onProgress(100, "Finalizing video...");
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };

    mediaRecorder.onerror = (event) => {
      reject(new Error(`MediaRecorder error: ${event.error}`));
    };

    onProgress(40, "Recording video frames...");
    mediaRecorder.start();

    // Animate through frames
    let frameIndex = 0;
    let cycleCount = 0;
    const totalCycles = 3;
    
    const animateFrames = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentFrame = frames[frameIndex];
      const { data: frameData, offsets } = currentFrame;
      
      // Apply offsets if they exist, otherwise draw at origin
      const offsetX = offsets?.left?.x || offsets?.right?.x || 0;
      const offsetY = offsets?.left?.y || offsets?.right?.y || 0;
      
      ctx.drawImage(frameData.canvas, offsetX, offsetY);

      frameIndex = (frameIndex + 1) % frames.length;

      if (frameIndex === 0) {
        cycleCount++;
        const progressPercent = 40 + (cycleCount / totalCycles) * 50;
        onProgress(progressPercent, `Recording... cycle ${cycleCount}/${totalCycles}`);

        if (cycleCount >= totalCycles) {
          setTimeout(() => mediaRecorder.stop(), animationSpeed);
          return;
        }
      }

      setTimeout(animateFrames, animationSpeed);
    };

    animateFrames();
  });
};

export const downloadVideo = (videoUrl: string, filename: string = "wigglegram.mp4"): void => {
  if (!videoUrl) return;

  const link = document.createElement("a");
  link.href = videoUrl;
  link.download = filename;
  link.click();
};
