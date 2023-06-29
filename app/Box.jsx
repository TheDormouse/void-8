'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber';
import { Stars, Text } from '@react-three/drei'
import { Sparkles } from '@react-three/drei'

export default function Box({ position, color }) {
  const ref = useRef()
  useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.001))

  return (
    <>
      <points ref={ref}>
        <sphereGeometry args={[1, 48, 48]} />
        <pointsMaterial color="white" size={0.015} sizeAttenuation />

      </points>
      <Sparkles count={200} scale={[1, 1, 1]} size={3} speed={1} opacity={.2} />
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={1} fade speed={1.5} />

    </>


  )
}