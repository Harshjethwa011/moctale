import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

function Particles() {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const count = 900;
    const data = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      data[i * 3] = (Math.random() - 0.5) * 14;
      data[i * 3 + 1] = (Math.random() - 0.5) * 8;
      data[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    return data;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y =
      state.clock.elapsedTime * 0.015;

    pointsRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.08) * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.025}
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

function CinematicParticles() {
  return (
    <div className="particles-container">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 60,
        }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}

export default CinematicParticles;