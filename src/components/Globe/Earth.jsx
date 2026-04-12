import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

// ── Atmosphere shader (additive glow ring) ──
const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(0.22, 0.55, 1.0, 1.0) * intensity;
  }
`;

const TEXTURE_URLS = [
  '/earth-day.jpg',
  '/earth-water.png',
  '/earth-topology.png',
  '/earth-clouds.png',
];

export default function Earth({ onHover, onClick }) {
  const meshRef   = useRef();
  const cloudsRef = useRef();

  const [dayMap, specularMap, normalMap, cloudsMap] = useLoader(TextureLoader, TEXTURE_URLS);

  useMemo(() => {
    [dayMap, specularMap, normalMap, cloudsMap].forEach((t) => {
      if (!t) return;
      t.anisotropy  = 8;
      t.minFilter   = THREE.LinearMipMapLinearFilter;
      t.magFilter   = THREE.LinearFilter;
    });
  }, [dayMap, specularMap, normalMap, cloudsMap]);

  const atmosphereMaterial = useMemo(
    () => new THREE.ShaderMaterial({
      vertexShader:   atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending:    THREE.AdditiveBlending,
      side:        THREE.BackSide,
      transparent: true,
      depthWrite:  false,
    }),
    []
  );

  // Globe ALWAYS rotates
  useFrame((_, delta) => {
    if (meshRef.current)   meshRef.current.rotation.y   += delta * 0.04;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.048;
  });

  return (
    <group>
      {/* Atmosphere glow */}
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Globe surface */}
      <mesh
        ref={meshRef}
        onPointerMove={(e) => { if (e?.point) onHover?.(e); }}
        onPointerOut={() => onHover?.(null)}
        onClick={(e) => { if (e?.point) onClick?.(e); }}
        castShadow
      >
        <sphereGeometry args={[1, 96, 96]} />
        <meshPhongMaterial
          map={dayMap}
          specularMap={specularMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.4, 0.4)}
          specular={new THREE.Color(0x2233aa)}
          shininess={18}
        />
      </mesh>

      {/* Cloud layer */}
      {cloudsMap && (
        <mesh ref={cloudsRef} scale={[1.005, 1.005, 1.005]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhongMaterial map={cloudsMap} transparent opacity={0.28} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
