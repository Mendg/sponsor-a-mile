'use client';

import { formatCurrency } from '@/lib/utils';

export default function TeamLeaderboard({ leaderboard }) {
  if (!leaderboard || leaderboard.length === 0) return null;

  return (
    <div className="coaching-card">
      <div className="coaching-card-header">
        <span className="coaching-card-title">Team Leaderboard</span>
      </div>
      <ul className="leaderboard-list">
        {leaderboard.map((runner, index) => (
          <li key={runner.id} className={`leaderboard-item ${runner.is_me ? 'is-me' : ''}`}>
            <span className={`leaderboard-rank ${index < 3 ? 'top-3' : ''}`}>
              {index + 1}
            </span>
            <span className="leaderboard-name">
              {runner.name.split(' ')[0]}
              {runner.is_me && ' (You)'}
            </span>
            <span className="leaderboard-amount">
              {formatCurrency(runner.total_raised)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
