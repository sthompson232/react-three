import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useCylinder } from '@react-three/cannon'

import React from 'react'
import coin from '../static/coin.glb'


const Coin = ({ number }) => {
    
    const gltf = useGLTF(coin)

    const [ref, api] = useCylinder(() => ({
        mass: 1,
        args: [2, 2, 2],
        position: [Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5]
      }))

    useFrame(() => api.at(Math.floor(Math.random() * number)).position.set(0, Math.random() * 2, 0))
    
    return (
    <instancedMesh receiveShadow castShadow ref={ref} args={[null, null, number]}>
    <primitive 
        object={gltf.scene} 
        position={[0, 0, -5]} 
        rotation={[Math.random(), Math.random(), Math.random()]} 
        scale={[2, 2, 2]}
    />
    </instancedMesh>
    )
}

export default Coin
