'use client';

export default function TeamQuest({ quest }) {
  if (!quest) return null;

  const progressPercent = Math.min(100, (quest.current_value / quest.target_value) * 100);
  const isCompleted = quest.is_completed;

  // Quest-specific formatting
  const formatValue = (value) => {
    if (quest.quest_type === 'fundraising') {
      return `$${Math.round(value).toLocaleString()}`;
    } else if (quest.quest_type === 'completion') {
      return `${Math.round(value)}%`;
    } else {
      return Math.round(value);
    }
  };

  // Quest metadata
  const questMeta = {
    fundraising: { emoji: '🐉', color: '#ef4444', label: 'Raise' },
    completion: { emoji: '👹', color: '#f59e0b', label: 'Complete' },
    shares: { emoji: '🗿', color: '#8b5cf6', label: 'Share' }
  };

  const meta = questMeta[quest.quest_type] || questMeta.fundraising;

  return (
    <div className="team-quest-card" style={{ '--quest-color': meta.color }}>
      <div className="quest-header">
        <div className="quest-emoji">{meta.emoji}</div>
        <div className="quest-title-section">
          <div className="quest-week">Week {quest.week_number} Boss Battle</div>
          <div className="quest-name">{quest.quest_name}</div>
        </div>
        {isCompleted && (
          <div className="quest-completed-badge">
            ✓ Defeated!
          </div>
        )}
      </div>

      <div className="quest-progress-section">
        <div className="quest-progress-bar">
          <div
            className="quest-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="quest-stats">
          <div className="quest-current">{formatValue(quest.current_value)}</div>
          <div className="quest-target">of {formatValue(quest.target_value)}</div>
        </div>
      </div>

      <div className="quest-footer">
        <div className="quest-health">
          {isCompleted ? (
            <span>🏆 Boss Defeated!</span>
          ) : (
            <>
              <span className="quest-health-label">Boss Health:</span>
              <span className="quest-health-value">{Math.max(0, 100 - progressPercent).toFixed(0)}%</span>
            </>
          )}
        </div>
        <div className="quest-reward">
          {quest.reward_badge && (
            <span className="quest-badge-icon">🎖️ {quest.reward_badge}</span>
          )}
        </div>
      </div>
    </div>
  );
}
