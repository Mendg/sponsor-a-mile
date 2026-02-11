'use client';

import { getRelativeTime, formatCurrency } from '@/lib/utils';

const EVENT_ICONS = {
  donation: { emoji: '💰', className: 'donation' },
  action_completed: { emoji: '✅', className: 'action' },
  milestone: { emoji: '🎉', className: 'milestone' },
};

export default function ActivityFeed({ activity }) {
  if (!activity || activity.length === 0) {
    return (
      <div className="coaching-card">
        <div className="coaching-card-header">
          <span className="coaching-card-title">Activity</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
          No activity yet. Complete today's action to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="coaching-card">
      <div className="coaching-card-header">
        <span className="coaching-card-title">Activity</span>
      </div>
      <ul className="activity-list">
        {activity.map((item) => {
          const icon = EVENT_ICONS[item.event_type] || { emoji: '📌', className: 'action' };
          return (
            <li key={item.id} className="activity-item">
              <div className={`activity-icon ${icon.className}`}>
                {icon.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div className="activity-text">
                  {item.title}
                  {item.amount ? ` ${formatCurrency(item.amount)}` : ''}
                </div>
                <div className="activity-time">{getRelativeTime(item.created_at)}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
