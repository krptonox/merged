// Trust score → badge props
export function getTrustProps(score) {
  if (score >= 75) return { label: 'Verified', icon: '✓', className: 'badge-verified' };
  if (score >= 50) return { label: 'Suspicious', icon: '⚠', className: 'badge-suspicious' };
  return { label: 'Unverified', icon: '✕', className: 'badge-danger' };
}

export default function TrustBadge({ score }) {
  const { label, icon, className } = getTrustProps(score);
  return (
    <span className={className} title={`Trust score: ${score}/100`}>
      <span className="font-bold">{icon}</span>
      {label}
      <span className="ml-0.5 opacity-60 text-[10px]">{score}</span>
    </span>
  );
}
