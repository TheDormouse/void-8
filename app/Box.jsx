'use client'
import { useRef } from 'react'
import {  useFrame } from '@react-three/fiber';
import vertex from './client/shaders/green/shader.vert'
import fragment from './client/shaders/green/shader.frag'

export default function Box({position, color}) {
    const ref = useRef()
    useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.001))
  
    return (
     
      <mesh position={position}  ref={ref} >
        <boxBufferGeometry  args={[1, 1, 1]} attach="geometry" />
        <shaderMaterial attach="material" fragmentShader={fragment} vertexShader={vertex} />
      </mesh>
  
    )
  }