'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

const RANK_EMOJI = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function TeamLeaderboard({ leaderboard, compact = false, token }) {
  const [sending, setSending] = useState({});

  if (!leaderboard || leaderboard.length === 0) return null;

  const items = compact ? leaderboard.slice(0, 5) : leaderboard;

  const handleHighFive = async (runnerId) => {
    if (!token || sending[runnerId]) return;

    setSending(prev => ({ ...prev, [runnerId]: true }));

    try {
      const res = await fetch('/api/coaching/high-five', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, recipient_id: runnerId })
      });

      if (res.ok) {
        // Show feedback
        setTimeout(() => {
          setSending(prev => ({ ...prev, [runnerId]: false }));
        }, 2000);
      } else {
        const error = await res.json();
        console.error('High-five error:', error);
        setSending(prev => ({ ...prev, [runnerId]: false }));
      }
    } catch (err) {
      console.error('High-five error:', err);
      setSending(prev => ({ ...prev, [runnerId]: false }));
    }
  };

  return (
    <div className="coaching-card">
      <div className="coaching-card-header">
        <span className="coaching-card-title">Team Leaderboard</span>
        {compact && leaderboard.length > 5 && (
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{leaderboard.length} runners</span>
        )}
      </div>
      <ul className="leaderboard-list">
        {items.map((runner, index) => (
          <li key={runner.id} className={`leaderboard-item ${runner.is_me ? 'is-me' : ''}`}>
            <span className={`leaderboard-rank ${index < 3 ? 'top-3' : ''}`}>
              {RANK_EMOJI[index + 1] || index + 1}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="leaderboard-name">
                {runner.name.split(' ')[0]}
                {runner.is_me && ' (You)'}
              </span>
              {runner.streak > 0 && (
                <span className="leaderboard-streak">🔥{runner.streak}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ textAlign: 'right' }}>
                <span className="leaderboard-amount">
                  {formatCurrency(runner.total_raised)}
                </span>
                {runner.rank_change !== undefined && runner.rank_change !== 0 && (
                  <div className={`rank-change ${runner.rank_change > 0 ? 'up' : 'down'}`}>
                    {runner.rank_change > 0 ? `▲${runner.rank_change}` : `▼${Math.abs(runner.rank_change)}`}
                  </div>
                )}
              </div>
              {!runner.is_me && token && (
                <button
                  onClick={() => handleHighFive(runner.id)}
                  disabled={sending[runner.id]}
                  className="high-five-btn"
                  title="Give High-Five"
                >
                  {sending[runner.id] ? '✓' : '🙌'}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
