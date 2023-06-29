'use client'
import { Facemesh } from "@react-three/drei";
import { Tracking } from "./client/Tracking";
import { useState } from "react";


export default function Face(){
    const [landmarks, setLandmarks] = useState(null);
    return(
        <>
            <Tracking setLandmarks={setLandmarks} />
            {landmarks && <Facemesh points={landmarks} /> }
        </>
    )
}