import * as THREE from 'three'
import React, { Suspense, useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, usePlane, useBox, useCylinder } from '@react-three/cannon'
import coin from './static/coin.glb'


const dummy = new THREE.Object3D()
const Coin = () => {
    const geometry = useGLTF(coin)


      // Compute per-frame instance positions
      const ref = useRef()
      useFrame((state) => {
        const time = state.clock.getElapsedTime()
        let i = 0
        for (let x = 0; x < 10; x++)
          for (let y = 0; y < 10; y++)
            for (let z = 0; z < 10; z++) {
              dummy.position.set(5 - x, 5 - y, 5 - z)
              dummy.rotation.y = Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time)
              dummy.rotation.z = dummy.rotation.y * 2
              dummy.updateMatrix()
              ref.current.setMatrixAt(i++, dummy.matrix)
            }
        ref.current.instanceMatrix.needsUpdate = true
      })
    return (
    <instancedMesh 
        ref={ref}
        args={[geometry.scene.children[1].geometry, null, 100]}
    >
        <meshNormalMaterial attach="material"/>
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
            position: [0, 1, -10], fov: 40
        }}
        shadows
        >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>

        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-mapSize-width={256} shadow-mapSize-height={256} />
        <Coin/>
        <Physics>
            <Plane rotation={[-Math.PI / 2, 0, 0]} />

            {/* <Cubes number={200} /> */}
        </Physics>
        </Suspense>
    </Canvas>
    )
}

export default App