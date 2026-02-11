'use client';

const MILESTONES = [
  { days: 3, label: 'Warming Up', emoji: '🌱' },
  { days: 7, label: 'On Fire', emoji: '🔥' },
  { days: 14, label: 'Unstoppable', emoji: '💪' },
  { days: 21, label: 'Legend', emoji: '👑' },
  { days: 24, label: 'Perfect Run', emoji: '🏆' },
];

export default function StreakLadder({ streak }) {
  return (
    <div className="coaching-card">
      <div className="coaching-card-header">
        <span className="coaching-card-title">Streak Milestones</span>
      </div>
      <div className="streak-ladder">
        {MILESTONES.map((milestone, index) => {
          const reached = streak >= milestone.days;
          const isNext = !reached && (index === 0 || streak >= MILESTONES[index - 1].days);

          return (
            <div
              key={milestone.days}
              className={`sl-item ${reached ? 'reached' : ''} ${isNext ? 'next' : ''}`}
            >
              <div className="sl-node">
                {reached ? '✓' : milestone.emoji}
              </div>
              <div className="sl-info">
                <span className="sl-days">{milestone.days} days</span>
                <span className="sl-label">{milestone.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
