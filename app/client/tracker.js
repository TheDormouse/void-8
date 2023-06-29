'use client'
let offscreenCanvas = null;

self.onmessage = (event) => {
  if (event.data.offscreenCanvas) {
    offscreenCanvas = event.data.offscreenCanvas;
    requestAnimationFrame(processFrame);
  }
};

const processFrame = () => {
  let context = offscreenCanvas.getContext('2d');
  let imageData = context.getImageData(0, 0, 640, 480);

  // Process the image data and perform landmark detection
  const landmarks = detectLandmarks(imageData);
  self.postMessage(landmarks);

  // Request the next frame
  requestAnimationFrame(processFrame);
};