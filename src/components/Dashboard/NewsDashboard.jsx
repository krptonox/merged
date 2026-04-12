import { useEffect, useMemo } from 'react';
import useStore from '../../store/useStore';
import NewsCard from './NewsCard';
import { SkeletonGrid } from './SkeletonCard';

const TABS = [
  { id: 'trending',  label: 'Trending Intelligence', icon: '📡', desc: 'Live global news feed' },
  { id: 'verified',  label: 'Verified Reports',      icon: '✓',  desc: 'Trusted sources only' },
  { id: 'misinfo',   label: 'Misinfo Alerts',        icon: '⚠',  desc: 'Flagged content' },
  { id: 'location',  label: 'Location Reports',      icon: '📍', desc: 'Selected region' },
];

const CATEGORIES = [
  { id: 'general',       label: 'All' },
  { id: 'technology',    label: 'Tech' },
  { id: 'business',      label: 'Business' },
  { id: 'science',       label: 'Science' },
  { id: 'health',        label: 'Health' },
  { id: 'entertainment', label: 'Culture' },
];

export default function NewsDashboard() {
  const {
    activeTab, setActiveTab,
    activeCategory, setActiveCategory,
    trendingNews, locationNews,
    loadingTrending, loadingLocation,
    selectedCountry, clearSelection,
    loadTrendingNews,
  } = useStore();

  // Load trending on mount and on category change
  useEffect(() => {
    loadTrendingNews(activeCategory);
  }, [activeCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derive section-filtered news
  const articles = useMemo(() => {
    if (activeTab === 'location') return locationNews;
    if (activeTab === 'verified') return trendingNews.filter((a) => a.trustScore >= 75);
    if (activeTab === 'misinfo') return trendingNews.filter((a) => a.trustScore < 50);
    return trendingNews;
  }, [activeTab, trendingNews, locationNews]);

  const isLoading =
    (activeTab === 'trending' && loadingTrending) ||
    (activeTab === 'verified' && loadingTrending) ||
    (activeTab === 'misinfo' && loadingTrending) ||
    (activeTab === 'location' && loadingLocation);

  return (
    <section id="news-dashboard" className="w-full px-4 md:px-6 lg:px-8 pb-16">

      {/* ── Dashboard title bar ── */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-text-primary font-bold text-xl md:text-2xl">
            Intelligence <span className="text-gradient-accent">Feed</span>
          </h2>
          <p className="text-text-muted text-sm mt-1">
            {selectedCountry
              ? `Showing reports for ${selectedCountry.flag} ${selectedCountry.name}`
              : 'Real-time global news intelligence with AI trust scoring'}
          </p>
        </div>

        {/* Article count badge */}
        {!isLoading && articles.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {articles.length} reports
          </div>
        )}
      </div>

      {/* ── Dashboard control bar ── */}
      <div className="glass-card mb-6 px-5 py-3">
        <div className="flex flex-col gap-3">
          {/* Row 1: Tabs */}
          <div className="flex items-center gap-1 no-scrollbar overflow-x-auto">
            {TABS.map((tab) => {
              const isLocation = tab.id === 'location';
              const disabled = isLocation && !selectedCountry;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  disabled={disabled}
                  onClick={() => !disabled && setActiveTab(tab.id)}
                  title={disabled ? 'Click a country on the globe first' : tab.desc}
                  className={`tab-btn whitespace-nowrap ${active ? 'active' : ''} ${disabled ? 'opacity-25 cursor-not-allowed' : ''}`}
                >
                  <span className={active ? '' : 'opacity-70'}>{tab.icon}</span>
                  {tab.label}
                  {/* Live count indicators */}
                  {tab.id === 'verified' && !loadingTrending && (
                    <span className="ml-1 text-[10px] font-mono bg-verified/10 text-verified px-1.5 py-0.5 rounded-full">
                      {trendingNews.filter((a) => a.trustScore >= 75).length}
                    </span>
                  )}
                  {tab.id === 'misinfo' && !loadingTrending && (
                    <span className="ml-1 text-[10px] font-mono bg-danger/10 text-danger px-1.5 py-0.5 rounded-full">
                      {trendingNews.filter((a) => a.trustScore < 50).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Row 2: Category + controls */}
          <div className="flex items-center gap-3 flex-wrap border-t border-border/30 pt-3">
            {/* Location pill */}
            {selectedCountry && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/8 border border-accent/20 text-xs">
                <span>{selectedCountry.flag}</span>
                <span className="text-accent font-medium">{selectedCountry.name}</span>
                <button
                  id="clear-location-btn"
                  onClick={clearSelection}
                  className="ml-1 text-text-muted hover:text-danger transition-colors"
                  title="Clear country selection"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}

            {/* Category pills — only for trending/verified/misinfo */}
            {activeTab !== 'location' && (
              <div className="flex items-center gap-1 no-scrollbar overflow-x-auto">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    id={`cat-${cat.id}`}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-violet/15 text-violet border border-violet/30'
                        : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {/* Refresh */}
            <button
              id="refresh-news-btn"
              onClick={() => loadTrendingNews(activeCategory)}
              disabled={loadingTrending}
              className="btn-primary ml-auto"
            >
              <svg
                className={`w-3.5 h-3.5 ${loadingTrending ? 'animate-spin' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 4v6h-6M1 20v-6h6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {loadingTrending ? 'Loading…' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Section header per tab ── */}
      {!isLoading && <SectionHeader tab={activeTab} count={articles.length} />}

      {/* ── No-country state for location tab ── */}
      {activeTab === 'location' && !selectedCountry && (
        <EmptyState
          icon="🌍"
          title="No Location Selected"
          desc="Click any country on the globe above to load location-specific intelligence reports."
        />
      )}

      {/* ── Skeleton loading ── */}
      {isLoading && <SkeletonGrid count={6} />}

      {/* ── News grid ── */}
      {!isLoading && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {articles.map((article, i) => (
            <NewsCard
              key={article.id}
              article={article}
              large={i === 0 && activeTab === 'trending'}
            />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && articles.length === 0 && activeTab !== 'location' && (
        <EmptyState
          icon="📭"
          title="No articles found"
          desc={activeTab === 'verified'
            ? 'No verified articles in this category. Try refreshing.'
            : activeTab === 'misinfo'
            ? 'No flagged content detected — all clear!'
            : 'Try refreshing or switching categories.'}
        />
      )}
    </section>
  );
}

/* ── Per-tab section heading ── */
function SectionHeader({ tab, count }) {
  const config = {
    trending: { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20', label: '📡 Trending Intelligence', note: 'Latest global headlines, ranked by impact' },
    verified:  { color: 'text-verified', bg: 'bg-verified/10', border: 'border-verified/20', label: '✓ Verified Reports', note: 'Confirmed by trusted news organizations' },
    misinfo:   { color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', label: '⚠ Misinformation Alerts', note: 'Low-trust content — exercise caution' },
    location:  { color: 'text-violet', bg: 'bg-violet/10', border: 'border-violet/20', label: '📍 Location Intelligence', note: 'Regional-specific reports' },
  };

  const c = config[tab];
  if (!c || count === 0) return null;

  return (
    <div className={`flex items-center gap-3 mb-5 px-4 py-2.5 rounded-lg ${c.bg} border ${c.border}`}>
      <span className={`font-semibold text-sm ${c.color}`}>{c.label}</span>
      <span className="text-text-muted text-xs">·</span>
      <span className="text-text-muted text-xs">{c.note}</span>
    </div>
  );
}

/* ── Reusable empty state ── */
function EmptyState({ icon, title, desc }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl mb-5 opacity-50">{icon}</div>
      <h3 className="text-text-primary font-semibold text-lg mb-2">{title}</h3>
      <p className="text-text-muted text-sm max-w-xs leading-relaxed">{desc}</p>
    </div>
  );
}
