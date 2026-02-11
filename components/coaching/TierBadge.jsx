'use client';

export default function TierBadge({ tier }) {
  if (!tier) return null;

  const className = `tier-badge ${tier.name.toLowerCase()}`;

  return (
    <span className={className}>
      {tier.emoji} {tier.name}
    </span>
  );
}
