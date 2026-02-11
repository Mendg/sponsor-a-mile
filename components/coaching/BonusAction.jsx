'use client';

import { useState, useEffect, useMemo } from 'react';

const BONUS_ACTIONS = [
  {
    text: "Send a personal thank you to your most recent donor",
    emoji: "💌",
    action: "sms",
    actionLabel: "Open Messages"
  },
  {
    text: "Share a teammate's fundraising page instead of yours",
    emoji: "🤝",
    action: null
  },
  {
    text: "Text someone you haven't asked yet",
    emoji: "📱",
    action: "sms",
    actionLabel: "Open Messages"
  },
  {
    text: "Post your fundraising link on your social media story",
    emoji: "📸",
    action: "share",
    actionLabel: "Share Now"
  },
  {
    text: "Send a voice note to a potential donor instead of a text",
    emoji: "🎤",
    action: "whatsapp",
    actionLabel: "Open WhatsApp"
  },
  {
    text: "Thank someone who shared your page or donated",
    emoji: "🙏",
    action: "sms",
    actionLabel: "Open Messages"
  },
  {
    text: "Text a friend: 'Can you share my page with 3 people?'",
    emoji: "🔄",
    action: "sms",
    actionLabel: "Open Messages"
  },
  {
    text: "Update your fundraising page with a personal story or photo",
    emoji: "✏️",
    action: null
  },
];

export default function BonusAction({ dayNumber, fundraiseUrl, token }) {
  const storageKey = token ? `bonus_${token}_day${dayNumber}` : null;

  const [dismissed, setDismissed] = useState(false);
  const [didIt, setDidIt] = useState(false);

  useEffect(() => {
    if (!storageKey) return;
    try {
      if (localStorage.getItem(`${storageKey}_dismissed`) === 'true') {
        setDismissed(true);
      }
      if (localStorage.getItem(`${storageKey}_done`) === 'true') {
        setDidIt(true);
      }
    } catch {}
  }, [storageKey]);

  const bonus = useMemo(() => {
    return BONUS_ACTIONS[(dayNumber - 1) % BONUS_ACTIONS.length];
  }, [dayNumber]);

  const handleAction = () => {
    if (bonus.action === 'sms') {
      // Open native SMS app
      window.location.href = 'sms:';
    } else if (bonus.action === 'whatsapp') {
      // Open WhatsApp
      window.location.href = 'https://wa.me/';
    } else if (bonus.action === 'share' && fundraiseUrl) {
      // Open share sheet
      if (navigator.share) {
        navigator.share({
          title: 'Support My Fundraiser',
          url: fundraiseUrl
        }).catch(() => {});
      } else {
        // Fallback: copy link
        navigator.clipboard.writeText(fundraiseUrl);
        alert('Link copied to clipboard!');
      }
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (storageKey) {
      try {
        localStorage.setItem(`${storageKey}_dismissed`, 'true');
      } catch {}
    }
  };

  const handleDidIt = () => {
    setDidIt(true);
    if (storageKey) {
      try {
        localStorage.setItem(`${storageKey}_done`, 'true');
      } catch {}
    }
  };

  if (dismissed) return null;

  return (
    <div className="bonus-card">
      <div className="bonus-header">
        <span className="bonus-badge">Bonus Challenge</span>
        <button className="bonus-dismiss" onClick={handleDismiss}>×</button>
      </div>
      <div className="bonus-content">
        <span className="bonus-emoji">{bonus.emoji}</span>
        <span className="bonus-text">{bonus.text}</span>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {bonus.action && (
          <button
            className="bonus-action-btn"
            onClick={handleAction}
          >
            {bonus.actionLabel}
          </button>
        )}
        {!didIt ? (
          <button className="bonus-btn" onClick={handleDidIt}>
            Did it!
          </button>
        ) : (
          <div className="bonus-done">Nice! Every little bit counts.</div>
        )}
      </div>
    </div>
  );
}
