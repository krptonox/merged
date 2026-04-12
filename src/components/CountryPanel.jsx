import useStore from '../store/useStore';
import { crisisColor, crisisLabel } from '../utils/countries';

const CRISIS_DETAIL = {
  1: { summary: 'Stable environment. No significant threats detected.', icon: '🟢' },
  2: { summary: 'Minor instabilities. Situation is being monitored.', icon: '🟡' },
  3: { summary: 'Moderate tensions. International attention warranted.', icon: '🟠' },
  4: { summary: 'High risk. Active threats to security or stability.', icon: '🔴' },
  5: { summary: 'Critical crisis. Immediate humanitarian concern.', icon: '🔴' },
};

export default function CountryPanel() {
  const { selectedCountry, locationNews, loadingLocation, clearSelection } = useStore();

  const show = !!selectedCountry;

  return (
    <>
      {/* Backdrop */}
      {show && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={clearSelection}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <aside
        id="country-panel"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          show ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'rgba(7, 11, 20, 0.95)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(30,42,61,0.9)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
        }}
      >
        {!selectedCountry ? null : (
          <>
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCountry.flag}</span>
                <div>
                  <h2 className="text-text-primary font-bold text-lg leading-tight">
                    {selectedCountry.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-text-muted text-xs font-mono">{selectedCountry.code}</span>
                    <span className="text-border">·</span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: crisisColor(selectedCountry.crisis) }}
                    >
                      {CRISIS_DETAIL[selectedCountry.crisis]?.icon}{' '}
                      {crisisLabel(selectedCountry.crisis)} Threat
                    </span>
                  </div>
                </div>
              </div>
              <button
                id="close-country-panel"
                onClick={clearSelection}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all"
                aria-label="Close panel"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Crisis meter */}
            <div className="px-6 pt-5 pb-4 border-b border-border/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-muted text-xs uppercase tracking-widest">Crisis Index</span>
                <span className="text-xs font-mono font-bold" style={{ color: crisisColor(selectedCountry.crisis) }}>
                  {selectedCountry.crisis} / 5
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-hover overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(selectedCountry.crisis / 5) * 100}%`,
                    background: `linear-gradient(90deg, ${crisisColor(1)}, ${crisisColor(selectedCountry.crisis)})`,
                    boxShadow: `0 0 10px ${crisisColor(selectedCountry.crisis)}60`,
                  }}
                />
              </div>
              <p className="text-text-muted text-xs mt-2 leading-relaxed">
                {CRISIS_DETAIL[selectedCountry.crisis]?.summary}
              </p>

              {/* Threat segments */}
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div
                    key={lvl}
                    className="flex-1 h-1.5 rounded-full transition-all"
                    style={{
                      background: lvl <= selectedCountry.crisis
                        ? crisisColor(lvl)
                        : 'rgba(255,255,255,0.06)',
                      boxShadow: lvl <= selectedCountry.crisis && lvl === selectedCountry.crisis
                        ? `0 0 6px ${crisisColor(lvl)}`
                        : 'none',
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-text-muted uppercase">Stable</span>
                <span className="text-[9px] text-text-muted uppercase">Critical</span>
              </div>
            </div>

            {/* Intelligence report list */}
            <div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-text-secondary text-xs uppercase tracking-widest font-semibold">
                  Intelligence Reports
                </h3>
                {locationNews.length > 0 && (
                  <span className="text-xs text-accent font-mono">{locationNews.length} feeds</span>
                )}
              </div>

              {loadingLocation && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card p-4 animate-pulse">
                      <div className="skeleton h-4 w-3/4 mb-2" />
                      <div className="skeleton h-3 w-full mb-1" />
                      <div className="skeleton h-3 w-5/6" />
                    </div>
                  ))}
                </div>
              )}

              {!loadingLocation && locationNews.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-3xl mb-3 opacity-40">📭</div>
                  <p className="text-text-muted text-sm">No reports available</p>
                </div>
              )}

              {!loadingLocation && locationNews.length > 0 && (
                <div className="space-y-3">
                  {locationNews.map((article) => (
                    <MiniCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>

            {/* CTA footer */}
            <div className="px-6 py-4 border-t border-border/40">
              <button
                onClick={() => {
                  clearSelection();
                  document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary w-full justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                </svg>
                View Full Dashboard
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getTrustColor(score) {
  if (score >= 75) return { color: '#22c55e', label: 'Verified' };
  if (score >= 50) return { color: '#f59e0b', label: 'Suspicious' };
  return { color: '#ef4444', label: 'Flagged' };
}

function MiniCard({ article }) {
  const trust = getTrustColor(article.trustScore);
  return (
    <a
      href={article.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="block glass-card-hover p-4 group"
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-1 w-2 h-2 rounded-full flex-shrink-0 transition-all"
          style={{ background: trust.color, boxShadow: `0 0 6px ${trust.color}` }}
        />
        <div className="min-w-0">
          <p className="text-text-primary text-sm font-semibold leading-snug line-clamp-2 group-hover:text-accent transition-colors">
            {article.title}
          </p>
          {article.summary && (
            <p className="text-text-muted text-xs mt-1 leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-text-muted">{article.source}</span>
            <span className="text-border">·</span>
            <span className="text-[10px] text-text-muted">{timeAgo(article.timestamp)}</span>
            <span
              className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{
                color: trust.color,
                background: `${trust.color}15`,
                border: `1px solid ${trust.color}30`,
              }}
            >
              {trust.label}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
