'use client';

import { useState } from 'react';
import CompletionCelebration from './CompletionCelebration';

export default function MarkCompleteButton({ token, dayNumber, isCompleted, easyMode, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(isCompleted);
  const [celebrationData, setCelebrationData] = useState(null);

  if (done && !celebrationData) {
    return (
      <button className="complete-btn completed" disabled>
        Done
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
        setCelebrationData(data);
        if (onComplete) onComplete(data);
      }
    } catch (err) {
      console.error('Complete error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!done && (
        <button
          className={`complete-btn ${loading ? 'loading' : ''}`}
          onClick={handleComplete}
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          ) : "I Did It!"}
        </button>
      )}
      {celebrationData && (
        <CompletionCelebration
          streak={celebrationData.streak}
          dayNumber={dayNumber}
          totalRaised={celebrationData.total_raised || 0}
          tier={celebrationData.tier}
          token={token}
          onDismiss={() => setCelebrationData(null)}
        />
      )}
    </>
  );
}
