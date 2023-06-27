'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei'


export default function Box({ position, color }) {
  const ref = useRef()
  useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.001))

  return (
    <>
      <points ref={ref}>
        <sphereGeometry args={[1, 48, 48]} />
        <pointsMaterial color="white" size={0.015} sizeAttenuation />

      </points>

    </>


  )
}