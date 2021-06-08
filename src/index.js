import reportWebVitals from './reportWebVitals';
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Canvas } from '@react-three/fiber'
import Coin from './components/Coin'
import Plane from './components/Plane'
import Cubes from './components/Cubes'
import { Physics } from '@react-three/cannon'
import "./static/styles.css";


ReactDOM.render(
  <React.StrictMode>
    <Canvas 
      camera={{ position: [0, 1, -2], fov: 40}}
      shadowMap
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={<span>loading...</span>}>

      <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-mapSize-width={256} shadow-mapSize-height={256} />
        <Physics>
          <Plane rotation={[-Math.PI / 2, 0, 0]} />
          <Coin number={10} />
          <Cubes number={200} />
        </Physics>
      </Suspense>
    </Canvas>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
