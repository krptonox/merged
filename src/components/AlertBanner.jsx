import { useEffect, useState } from 'react';
import useStore from '../store/useStore';

const STATIC_ALERTS = [
  '🔴 BREAKING: Seismic activity detected near tectonic boundary in Southeast Asia',
  '🟡 ALERT: Diplomatic tensions rise between regional powers over maritime dispute',
  '🔴 CRITICAL: Humanitarian crisis worsens — 2.4M displaced in conflict zone',
  '🟡 MONITOR: Cyber infrastructure attack reported — investigation underway',
  '🔴 URGENT: Extreme weather event affecting coastal regions — evacuation orders issued',
  '🟡 WATCH: Supply chain disruption impacts global semiconductor market',
  '🔴 THREAT: Unconfirmed reports of military mobilization near border region',
  '🟡 DEVELOPING: G20 emergency summit called amid global economic instability',
];

export default function AlertBanner({ show = true }) {
  const { crisisAlerts } = useStore();
  const [paused, setPaused] = useState(false);

  const rawAlerts = crisisAlerts.length > 0
    ? crisisAlerts.map((a, i) => (i % 2 === 0 ? '🔴' : '🟡') + ' ' + a.slice(0, 120))
    : STATIC_ALERTS;

  // Quadruple-duplicate for seamless infinite scroll
  const tickerContent = [...rawAlerts, ...rawAlerts, ...rawAlerts, ...rawAlerts];

  if (!show) return null;

  return (
    <div
      className="relative overflow-hidden border-b border-danger/20"
      style={{
        height: '32px',
        background: 'linear-gradient(90deg, rgba(239,68,68,0.08) 0%, rgba(13,17,23,0.9) 20%, rgba(13,17,23,0.9) 80%, rgba(245,158,11,0.08) 100%)',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Left "ALERT" label ── */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-2 px-3 bg-danger border-r border-danger/50 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse flex-shrink-0" />
        <span className="text-white font-bold text-[9px] tracking-[0.2em] uppercase whitespace-nowrap">Alert</span>
      </div>

      {/* ── Scrolling ticker ── */}
      <div className="pl-[72px] h-full flex items-center overflow-hidden">
        <div
          className="flex items-center gap-12 text-[11px] text-text-secondary font-medium whitespace-nowrap"
          style={{
            animation: `ticker 80s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
            willChange: 'transform',
          }}
        >
          {tickerContent.map((alert, i) => (
            <span key={i} className="flex items-center gap-2.5 flex-shrink-0">
              {alert}
              <span className="text-border/50 select-none">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Right fade gradient ── */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-bg-secondary to-transparent pointer-events-none z-10" />
      <div className="absolute left-[72px] top-0 bottom-0 w-4 bg-gradient-to-r from-bg-secondary to-transparent pointer-events-none z-10" />
    </div>
  );
}
