"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";

type FloaterProps = {
  position: [number, number, number];
  scale?: number;
  shape: "cube" | "sphere";
  speed: number;
  reduced: boolean;
};

/** Glass object that drifts slowly; motion is skipped under reduced-motion. */
function GlassFloater({ position, scale = 1, shape, speed, reduced }: FloaterProps) {
  const ref = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += delta * 0.22 * speed;
    ref.current.rotation.x += delta * 0.1 * speed;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        {shape === "cube" ? <boxGeometry args={[1.1, 1.1, 1.1]} /> : <sphereGeometry args={[0.7, 48, 48]} />}
        <meshPhysicalMaterial
          color="#f4f1ff"
          transmission={0.92}
          roughness={0.12}
          thickness={0.8}
          ior={1.45}
          clearcoat={1}
          clearcoatRoughness={0.1}
          attenuationColor="#a58bff"
          attenuationDistance={2}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}

/**
 * Decorative glass only — placed in margins so HTML dashboard / phone stay readable.
 * Coordinates: +x right, +y up (Three.js). Kept away from center phone/dashboard.
 */
export default function GlassScene({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.2], fov: 36 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      className="pointer-events-none !absolute inset-0 !z-0"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      <ambientLight intensity={0.95} />
      <directionalLight position={[3, 4, 5]} intensity={1.35} color="#ffffff" />
      <pointLight position={[-3, -1, 2]} intensity={5.5} color="#a58bff" distance={12} />
      <pointLight position={[2.5, 2, 3]} intensity={2.8} color="#4f6bff" distance={10} />

      {/* Large cube — upper right margin */}
      <GlassFloater position={[2.55, 1.55, -0.4]} scale={0.95} shape="cube" speed={0.85} reduced={reduced} />
      {/* Sphere — lower left margin */}
      <GlassFloater position={[-2.55, -1.35, 0.2]} scale={0.75} shape="sphere" speed={0.65} reduced={reduced} />
      {/* Small cube — lower right, behind phone area */}
      <GlassFloater position={[2.75, -1.45, -0.8]} scale={0.48} shape="cube" speed={1.05} reduced={reduced} />
      {/* Tiny sphere — upper left accent */}
      <GlassFloater position={[-2.2, 1.4, -0.6]} scale={0.4} shape="sphere" speed={0.9} reduced={reduced} />
    </Canvas>
  );
}
