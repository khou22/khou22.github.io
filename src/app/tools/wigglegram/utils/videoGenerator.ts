import { VideoGeneratorOptions } from '../types/wigglegram';

export const generateVideo = async (options: VideoGeneratorOptions): Promise<Blob> => {
  const { frames, animationSpeed, cropParameters, onProgress } = options;

  if (frames.length === 0) {
    throw new Error('No frames provided');
  }

  onProgress(0, "Setting up video recorder...");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Calculate canvas size based on crop parameters or use first frame as reference
  const firstFrame = frames[0].data;
  
  let canvasWidth, canvasHeight;
  if (cropParameters) {
    // Use crop dimensions
    canvasWidth = cropParameters.width;
    canvasHeight = cropParameters.height;
  } else {
    // Use full frame dimensions
    canvasWidth = firstFrame.canvas.width;
    canvasHeight = firstFrame.canvas.height;
  }
  
  // Ensure canvas dimensions are even numbers (some encoders require this)
  canvas.width = Math.ceil(canvasWidth / 2) * 2;
  canvas.height = Math.ceil(canvasHeight / 2) * 2;

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
      
      if (cropParameters) {
        // Apply crop: draw a specific region of the source canvas to fill the output canvas
        const offsetX = offsets?.left?.x || offsets?.right?.x || 0;
        const offsetY = offsets?.left?.y || offsets?.right?.y || 0;
        
        // Calculate source position including frame offsets
        const sourceX = cropParameters.x - offsetX;
        const sourceY = cropParameters.y - offsetY;
        
        // Draw the cropped region from source to fill the entire canvas
        ctx.drawImage(
          frameData.canvas,
          sourceX,  // sx: source x
          sourceY,  // sy: source y 
          cropParameters.width,   // sw: source width
          cropParameters.height,  // sh: source height
          0,        // dx: destination x
          0,        // dy: destination y
          canvas.width,   // dw: destination width  
          canvas.height   // dh: destination height
        );
      } else {
        // No crop - apply offsets if they exist, otherwise draw at origin
        const offsetX = offsets?.left?.x || offsets?.right?.x || 0;
        const offsetY = offsets?.left?.y || offsets?.right?.y || 0;
        
        ctx.drawImage(frameData.canvas, offsetX, offsetY);
      }

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
  if (!videoUrl) {
    console.error('No video URL provided for download');
    return;
  }

  try {
    // Create download link with proper attributes
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = filename;
    link.style.display = 'none';
    
    // Add to DOM temporarily for better browser support
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    
    console.log('Video download initiated:', filename);
  } catch (error) {
    console.error('Error downloading video:', error);
    
    // Fallback: try opening in new window
    try {
      const newWindow = window.open(videoUrl, '_blank');
      if (!newWindow) {
        alert('Please allow popups to download the video, or right-click the video and select "Save video as..."');
      }
    } catch (fallbackError) {
      console.error('Fallback download also failed:', fallbackError);
      alert('Download failed. Please right-click the video and select "Save video as..."');
    }
  }
};
