'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export default function AchievementCard({ type, value, runnerName, onShare }) {
  const cardRef = useRef(null);
  const [generating, setGenerating] = useState(false);

  // Achievement metadata
  const achievements = {
    'streak_7': {
      emoji: '🔥',
      title: '7-Day Streak!',
      subtitle: 'Showed up every day',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
    },
    'streak_14': {
      emoji: '🔥🔥',
      title: '14-Day Streak!',
      subtitle: 'Unstoppable momentum',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    'streak_21': {
      emoji: '👑',
      title: '21-Day Streak!',
      subtitle: 'This is who you are now',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
    'raised_500': {
      emoji: '⚡',
      title: '$500 Raised!',
      subtitle: 'On Fire',
      color: '#36bbae',
      gradient: 'linear-gradient(135deg, #36bbae, #2d9488)'
    },
    'raised_1000': {
      emoji: '🌟',
      title: '$1,000 Raised!',
      subtitle: 'Superstar Status',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    },
    'raised_1500': {
      emoji: '💎',
      title: '$1,500 Raised!',
      subtitle: 'All-Star Performance',
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #a855f7, #9333ea)'
    },
    'raised_2500': {
      emoji: '🏆',
      title: '$2,500 Raised!',
      subtitle: 'Goal Reached!',
      color: '#eab308',
      gradient: 'linear-gradient(135deg, #eab308, #ca8a04)'
    },
    'tier_legend': {
      emoji: '👑',
      title: 'Legend Tier!',
      subtitle: '$2,500+ Raised',
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #a855f7, #9333ea)'
    },
    'halfway': {
      emoji: '🎯',
      title: 'Halfway There!',
      subtitle: 'Day 12 Complete',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    'perfect_week': {
      emoji: '💪',
      title: 'Perfect Week!',
      subtitle: '7 days, 7 completions',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    }
  };

  const achievement = achievements[type] || achievements.raised_500;

  const generateImage = async () => {
    if (!cardRef.current || generating) return;

    setGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false
      });

      const imageUrl = canvas.toDataURL('image/png');

      if (onShare) {
        onShare(imageUrl);
      } else {
        // Download
        const link = document.createElement('a');
        link.download = `team-friendship-${type}.png`;
        link.href = imageUrl;
        link.click();
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="achievement-share-container">
      <div ref={cardRef} className="achievement-card-render" style={{ '--achievement-color': achievement.color }}>
        <div className="achievement-bg" style={{ background: achievement.gradient }} />

        <div className="achievement-content">
          <div className="achievement-emoji">{achievement.emoji}</div>
          <div className="achievement-title">{achievement.title}</div>
          <div className="achievement-subtitle">{achievement.subtitle}</div>

          <div className="achievement-runner-name">{runnerName}</div>

          <div className="achievement-footer">
            <div className="achievement-logo">
              <span style={{ fontWeight: 800 }}>Team Friendship</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>NYC Half 2026</span>
            </div>
            <div className="achievement-qr">
              🌐
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={generateImage}
        disabled={generating}
        className="share-achievement-btn"
      >
        {generating ? 'Generating...' : '📸 Save & Share'}
      </button>
    </div>
  );
}
