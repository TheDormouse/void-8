'use client'
import { useRef } from 'react'
import {  useFrame } from '@react-three/fiber';
import vertex from './client/shaders/green/shader.vert'
import fragment from './client/shaders/green/shader.frag'
import { Text } from '@react-three/drei'

export default function Box({position, color}) {
    const ref = useRef()
    useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.001))
  
    return (
     <>
     <points ref={ref}>
        <sphereGeometry args={[1, 48, 48]} />
        <pointsMaterial color="#5786F5" size={0.015} sizeAttenuation />
       
      </points>
      <Text color='white' anchorX='center' anchorY='middle' scale={[.2, .2, .2]}>
            The system is being configured. Please check back later.
        </Text>
     </>
        
  
    )
  }