import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Sphere, Torus } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion, useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

// Generate mock continent points (point cloud)
function generateContinentPoints(numPoints = 8000, radius = 1.01) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 2 - 1);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    // Pseudo-random noise to cluster points into "landmasses"
    const noise = Math.sin(x * 3) * Math.cos(y * 3) + Math.sin(z * 4) + Math.cos(x * 2 + y * 2);
    if (noise > 0.6) { // Threshold for land
      points.push(x, y, z);
    }
  }
  return new Float32Array(points);
}

function GlassGlobe({ shouldReduceMotion }) {
  const globeGroupRef = useRef();
  
  // Memoize the point cloud so it doesn't regenerate on re-renders
  const continentPositions = useMemo(() => generateContinentPoints(10000, 1.01), []);

  useFrame((state, delta) => {
    if (!globeGroupRef.current) return;

    // Base continuous rotation
    const rotationSpeed = shouldReduceMotion ? 0.01 : 0.05;
    globeGroupRef.current.rotation.y += delta * rotationSpeed;
    
    if (!shouldReduceMotion) {
      // Subtle parallax/tilt following mouse pointer
      // state.pointer is normalized (-1 to 1)
      const targetX = (state.pointer.y * Math.PI) / 12; // Tilt up/down
      const targetZ = -(state.pointer.x * Math.PI) / 12; // Tilt left/right
      
      // Smooth interpolation (lerp) towards the target
      globeGroupRef.current.rotation.x = THREE.MathUtils.lerp(globeGroupRef.current.rotation.x, targetX, 0.05);
      globeGroupRef.current.rotation.z = THREE.MathUtils.lerp(globeGroupRef.current.rotation.z, targetZ, 0.05);
    }
  });

  return (
    <group ref={globeGroupRef} scale={[1.8, 1.8, 1.8]}>
      
      {/* 1. Base Glass Sphere */}
      <Sphere args={[1, 64, 64]}>
        <meshPhysicalMaterial 
          color="#050505"
          emissive="#000000"
          roughness={0.15}
          metalness={0.8}
          transmission={0.6} // Glassy transparency
          transparent={true}
          opacity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>

      {/* 2. Gridlines (Lat/Lon) */}
      <Sphere args={[1.005, 24, 24]}>
        <meshBasicMaterial 
          color="#B8860B"
          wireframe={true}
          transparent={true}
          opacity={0.15}
        />
      </Sphere>

      {/* 3. Continent Point Cloud */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={continentPositions.length / 3}
            array={continentPositions}
            itemSize={3}
          />
        </bufferGeometry>
        {/* Very bright color so Bloom picks it up */}
        <pointsMaterial 
          color="#FFDF00" 
          size={0.015}
          transparent={true}
          opacity={0.8}
          sizeAttenuation={true}
        />
      </points>

      {/* 4. Orbit Rings & Light Trails */}
      <group rotation={[Math.PI / 6, 0, 0]}>
        <Torus args={[1.3, 0.002, 16, 100]}>
          <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
        </Torus>
        {/* Shiny highlights on the ring */}
        <mesh position={[1.3, 0, 0]}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-1.3, 0, 0]}>
          <sphereGeometry args={[0.01, 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      <group rotation={[-Math.PI / 8, Math.PI / 4, 0]}>
        <Torus args={[1.5, 0.003, 16, 100]}>
          <meshBasicMaterial color="#B8860B" transparent opacity={0.5} />
        </Torus>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
      
      {/* 5. Rim Lighting & Depth */}
      {/* Purple rim light from top-left */}
      <pointLight position={[-3, 2, 3]} color="#6D28D9" intensity={3} distance={10} />
      {/* Warm amber fill from bottom-right */}
      <pointLight position={[3, -2, -3]} color="#B8860B" intensity={1.5} distance={10} />
      
    </group>
  );
}

export function HeroBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-full"
      >
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]} // Cap pixel ratio for performance
          gl={{ antialias: false, alpha: true }}
          eventSource={document.body} // Listen to global pointer events so pointer-events-none doesn't block mouse tracking
          eventPrefix="client"
        >
          <ambientLight intensity={0.5} />
          
          {/* Main Glassy Globe */}
          <GlassGlobe shouldReduceMotion={shouldReduceMotion} />

          {/* Persistent Gold Spark Particles (Phase 1) */}
          {!shouldReduceMotion && (
            <Sparkles 
              count={60}
              scale={15}
              size={1.5}
              speed={0.2}
              opacity={0.3}
              color="#B8860B"
            />
          )}
          
          {/* Post-processing Bloom for glowing elements */}
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.5} mipmapBlur luminanceSmoothing={0.9} intensity={1.5} />
          </EffectComposer>
        </Canvas>
      </motion.div>
    </div>
  );
}
