import { Suspense, lazy, useEffect } from 'react';
import Header from './components/Header';
import AlertBanner from './components/AlertBanner';
import HorizontalDashboard from './components/Dashboard/HorizontalDashboard';
import useStore from './store/useStore';

// Lazy-load the heavy 3D scene
const GlobeScene = lazy(() => import('./components/Globe/GlobeScene'));

function GlobeFallbackUI() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-accent/50 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-gradient-accent opacity-60" />
        </div>
        <div className="text-text-muted text-sm tracking-widest uppercase font-mono animate-pulse">
          Initializing Globe…
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { loadTrendingNews, globeReady } = useStore();

  useEffect(() => {
    loadTrendingNews('general');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app-root min-h-screen bg-bg overflow-x-hidden">
      {/* ── Fixed top header ── */}
      <Header />

      {/* ── Crisis alert ticker (below header) ── */}
      <div className="fixed top-14 left-0 right-0 z-40">
        <AlertBanner />
      </div>

      {/* ── Hero: Full-viewport 3D Globe ── */}
      <section
        id="globe-section"
        className="relative w-full"
        style={{ height: '100vh', paddingTop: '82px' /* header + alert banner */ }}
      >
        {/* Background nebula effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.06]"
            style={{
              background: 'radial-gradient(circle, #3b82f6, transparent)',
              animation: 'floatOrb 9s ease-in-out infinite',
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-[0.05]"
            style={{
              background: 'radial-gradient(circle, #8b5cf6, transparent)',
              animation: 'floatOrb 12s ease-in-out infinite reverse',
            }}
          />
        </div>

        {/* Globe canvas */}
        <div className="relative w-full h-full">
          <Suspense fallback={<GlobeFallbackUI />}>
            <GlobeScene />
          </Suspense>
        </div>

        {/* Globe overlay: bottom fade into dashboard */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(7,11,20,0.6) 50%, #070b14 100%)',
          }}
        />

        {/* Scroll cue */}
        {globeReady && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce-slow pointer-events-none">
            <span className="text-text-muted text-xs tracking-widest uppercase font-mono">
              Scroll for Intelligence
            </span>
            <svg className="w-4 h-4 text-accent/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </section>

      {/* ── Divider line ── */}
      <div className="relative h-px mx-6 md:mx-12">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent blur-sm" />
      </div>

      {/* ── Stats bar ── */}
      <StatsBar />

      {/* ── Main horizontal dashboard ── */}
      <main id="dashboard-section" className="relative">
        <HorizontalDashboard />
      </main>

      {/* ── Footer ── */}
      <footer className="mt-16 border-t border-border/40 py-6 text-center">
        <p className="text-text-muted text-xs font-mono tracking-widest">
          CRISIS-GUARD AI · INTELLIGENCE PLATFORM ·{' '}
          <span className="text-accent">LIVE</span>
        </p>
      </footer>
    </div>
  );
}

/* ── Quick stats bar between globe and dashboard ── */
function StatsBar() {
  const { trendingNews } = useStore();

  const verified = trendingNews.filter((a) => a.trustScore >= 75).length;
  const suspicious = trendingNews.filter((a) => a.trustScore >= 50 && a.trustScore < 75).length;
  const fake = trendingNews.filter((a) => a.trustScore < 50).length;
  const total = trendingNews.length;

  const stats = [
    { label: 'Active Feeds', value: total || '—', color: 'text-accent', icon: '📡' },
    { label: 'Verified', value: verified || '—', color: 'text-verified', icon: '✓' },
    { label: 'Suspicious', value: suspicious || '—', color: 'text-suspicious', icon: '⚠' },
    { label: 'Flagged', value: fake || '—', color: 'text-danger', icon: '✕' },
    { label: 'Countries Monitored', value: '36', color: 'text-violet', icon: '🌐' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-4">
      <div className="glass-card px-6 py-3 flex items-center justify-between gap-6 overflow-x-auto no-scrollbar">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-3 flex-shrink-0">
            <span className="text-lg">{s.icon}</span>
            <div>
              <div className={`text-xl font-bold font-mono tabular-nums ${s.color}`}>
                {s.value}
              </div>
              <div className="text-text-muted text-[10px] uppercase tracking-widest">
                {s.label}
              </div>
            </div>
            {i < stats.length - 1 && (
              <div className="w-px h-8 bg-border ml-4" />
            )}
          </div>
        ))}

        {/* Live pulse */}
        <div className="ml-auto flex items-center gap-2 flex-shrink-0 pl-4">
          <div className="live-dot" />
          <span className="text-verified text-xs font-semibold tracking-widest uppercase">
            Real-time
          </span>
        </div>
      </div>
    </div>
  );
}
