'use client';

import { useState, useMemo } from 'react';

const BONUS_ACTIONS = [
  {
    text: "Send a personal thank you to your most recent donor",
    emoji: "💌"
  },
  {
    text: "Share a teammate's fundraising page instead of yours",
    emoji: "🤝"
  },
  {
    text: "Text someone you haven't asked yet",
    emoji: "📱"
  },
  {
    text: "Post your fundraising link on your social media story",
    emoji: "📸"
  },
  {
    text: "Send a voice note to a potential donor instead of a text",
    emoji: "🎤"
  },
  {
    text: "Thank someone who shared your page or donated",
    emoji: "🙏"
  },
  {
    text: "Text a friend: 'Can you share my page with 3 people?'",
    emoji: "🔄"
  },
  {
    text: "Update your fundraising page with a personal story or photo",
    emoji: "✏️"
  },
];

export default function BonusAction({ dayNumber }) {
  const [dismissed, setDismissed] = useState(false);
  const [didIt, setDidIt] = useState(false);

  const bonus = useMemo(() => {
    return BONUS_ACTIONS[(dayNumber - 1) % BONUS_ACTIONS.length];
  }, [dayNumber]);

  if (dismissed) return null;

  return (
    <div className="bonus-card">
      <div className="bonus-header">
        <span className="bonus-badge">Bonus Challenge</span>
        <button className="bonus-dismiss" onClick={() => setDismissed(true)}>×</button>
      </div>
      <div className="bonus-content">
        <span className="bonus-emoji">{bonus.emoji}</span>
        <span className="bonus-text">{bonus.text}</span>
      </div>
      {!didIt ? (
        <button className="bonus-btn" onClick={() => setDidIt(true)}>
          Did it!
        </button>
      ) : (
        <div className="bonus-done">Nice! Every little bit counts.</div>
      )}
    </div>
  );
}
