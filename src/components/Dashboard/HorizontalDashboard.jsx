import { useEffect, useRef, useCallback, useState } from 'react';
import useStore from '../../store/useStore';

/* ─────────────────────────────────────────────
   UTILITY
───────────────────────────────────────────── */
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ─────────────────────────────────────────────
   IMAGE NEWS CARD — featured card with photo
───────────────────────────────────────────── */
function ImageCard({ article, accent = '#3b82f6' }) {
  const [imgErr, setImgErr] = useState(false);
  const hasImg = article.image && !imgErr;

  return (
    <a
      href={article.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="img-card group flex-shrink-0"
    >
      {/* Photo */}
      <div className="img-card__photo">
        {hasImg ? (
          <img
            src={article.image}
            alt={article.title}
            className="img-card__img"
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <div className="img-card__no-photo" style={{ '--accent': accent }}>
            <span className="img-card__no-photo-icon">🌐</span>
          </div>
        )}
        <div className="img-card__photo-overlay" />

        {/* Source + time chips on image */}
        <div className="img-card__chips">
          <span className="img-card__chip">{article.source}</span>
          <span className="img-card__chip img-card__chip--time">{timeAgo(article.timestamp)}</span>
        </div>

        {/* Breaking badge */}
        {article.isBreaking && (
          <div className="img-card__breaking">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            BREAKING
          </div>
        )}
      </div>

      {/* Text body */}
      <div className="img-card__body">
        <h4 className="img-card__title">{article.title}</h4>
        {article.summary && (
          <p className="img-card__summary">{article.summary}</p>
        )}
      </div>

      {/* Hover glow accent bar */}
      <div className="img-card__accent-bar" style={{ background: accent }} />
    </a>
  );
}

/* ─────────────────────────────────────────────
   SKELETON — image card loading state
───────────────────────────────────────────── */
function ImageSkeleton() {
  return (
    <div className="img-card flex-shrink-0 animate-pulse">
      <div className="img-card__photo skeleton" />
      <div className="img-card__body">
        <div className="skeleton h-3 w-full mb-2 rounded" />
        <div className="skeleton h-3 w-4/5 mb-2 rounded" />
        <div className="skeleton h-2 w-3/5 rounded" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MINI CARD — compact card for other rails
───────────────────────────────────────────── */
function HCard({ article, accent }) {
  const [imgErr, setImgErr] = useState(false);
  const hasImg = article.image && !imgErr;

  return (
    <a
      href={article.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="h-card group flex-shrink-0"
    >
      {/* Image well */}
      <div className="h-card__img-wrap">
        {hasImg ? (
          <img src={article.image} alt={article.title} className="h-card__img"
            onError={() => setImgErr(true)} loading="lazy" />
        ) : (
          <div className="h-card__img-fallback">
            <span className="h-card__img-fallback-icon">🌐</span>
          </div>
        )}
        <div className="h-card__img-overlay" />
        <span className="h-card__img-trust" style={{ color: '#94a3b8', borderColor: 'rgba(148,163,184,0.3)', background: 'rgba(7,11,20,0.8)' }}>
          {article.source}
        </span>
        {article.isBreaking && (
          <div className="h-card__img-breaking">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
            <span>Breaking</span>
          </div>
        )}
      </div>

      {/* Stripe */}
      <div className="h-card__stripe" style={{ background: accent }} />

      {/* Body */}
      <div className="h-card__body">
        <h4 className="h-card__title">{article.title}</h4>
        {article.summary && <p className="h-card__summary">{article.summary}</p>}
        <div className="h-card__footer">
          <span className="h-card__source">{article.source}</span>
          <span className="h-card__time">{timeAgo(article.timestamp)}</span>
        </div>
      </div>
    </a>
  );
}

function HSkeletonCard() {
  return (
    <div className="h-card flex-shrink-0 animate-pulse">
      <div className="h-card__img-wrap skeleton" style={{ height: 136 }} />
      <div className="h-card__stripe skeleton" />
      <div className="h-card__body">
        <div className="skeleton h-3 w-full mb-1.5 rounded" />
        <div className="skeleton h-3 w-4/5 mb-3 rounded" />
        <div className="skeleton h-2 w-3/5 mt-auto rounded" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AUTO-SCROLLING RAIL
───────────────────────────────────────────── */
const SPEED = 0.7;

function ScrollRail({ id, title, icon, accent, articles, loading, emptyMsg }) {
  const railRef    = useRef(null);
  const rafRef     = useRef(null);
  const pausedRef  = useRef(false);
  const isDragging = useRef(false);
  const dragStart  = useRef({ x: 0, scrollLeft: 0 });

  useEffect(() => {
    const step = () => {
      const el = railRef.current;
      if (el && !pausedRef.current && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += SPEED;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line

  const scroll = useCallback((dir) => {
    const el = railRef.current;
    if (!el) return;
    pausedRef.current = true;
    el.scrollBy({ left: dir * 320, behavior: 'smooth' });
    setTimeout(() => { pausedRef.current = false; }, 3000);
  }, []);

  const onMouseDown = useCallback((e) => {
    const el = railRef.current;
    if (!el) return;
    isDragging.current = true;
    pausedRef.current  = true;
    dragStart.current  = { x: e.pageX, scrollLeft: el.scrollLeft };
    el.style.cursor    = 'grabbing';
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const el   = railRef.current;
    el.scrollLeft = dragStart.current.scrollLeft - (e.pageX - dragStart.current.x) * 1.2;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (railRef.current) railRef.current.style.cursor = 'grab';
    setTimeout(() => { pausedRef.current = false; }, 2000);
  }, []);

  return (
    <div
      className="h-rail"
      id={`rail-${id}`}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { if (!isDragging.current) pausedRef.current = false; }}
    >
      <div className="h-rail__head">
        <div className="h-rail__head-left">
          <span className="h-rail__icon" style={{ color: accent }}>{icon}</span>
          <div>
            <h3 className="h-rail__title">{title}</h3>
            <p className="h-rail__subtitle">
              {loading ? 'Fetching live data…' : articles.length > 0 ? `${articles.length} reports · auto-scrolling` : 'No reports'}
            </p>
          </div>
        </div>
        <div className="h-rail__nav">
          <button onClick={() => scroll(-1)} className="h-rail__nav-btn" aria-label="Left">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={() => scroll(1)} className="h-rail__nav-btn" aria-label="Right">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="h-rail__track-wrap">
        <div className="h-rail__fade h-rail__fade--left" />
        <div
          ref={railRef}
          className="h-rail__track no-scrollbar"
          role="list"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {loading
            ? Array.from({ length: 6 }, (_, i) => <HSkeletonCard key={i} />)
            : articles.length === 0
            ? <div className="h-card__empty"><span className="text-3xl opacity-30 mb-2">📭</span><p className="text-text-muted text-sm">{emptyMsg}</p></div>
            : [...articles, ...articles].map((a, i) => <HCard key={`${a.id}-${i}`} article={a} accent={accent} />)
          }
        </div>
        <div className="h-rail__fade h-rail__fade--right" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOVER COUNTRY — image-grid news section
───────────────────────────────────────────── */
function HoverCountrySection({ country, articles, loading }) {
  const accent = '#3b82f6';

  return (
    <div className="hover-section">
      {/* Section header */}
      <div className="hover-section__head">
        <div className="hover-section__head-left">
          <div className="hover-section__pulse" />
          <span className="hover-section__flag">{country.flag}</span>
          <div>
            <h2 className="hover-section__title">{country.name}</h2>
            <p className="hover-section__sub">Real-time local intelligence · Trending now</p>
          </div>
        </div>
        <div className="hover-section__badge">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          LIVE FEED
        </div>
      </div>

      {/* Image card strip */}
      <div className="hover-section__grid">
        {loading
          ? Array.from({ length: 5 }, (_, i) => <ImageSkeleton key={i} />)
          : articles.length === 0
          ? (
            <div className="hover-section__empty">
              <span className="text-3xl mb-2">📭</span>
              <p>No reports found for {country.name}.</p>
            </div>
          )
          : articles.map((a) => <ImageCard key={a.id} article={a} accent={accent} />)
        }
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function HorizontalDashboard() {
  const {
    trendingNews, hoverNews, loadingTrending, loadingHover,
    pinnedCountry, loadTrendingNews, activeCategory,
  } = useStore();

  useEffect(() => {
    loadTrendingNews(activeCategory);
  }, [activeCategory]); // eslint-disable-line

  const rails = [
    {
      id: 'trending', title: 'Trending Intelligence', icon: '📡',
      accent: '#3b82f6', articles: trendingNews, loading: loadingTrending,
      emptyMsg: 'No trending reports right now.',
    },
    {
      id: 'verified', title: 'Verified Reports', icon: '✓',
      accent: '#22c55e',
      articles: trendingNews.filter((a) => a.trustScore >= 75),
      loading: loadingTrending, emptyMsg: 'No verified reports.',
    },
    {
      id: 'misinfo', title: 'Misinformation Watch', icon: '⚠',
      accent: '#f59e0b',
      articles: trendingNews.filter((a) => a.trustScore < 50),
      loading: loadingTrending, emptyMsg: 'No flagged content detected.',
    },
  ];

  return (
    <section id="h-dashboard" className="h-dashboard">
      {/* ── Sticky header ── */}
      <div className="h-dashboard__header">
        <div className="h-dashboard__header-inner">
          <div className="h-dashboard__title-group">
            <div className="h-dashboard__logo-dot" />
            <div>
              <h2 className="h-dashboard__page-title">
                Intelligence <span className="text-gradient-accent">Feed</span>
              </h2>
              <p className="h-dashboard__page-sub">
                Hover any country on the globe · Real-time AI-verified reports
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="live-dot" />
            <span className="text-verified text-xs font-semibold tracking-widest uppercase">Live</span>
            <span className="text-border">|</span>
            <span className="text-text-muted text-xs font-mono">{trendingNews.length} feeds</span>
          </div>
        </div>
      </div>

      <div className="h-dashboard__rails">
        {/* ── Country hover section (top, prominent) ── */}
        {(pinnedCountry || loadingHover) && (
          <HoverCountrySection
            country={pinnedCountry || { name: '…', flag: '🌐' }}
            articles={hoverNews}
            loading={loadingHover}
          />
        )}

        {/* ── Global rails ── */}
        {rails.map((r) => <ScrollRail key={r.id} {...r} />)}
      </div>
    </section>
  );
}
