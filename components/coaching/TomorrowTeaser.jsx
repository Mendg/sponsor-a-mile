'use client';

const PHASE_EMOJI = {
  foundation: '🌱',
  expand: '🚀',
  push: '⚡',
  close: '🏁',
};

export default function TomorrowTeaser({ nextDay }) {
  if (!nextDay) return null;

  const emoji = PHASE_EMOJI[nextDay.phase] || '📋';

  return (
    <div className="tomorrow-card">
      <div className="tomorrow-label">Coming tomorrow</div>
      <div className="tomorrow-title">
        {emoji} Day {nextDay.day_number}: {nextDay.title}
      </div>
    </div>
  );
}
