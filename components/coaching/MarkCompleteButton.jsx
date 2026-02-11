'use client';

import { useState } from 'react';

const CONFETTI_COLORS = ['#36bbae', '#1b365d', '#ff6b35', '#22c55e', '#f59e0b', '#8b5cf6'];

function createConfetti() {
  const pieces = [];
  for (let i = 0; i < 50; i++) {
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

  setTimeout(() => {
    pieces.forEach(p => p.remove());
  }, 5000);
}

export default function MarkCompleteButton({ token, dayNumber, isCompleted, easyMode, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(isCompleted);

  if (done) {
    return (
      <button className="complete-btn completed" disabled>
        ✓ Completed!
      </button>
    );
  }

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/coaching/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, day_number: dayNumber, easy_mode: easyMode })
      });

      const data = await res.json();
      if (data.success) {
        setDone(true);
        createConfetti();
        if (onComplete) onComplete(data);
      }
    } catch (err) {
      console.error('Complete error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`complete-btn ${loading ? 'loading' : ''}`}
      onClick={handleComplete}
      disabled={loading}
    >
      {loading ? 'Saving...' : "I Did It! ✨"}
    </button>
  );
}
