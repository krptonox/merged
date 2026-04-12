import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { latLonToVector3 } from '../../utils/countries';

const ACCENT   = '#3b82f6'; // uniform blue — no crisis colors
const HOVER_C  = '#60a5fa';
const ACTIVE_C = '#ffffff';

function HotspotMarker({ country, isHovered }) {
  const ringRef  = useRef();
  const innerRef = useRef();

  const pos = useMemo(
    () => latLonToVector3(country.lat, country.lon, 1.015),
    [country]
  );

  const color = isHovered ? HOVER_C : ACCENT;
  const size  = isHovered ? 0.022  : 0.012;

  useFrame(() => {
    if (ringRef.current) {
      const t = Date.now() * 0.002;
      const s = 1 + 0.3 * Math.abs(Math.sin(t + country.lat));
      ringRef.current.scale.setScalar(s);
      ringRef.current.material.opacity = 0.65 - 0.35 * ((s - 1) / 0.3);
    }
  });

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      {/* Pulse ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[size * 1.6, size * 0.14, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} depthWrite={false} />
      </mesh>

      {/* Core dot */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[size * 0.6, 8, 8]} />
        <meshBasicMaterial color={isHovered ? ACTIVE_C : color} />
      </mesh>

      {/* Hovered: extra outer ring */}
      {isHovered && (
        <mesh>
          <torusGeometry args={[size * 2.8, size * 0.09, 8, 32]} />
          <meshBasicMaterial color={HOVER_C} transparent opacity={0.35} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export default function HotspotMarkers({ countries, hoveredCountry }) {
  return (
    <>
      {countries.map((country) => (
        <HotspotMarker
          key={country.code}
          country={country}
          isHovered={hoveredCountry?.code === country.code}
        />
      ))}
    </>
  );
}
