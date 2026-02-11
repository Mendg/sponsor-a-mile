'use client';

import { useState, useEffect } from 'react';

const GOAL_OPTIONS = [
  {
    id: 'starting',
    emoji: '🌱',
    label: "Haven't started yet",
    response: "We'll build momentum together. One small action at a time."
  },
  {
    id: 'progress',
    emoji: '📈',
    label: 'Making progress',
    response: "You've got momentum. Let's turn it into a machine."
  },
  {
    id: 'reached',
    emoji: '🎯',
    label: 'Already hit my goal',
    response: "The minimum was just the beginning. How much further can you go?"
  },
];

const JOURNEY = [
  { days: 3, emoji: '🌱' },
  { days: 7, emoji: '🔥' },
  { days: 14, emoji: '💪' },
  { days: 21, emoji: '👑' },
  { days: 24, emoji: '🏆' },
];

export default function WelcomeOverlay({ firstName, onDismiss }) {
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  const handleDismiss = () => {
    if (selectedGoal) {
      try { localStorage.setItem('coaching_goal_status', selectedGoal.id); } catch {}
    }
    onDismiss();
  };

  return (
    <div className={`welcome-overlay ${show ? 'visible' : ''}`}>
      <div className="welcome-card">
        {step === 0 ? (
          <>
            <div className="welcome-emoji">🏃</div>
            <h2 className="welcome-title">Welcome, {firstName}!</h2>
            <p className="welcome-text">
              You're raising funds so teens and kids with special needs
              can experience real friendship.
            </p>
            <p className="welcome-text" style={{ fontWeight: 600, color: '#1f2937' }}>
              24 days. One action per day.<br />
              That's all it takes.
            </p>

            <div className="welcome-journey">
              {JOURNEY.map((m, i) => (
                <span key={m.days} className="welcome-journey-stop">
                  {m.emoji} {m.days}
                  {i < JOURNEY.length - 1 && (
                    <span className="welcome-journey-arrow"> → </span>
                  )}
                </span>
              ))}
            </div>

            <button className="welcome-btn" onClick={() => setStep(1)}>
              Next →
            </button>
          </>
        ) : (
          <>
            <h2 className="welcome-title">
              Where are you with fundraising?
            </h2>

            <div className="goal-options">
              {GOAL_OPTIONS.map(goal => (
                <button
                  key={goal.id}
                  className={`goal-card ${selectedGoal?.id === goal.id ? 'selected' : ''}`}
                  onClick={() => setSelectedGoal(goal)}
                >
                  <span className="goal-card-emoji">{goal.emoji}</span>
                  <span className="goal-card-label">{goal.label}</span>
                </button>
              ))}
            </div>

            {selectedGoal && (
              <div className="goal-response">
                {selectedGoal.response}
              </div>
            )}

            <button
              className="welcome-btn"
              onClick={handleDismiss}
              disabled={!selectedGoal}
              style={{ opacity: selectedGoal ? 1 : 0.4 }}
            >
              Let's Go!
            </button>
          </>
        )}
      </div>
    </div>
  );
}
