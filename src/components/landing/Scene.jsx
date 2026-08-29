import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Ring, Box, Circle, Cone } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- 1. Global Particles ---
function Particles() {
  const count = 3000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 60; // Spread over large area
    }
    return arr;
  }, []);
  
  const geoRef = useRef();
  
  useFrame((state) => {
    if (geoRef.current) {
      geoRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      geoRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        color="#B8860B" 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
}

// --- 2. World 01: Globe ---
function GlobeWorld() {
  const group = useRef();
  
  useLayoutEffect(() => {
    // Globe rotates continuously
    gsap.to(group.current.rotation, {
      y: Math.PI * 2,
      duration: 40,
      repeat: -1,
      ease: "none"
    });

    // Animate based on scroll (parallax and fade out for next world)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        endTrigger: "#discover",
        end: "bottom center",
        scrub: 1,
      }
    });

    // Move closer on discover, then fade out
    tl.to(group.current.position, { z: 1, x: 2, duration: 1 })
      .to(group.current.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1 }, "<")
      .to(group.current.position, { z: -10, duration: 1 })
      .to(group.current.scale, { x: 0, y: 0, z: 0, duration: 1 }, "<");
  }, []);

  return (
    <group ref={group} position={[1, -1, -5]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Core Earth */}
        <Sphere args={[2, 64, 64]}>
          <meshStandardMaterial color="#020202" roughness={0.7} />
        </Sphere>
        {/* Wireframe Grid */}
        <Sphere args={[2.02, 32, 32]}>
          <meshBasicMaterial color="#B8860B" wireframe transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </Sphere>
        {/* Atmosphere glow */}
        <Sphere args={[2.1, 32, 32]}>
          <meshBasicMaterial color="#6D28D9" transparent opacity={0.05} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </Sphere>

        {/* Orbital Rings */}
        <Ring args={[2.5, 2.52, 64]} rotation={[Math.PI / 2.2, 0.2, 0]}>
          <meshBasicMaterial color="#B8860B" transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </Ring>
        <Ring args={[3.5, 3.55, 64]} rotation={[Math.PI / 1.8, -0.2, 0]}>
          <meshBasicMaterial color="#6D28D9" transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </Ring>
      </Float>
    </group>
  );
}

// --- 3. World 02: Network ---
function NetworkWorld() {
  const group = useRef();
  
  useLayoutEffect(() => {
    // Continuous subtle pulse/rotate
    gsap.to(group.current.rotation, {
      y: Math.PI * 2,
      x: Math.PI * 2,
      duration: 60,
      repeat: -1,
      ease: "none"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#build",
        start: "top bottom",
        endTrigger: "#grow",
        end: "bottom center",
        scrub: 1,
      }
    });

    // Start small and hidden, grow and come forward
    gsap.set(group.current.scale, { x: 0, y: 0, z: 0 });
    gsap.set(group.current.position, { z: -15, y: -5 });

    tl.to(group.current.scale, { x: 1, y: 1, z: 1, duration: 1 })
      .to(group.current.position, { z: -2, y: 0, x: 2, duration: 1 }, "<")
      // Then fade out for final world
      .to(group.current.position, { z: -20, duration: 1, delay: 0.5 })
      .to(group.current.scale, { x: 0, y: 0, z: 0, duration: 1 }, "<");
  }, []);

  return (
    <group ref={group}>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
        {/* Central Core */}
        <Sphere args={[0.8, 4, 2]}> {/* Diamond shape */}
          <meshBasicMaterial color="#B8860B" wireframe transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </Sphere>
        <Sphere args={[0.7, 4, 2]}>
          <meshBasicMaterial color="#B8860B" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </Sphere>

        {/* Radiating Nodes */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 3 + Math.random() * 2;
          const x = Math.cos(angle) * radius;
          const y = (Math.random() - 0.5) * 4;
          const z = Math.sin(angle) * radius;

          return (
            <group key={i}>
              <Sphere args={[0.15, 16, 16]} position={[x, y, z]}>
                <meshBasicMaterial color={i % 2 === 0 ? "#B8860B" : "#6D28D9"} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
              </Sphere>
              {/* Connecting Line (Using simple thin cylinder pointing to core) */}
              <LineToCore pos={[x, y, z]} />
            </group>
          );
        })}
      </Float>
    </group>
  );
}

// Helper for Network lines
function LineToCore({ pos }) {
  const ref = useRef();
  useLayoutEffect(() => {
    // orient line from 0,0,0 to pos
    const vec = new THREE.Vector3(...pos);
    ref.current.lookAt(vec);
    // Move to halfway point
    ref.current.position.copy(vec).multiplyScalar(0.5);
  }, [pos]);
  
  const length = new THREE.Vector3(...pos).length();

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.01, 0.01, length, 4]} />
      <meshBasicMaterial color="#B8860B" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

// --- 4. World 03: Future City ---
function CityWorld() {
  const group = useRef();
  
  useLayoutEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#mentors",
        start: "top center",
        endTrigger: ".final-cta", // We will add this class to FinalCta
        end: "bottom bottom",
        scrub: 1,
      }
    });

    gsap.set(group.current.position, { y: -20, z: -30 });
    gsap.set(group.current.scale, { x: 0.1, y: 0.1, z: 0.1 });

    tl.to(group.current.position, { y: -5, z: -5, duration: 1 })
      .to(group.current.scale, { x: 1, y: 1, z: 1, duration: 1 }, "<");
  }, []);

  return (
    <group ref={group}>
      {/* Distant Planet/Sun */}
      <Circle args={[20, 64]} position={[0, 5, -20]}>
        <meshBasicMaterial color="#B8860B" transparent opacity={0.1} fog={false} blending={THREE.AdditiveBlending} />
      </Circle>
      
      {/* City Blocks (Instanced Mesh would be better for perf, but simple map is fine for low count) */}
      <group position={[0, -2, -10]}>
        {[...Array(100)].map((_, i) => {
          const x = (Math.random() - 0.5) * 40;
          const z = (Math.random() - 0.5) * 20;
          const height = 1 + Math.random() * (Math.abs(x) < 5 ? 2 : 10); // Taller at edges
          
          return (
            <Box key={i} args={[0.8, height, 0.8]} position={[x, height / 2, z]}>
              <meshStandardMaterial color="#0a0a0f" roughness={0.2} metalness={0.8} />
            </Box>
          );
        })}
        {/* Ground */}
        <Box args={[60, 0.1, 40]} position={[0, 0, 0]}>
           <meshStandardMaterial color="#020202" roughness={1} />
        </Box>
      </group>
      
      {/* Fog/Atmosphere */}
      <fog attach="fog" args={['#050505', 5, 30]} />
    </group>
  );
}

// --- Main Scene Controller ---
export function Scene() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true, pixelRatio: Math.min(window.devicePixelRatio, 2) }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#B8860B" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6D28D9" />
      
      <Particles />
      <GlobeWorld />
      <NetworkWorld />
      <CityWorld />
    </Canvas>
  );
}
