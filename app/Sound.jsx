"use client";
import { useLoader, useThree, positionalAudio } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const useUserInteracted = () => {
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setInteracted(true);
      // Remove event listeners after interaction
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    // Add event listeners
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    // Cleanup function
    return () => {
      // Remove event listeners on unmount
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []); // Empty dependency array ensures this runs once on mount and not on updates

  return interacted;
};

export function Sound({ url }) {
  const hasInteracted = useUserInteracted();
  const sound = useRef();
  const { camera } = useThree();
  const [listener] = useState(() => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    return new THREE.AudioListener(audioContext);
  });
  const buffer = useLoader(THREE.AudioLoader, url);

  useEffect(() => {
    if (hasInteracted) {
      sound.current.setBuffer(buffer);
      sound.current.setRefDistance(1);
      sound.current.setLoop(true);
      sound.current.play();

      camera.add(listener);
      return () => {
        camera.remove(listener);
        listener.context.suspend(); // Suspend the AudioContext on unmount
      };
    }
  }, [hasInteracted, camera, buffer, listener]);

  return (
    <>
      {hasInteracted ? <positionalAudio ref={sound} args={[listener]} /> : null}
    </>
  );
}
