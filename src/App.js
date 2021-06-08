import * as THREE from 'three'
import React, { Suspense, useRef } from 'react'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, usePlane, useBox, useCylinder } from '@react-three/cannon'
import coin from './static/coin.glb'


const dummy = new THREE.Object3D()
const Coin = ({ number }) => {
    const geometry = useGLTF(coin)


      // Compute per-frame instance positions
      const ref = useRef()
      useFrame((state) => {
        ref.current.rotation.y = Math.PI / 2
        ref.current.position.x = 2.5
        ref.current.position.y = 2
        ref.current.position.z = 0
        const time = state.clock.getElapsedTime()
        let i = 0
        for (let x = 0; x < 10; x++)
          for (let y = 0; y < 10; y++)
            for (let z = 0; z < 10; z++) {
              dummy.position.set((5 - x * 2), (5 - y * 2), (5 - z * 2))
              dummy.rotation.y = Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time)
              dummy.rotation.z = dummy.rotation.y * 2
              dummy.updateMatrix()
              ref.current.setMatrixAt(i++, dummy.matrix)
            }
        ref.current.instanceMatrix.needsUpdate = true
      })
    return (
    <instancedMesh 
        castShadow
        receiveShadow
        ref={ref}
        args={[geometry.scene.children[1].geometry, null, number]}
        scale={[0.1, 0.1, 0.1]}
    >
        <meshPhongMaterial 
          shininess={100}
          roughness={0.5} 
          metalness={0.5} 
          attach="material" 
          color="gold" />
    </instancedMesh>
    )
}

function Cubes({ number }) {

    const [ref, api] = useBox(() => ({
      mass: 1,
      args: [0.1, 0.1, 0.1],
      position: [Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5]
    }))
  
    useFrame(() => api.at(Math.floor(Math.random() * number)).position.set(0, Math.random() * 2, 0))
  
    return (
      <instancedMesh 
        receiveShadow 
        castShadow 
        ref={ref} 
        args={[null, null, number]}
        >
        <boxBufferGeometry attach="geometry" args={[0.1, 0.1, 0.1]}>
          <instancedBufferAttribute />
        </boxBufferGeometry>
        <meshLambertMaterial/>
      </instancedMesh>
    )
  }

function Plane(props) {
    const [ref] = usePlane(() => ({ mass: 0, ...props }))
    return (
      <mesh ref={ref} receiveShadow>
        <planeBufferGeometry attach="geometry" args={[5, 5]} />
        <shadowMaterial attach="material" color="#171717" opacity={0.5} />
      </mesh>
    )
  }

function App() {
    return (
    <Canvas 
        camera={{ 
            position: [-5, 5, -5], 
            fov: 40,
        }}
        shadows
        >
        <ambientLight intensity={0.1}/>
        <pointLight position={[3, 10, 0]} />
        <OrbitControls />
        <Suspense fallback={null}>

        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-mapSize-width={256} shadow-mapSize-height={256} />
        <Physics>
            <Plane rotation={[-Math.PI / 2, 0, 0]} />
            <Coin number={1000}/>
            <Cubes number={200} />
        </Physics>
        </Suspense>
    </Canvas>
    )
}

export default App