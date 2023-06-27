'use client'
import { useLoader, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
export function Sound({ url }) {
    const sound = useRef()
    const { camera } = useThree()
    const [listener] = useState(() => new THREE.AudioListener())
    const buffer = useLoader(THREE.AudioLoader, url)
    useEffect(() => {
        sound.current.setBuffer(buffer)
        sound.current.setRefDistance(1)
        sound.current.setLoop(true)
        sound.current.play()
        camera.add(listener)
        return () => camera.remove(listener)
    }, [camera, buffer, listener])
    return <positionalAudio ref={sound} args={[listener]} />
}