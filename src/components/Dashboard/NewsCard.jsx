import TrustBadge, { getTrustProps } from './TrustBadge';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const CATEGORY_ICONS = {
  reuters: '⚡',
  'bbc-news': '📺',
  bloomberg: '💹',
  nasa: '🚀',
  'ap-news': '📰',
  'the-guardian': '🔍',
  cnn: '📡',
  default: '📄',
};

function sourceIcon(sourceId = '') {
  const k = sourceId.toLowerCase();
  return CATEGORY_ICONS[k] || CATEGORY_ICONS.default;
}

export default function NewsCard({ article, large = false, className = '' }) {
  if (!article) return null;

  const { label: trustLabel, icon: trustIcon, className: badgeCls } = getTrustProps(article.trustScore);
  const isHighTrust = article.trustScore >= 75;
  const isMisinfo = article.trustScore < 50;

  return (
    <a
      href={article.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        glass-card-hover block group overflow-hidden
        ${large ? 'md:col-span-2' : ''}
        ${isMisinfo ? 'border-danger/20' : ''}
        ${className}
      `}
    >
      {/* Trust accent bar (top edge) */}
      <div
        className="h-[2px] w-full"
        style={{
          background: isHighTrust
            ? 'linear-gradient(90deg, #22c55e, #22c55e80)'
            : isMisinfo
            ? 'linear-gradient(90deg, #ef4444, #ef444480)'
            : 'linear-gradient(90deg, #f59e0b, #f59e0b80)',
        }}
      />

      <div className={`p-5 ${large ? 'md:p-6' : ''}`}>
        {/* Badge row */}
        <div className="flex items-center gap-2 mb-3">
          {article.isBreaking && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-danger/10 border border-danger/25 text-danger text-[10px] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
              Breaking
            </span>
          )}
          <span className={`${badgeCls} ml-auto`}>
            <span className="font-bold">{trustIcon}</span>
            {trustLabel}
          </span>
        </div>

        {/* Featured trust bar (large card only) */}
        {large && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-[10px] text-text-muted mb-1">
              <span className="uppercase tracking-widest">Trust Index</span>
              <span className="font-mono">{article.trustScore}/100</span>
            </div>
            <div className="w-full h-1 rounded-full bg-surface-hover overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${article.trustScore}%`,
                  background: isHighTrust
                    ? 'linear-gradient(90deg, #3b82f6, #22c55e)'
                    : isMisinfo
                    ? 'linear-gradient(90deg, #ef4444, #f59e0b)'
                    : 'linear-gradient(90deg, #f59e0b, #3b82f6)',
                }}
              />
            </div>
          </div>
        )}

        {/* Title */}
        <h3
          className={`font-semibold text-text-primary leading-snug mb-2.5 group-hover:text-accent transition-colors duration-200 ${
            large ? 'text-base md:text-lg line-clamp-3' : 'text-sm line-clamp-2'
          }`}
        >
          {article.title}
        </h3>

        {/* Summary */}
        {article.summary && (
          <p className={`text-text-secondary text-xs leading-relaxed mb-4 ${large ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {article.summary}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm flex-shrink-0">{sourceIcon(article.sourceId)}</span>
            <span className="text-[11px] text-text-muted truncate font-medium">{article.source}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <svg className="w-3 h-3 text-text-muted flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] text-text-muted whitespace-nowrap">{timeAgo(article.timestamp)}</span>
          </div>
        </div>

        {/* External link cue */}
        <div className="mt-3 flex items-center gap-1 text-[10px] text-text-muted group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Read full report
        </div>
      </div>
    </a>
  );
}
