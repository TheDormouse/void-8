'use client'
import { Html } from "@react-three/drei";
import { useEffect, useRef } from "react";

export const Tracking = ({setLandmarks}) => {
  const videoRef = useRef(null);
  const workerRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();

        // Create an offscreen canvas and pass it to the worker
        let offscreenCanvas = new OffscreenCanvas(640, 480);
        workerRef.current.postMessage({ offscreenCanvas }, [offscreenCanvas]);

        video.onloadedmetadata = () => {
          // Start capturing frames when the video is ready
          requestAnimationFrame(captureFrame);
        };
      })
      .catch(err => {
        console.log("An error occurred: " + err);
      });
  }, []);

  const captureFrame = () => {
    // Draw the current video frame onto the offscreen canvas
    let offscreenCanvas = workerRef.current.canvas;
    let context = offscreenCanvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 640, 480);

    // Request the next frame
    requestAnimationFrame(captureFrame);
  };

  useEffect(() => {
    workerRef.current = new Worker("./tracker.js");

    workerRef.current.onmessage = (event) => {
      setLandmarks(event.data);
    };

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  return (
    <Html as='div'>
      <video ref={videoRef} width="640" height="480" style={{ display: 'none' }} />
    </Html>
  );
};