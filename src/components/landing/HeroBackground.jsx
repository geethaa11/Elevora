import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// The Globe Component
function HolographicGlobe() {
  const globeRef = useRef();

  // Slow continuous rotation
  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.05;
      globeRef.current.rotation.x = 0.2; // Slight tilt
    }
  });

  return (
    <group ref={globeRef} position={[2, 0, 0]} scale={[2.5, 2.5, 2.5]}>
      {/* Wireframe Sphere */}
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial 
          color="#B8860B" // Gold
          wireframe={true}
          transparent={true}
          opacity={0.15}
          emissive="#B8860B"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Inner solid sphere to block back faces from being too confusing, optional, but keeping it fully transparent wireframe is often nicer */}
      <Sphere args={[0.98, 32, 32]}>
        <meshBasicMaterial color="#050505" transparent={true} opacity={0.6} />
      </Sphere>

      {/* Purple rim light source */}
      <pointLight position={[-2, 1, 2]} color="#6D28D9" intensity={2} distance={5} />
    </group>
  );
}

export function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-full"
      >
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]} // Cap pixel ratio for performance
          gl={{ antialias: false, alpha: true }} // Alpha true for transparent background
        >
          {/* Ambient light for subtle visibility */}
          <ambientLight intensity={0.5} />
          
          {/* Gold Particles / Sparks */}
          <Sparkles 
            count={60}
            scale={12}
            size={1.5}
            speed={0.2}
            opacity={0.4}
            color="#B8860B" // Gold sparks
          />
          
          <HolographicGlobe />
        </Canvas>
      </motion.div>
    </div>
  );
}
