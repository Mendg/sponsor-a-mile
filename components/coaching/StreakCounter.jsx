'use client';

export default function StreakCounter({ streak, size = 'default' }) {
  if (size === 'large') {
    return (
      <div className="streak-badge-large">
        <span className="flame">{streak > 0 ? '🔥' : '💤'}</span>
        <span>{streak} day{streak === 1 ? '' : 's'}</span>
      </div>
    );
  }

  return (
    <div className="streak-badge">
      <span className="flame">{streak > 0 ? '🔥' : '💤'}</span>
      <span>{streak}</span>
    </div>
  );
}
