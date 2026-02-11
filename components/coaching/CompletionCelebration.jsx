'use client';

import { useEffect, useState } from 'react';
import ProgressRing from './ProgressRing';

const CONFETTI_COLORS = ['#36bbae', '#1b365d', '#ff6b35', '#22c55e', '#f59e0b', '#8b5cf6'];

function launchConfetti() {
  const pieces = [];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.width = `${6 + Math.random() * 8}px`;
    piece.style.height = `${6 + Math.random() * 8}px`;
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.appendChild(piece);
    pieces.push(piece);
  }
  setTimeout(() => pieces.forEach(p => p.remove()), 5000);
}

function getCelebrationTitle(dayNumber, streak) {
  if (dayNumber === 24) return "All 24 days complete!";
  if (dayNumber === 1) return "And so it begins!";
  if (dayNumber === 12) return "Halfway there!";
  if (streak >= 21) return "Legendary!";
  if (streak >= 14) return "Unstoppable!";
  if (streak >= 7) return "On fire!";
  const messages = [
    "Crushing it!",
    "Way to show up!",
    "That's how it's done!",
    "Another day, another win!",
    "Keep that momentum!",
    "You showed up!",
  ];
  return messages[(dayNumber - 1) % messages.length];
}

function getCelebrationEmoji(dayNumber, streak) {
  if (dayNumber === 24) return '🏆';
  if (dayNumber === 12) return '🎯';
  if (streak >= 7) return '🔥';
  return '🎉';
}

export default function CompletionCelebration({ streak, dayNumber, totalRaised, tier, token, milestones, runnerName, onDismiss }) {
  const [animatedStreak, setAnimatedStreak] = useState(streak - 1);
  const [show, setShow] = useState(false);
  const [AchievementCard, setAchievementCard] = useState(null);

  useEffect(() => {
    if (milestones && milestones.length > 0) {
      import('./AchievementCard').then(mod => setAchievementCard(() => mod.default));
    }
  }, [milestones]);

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    launchConfetti();
    requestAnimationFrame(() => setShow(true));
    const timer = setTimeout(() => setAnimatedStreak(streak), 400);
    return () => clearTimeout(timer);
  }, [streak]);

  return (
    <div className={`celebration-overlay ${show ? 'visible' : ''}`}>
      <div className="celebration-card">
        <div className="celebration-emoji">
          {getCelebrationEmoji(dayNumber, streak)}
        </div>

        <h2 className="celebration-title">{getCelebrationTitle(dayNumber, streak)}</h2>

        <div className="celebration-streak">
          <ProgressRing current={dayNumber} total={24} size={140} strokeWidth={10}>
            <div className="celebration-streak-number">{animatedStreak}</div>
            <div className="celebration-streak-label">day streak</div>
          </ProgressRing>
        </div>

        {streak === 3 && (
          <div className="celebration-milestone">3 days strong. You're building a habit.</div>
        )}
        {streak === 7 && (
          <div className="celebration-milestone">One week! Most people never get here.</div>
        )}
        {streak === 14 && (
          <div className="celebration-milestone">Two weeks. You're unstoppable.</div>
        )}
        {streak === 21 && (
          <div className="celebration-milestone">21 days. This is who you are now.</div>
        )}

        <div className="celebration-stats">
          <div className="celebration-stat">
            <span className="celebration-stat-value">${Math.round(totalRaised)}</span>
            <span className="celebration-stat-label">raised</span>
          </div>
          <div className="celebration-stat-divider" />
          <div className="celebration-stat">
            <span className="celebration-stat-value">{dayNumber}/24</span>
            <span className="celebration-stat-label">days</span>
          </div>
          {tier && (
            <>
              <div className="celebration-stat-divider" />
              <div className="celebration-stat">
                <span className="celebration-stat-value">{tier.emoji}</span>
                <span className="celebration-stat-label">{tier.name}</span>
              </div>
            </>
          )}
        </div>

        {milestones && milestones.length > 0 && AchievementCard && (
          <div className="celebration-achievement">
            <div className="celebration-achievement-label">You earned this!</div>
            <AchievementCard type={milestones[0]} runnerName={runnerName} />
          </div>
        )}

        <button className="celebration-dismiss" onClick={onDismiss}>
          {dayNumber === 24 ? 'Celebrate!' : 'Continue'}
        </button>
        {token && (
          <a href={`/dashboard/${token}`} className="celebration-dashboard-link">
            View Dashboard →
          </a>
        )}
      </div>
    </div>
  );
}
