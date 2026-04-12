import { Suspense, useRef, useCallback, Component, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Preload } from '@react-three/drei';
import * as THREE from 'three';
import Earth from './Earth';
import HotspotMarkers from './HotspotMarker';
import { COUNTRIES } from '../../utils/countries';
import useStore from '../../store/useStore';

/* ── Error Boundary ── */
class GlobeErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e) { console.warn('[GlobeScene]', e); }
  render() {
    if (this.state.hasError) return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center max-w-xs px-6">
          <div className="text-4xl mb-4 opacity-50">🌐</div>
          <h3 className="text-text-secondary font-semibold mb-2 text-sm">Globe unavailable</h3>
          <p className="text-text-muted text-xs mb-4">WebGL failed. Try refreshing.</p>
          <button className="btn-primary" onClick={() => this.setState({ hasError: false })}>
            Retry
          </button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

/* ── Lights ── */
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={1.4} color="#fff5e6" />
      <pointLight position={[-10, -5, -5]} intensity={0.2} color="#3b82f6" />
    </>
  );
}

/* ── Raycaster ── */
function GlobeInteraction({ onHoverCountry, onClickCountry }) {
  const resolve = useCallback((e) => {
    if (!e?.point) return null;
    const pt = e.point;
    const lat = THREE.MathUtils.radToDeg(Math.asin(Math.max(-1, Math.min(1, pt.y))));
    const lon = THREE.MathUtils.radToDeg(Math.atan2(pt.z, -pt.x));
    let nearest = null, minDist = 22;
    COUNTRIES.forEach((c) => {
      const d = Math.hypot(c.lat - lat, c.lon - lon);
      if (d < minDist) { minDist = d; nearest = c; }
    });
    return nearest;
  }, []);

  return (
    <Earth
      onHover={(e) => { onHoverCountry(e ? resolve(e) : null); }}
      onClick={(e) => {
        const c = resolve(e);
        if (c) onClickCountry(c);
      }}
    />
  );
}

/* ── Loading wireframe ── */
function GlobeFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#0f1623" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

/* ════════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════════ */
export default function GlobeScene() {
  const {
    hoveredCountry, pinnedCountry,
    setHoveredCountry, setGlobeReady, loadHoverNews,
  } = useStore();

  // Debounce hover → fetch news
  const debounceRef = useRef(null);
  const lastCode    = useRef(null);

  const handleHover = useCallback((country) => {
    setHoveredCountry(country);

    clearTimeout(debounceRef.current);
    if (!country) return;

    // Don't refetch if same country
    if (country.code === lastCode.current) return;

    debounceRef.current = setTimeout(() => {
      lastCode.current = country.code;
      loadHoverNews(country);
      // Auto-scroll to dashboard
      document.getElementById('dashboard-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 700);   // 700 ms debounce — feels instant but avoids spam
  }, [setHoveredCountry, loadHoverNews]);

  const handleClick = useCallback((country) => {
    // Click locks to that country (same as hover but immediate)
    if (!country) return;
    lastCode.current = country.code;
    clearTimeout(debounceRef.current);
    loadHoverNews(country);
    setTimeout(() => {
      document.getElementById('dashboard-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }, [loadHoverNews]);

  return (
    <div
      id="globe-canvas-container"
      className="w-full h-full relative cursor-grab active:cursor-grabbing"
    >
      <GlobeErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 2.6], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color('#070b14'));
            setGlobeReady(true);
          }}
        >
          <SceneLights />
          <Stars radius={300} depth={60} count={4000} factor={4} saturation={0.1} fade speed={0.3} />

          <Suspense fallback={<GlobeFallback />}>
            <GlobeInteraction onHoverCountry={handleHover} onClickCountry={handleClick} />
            <HotspotMarkers countries={COUNTRIES} hoveredCountry={hoveredCountry} />
            <Preload all />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI * 0.2}
            maxPolarAngle={Math.PI * 0.8}
            dampingFactor={0.06}
            enableDamping
            autoRotate
            autoRotateSpeed={0.5}
            rotateSpeed={0.5}
          />
        </Canvas>
      </GlobeErrorBoundary>

      {/* ── Hover tooltip ── */}
      {hoveredCountry && (
        <div className="globe-tooltip animate-fade-in">
          <div className="globe-tooltip__card">
            <span className="globe-tooltip__flag">{hoveredCountry.flag}</span>
            <div>
              <div className="globe-tooltip__name">{hoveredCountry.name}</div>
              <div className="globe-tooltip__sub">
                {pinnedCountry?.code === hoveredCountry.code
                  ? '⚡ Loading news…'
                  : 'Hover · Loading local feed'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Active country pill — top right ── */}
      {pinnedCountry && (
        <div className="globe-active-pill animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>{pinnedCountry.flag}</span>
          <span className="globe-active-pill__name">{pinnedCountry.name}</span>
          <span className="globe-active-pill__live">LIVE</span>
        </div>
      )}
    </div>
  );
}
