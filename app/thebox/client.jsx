"use client";
import { serialize } from "next-mdx-remote/serialize";
import { useFrame, useThree } from "@react-three/fiber";
import { View } from "../client/View";
import { view } from "../index.module.css";
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { PointerLockControls, Html } from "@react-three/drei";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { useSphere } from "@react-three/cannon";
import { MdxContent } from "../blog/mdx-content";

const AnimatedBox = () => {
  const meshRef = useRef(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const ContentCube = ({ position, content }) => {
  console.log({ content });
  return (
    <group position={position}>
      <Html position={[0, 0, 0]} center>
        <div
          style={{
            color: "black",
            fontSize: "14px",
            maxWidth: "200px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: "16px", margin: "5px 0" }}>
            {content.frontmatter.title}
          </h3>
          <p style={{ fontSize: "12px", margin: "5px 0" }}>
            <strong>Date:</strong>{" "}
            {new Date(content.frontmatter.date).toLocaleDateString()}
          </p>
          <MdxContent source={content.serialized} />
        </div>
      </Html>
    </group>
  );
};

function distributeCubes(posts) {
  const spacing = 5; // Adjust as needed

  return posts.map((post, i) => {
    const x = (i % 5) * spacing; // Every 5 cubes, move to the next row
    const z = Math.floor(i / 5) * spacing;
    return (
      <ContentCube
        key={i}
        position={[x, 1, z]} // 1 is half the height of the cube, to make it sit on the floor
        content={post}
      />
    );
  });
}

const Floor = () => {
  const [ref] = usePlane(() => ({
    position: [0, -1, 0], // ensure it's slightly below the box
    rotation: [-Math.PI / 2, 0, 0],
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" color="lightgray" />
    </mesh>
  );
};

/*****************
 * Player Controls
 ****************/
export const usePlayerControls = () => {
  const keys = {
    KeyW: "forward",
    KeyS: "backward",
    KeyA: "left",
    KeyD: "right",
    Space: "jump",
  };
  const moveFieldByKey = (key) => keys[key];

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }));
    const handleKeyUp = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }));

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return movement;
};

const BaseCharacter = (props) => {
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();
  const speed = new THREE.Vector3();
  const SPEED = 5;

  const { camera } = useThree();

  const [ref, api] = useSphere((index) => ({
    mass: 1,
    type: "Dynamic",

    position: [0, 10, 0],
    ...props,
  }));

  const { forward, backward, left, right, jump } = usePlayerControls();
  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), []);

  useFrame((state) => {
    ref.current.getWorldPosition(camera.position);
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);
    speed.fromArray(velocity.current);

    api.velocity.set(direction.x, velocity.current[1], direction.z);
    if (jump && Math.abs(velocity.current[1].toFixed(2)) < 0.05)
      api.velocity.set(velocity.current[0], 5, velocity.current[2]);
  });

  return (
    <group>
      <mesh castShadow position={props.position} ref={ref}>
        <sphereGeometry args={props.args} />
        <meshStandardMaterial color="#FFFF00" />
      </mesh>
    </group>
  );
};

export default function Client(props) {
  const { posts } = props;
  return (
    <View className={view}>
      <ambientLight intensity={0.5} />
      <directionalLight color="red" position={[0, 0, 5]} />
      <Physics>
        <AnimatedBox />
        <BaseCharacter />
        <PointerLockControls />
        <Floor />
        {distributeCubes(posts)} {/* Render the cubes */}
      </Physics>
    </View>
  );
}
