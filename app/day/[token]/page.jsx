'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import '@/styles/coaching.css';
import StreakCounter from '@/components/coaching/StreakCounter';
import TierBadge from '@/components/coaching/TierBadge';
import ShareButtons from '@/components/coaching/ShareButtons';
import MarkCompleteButton from '@/components/coaching/MarkCompleteButton';
import { formatCurrency } from '@/lib/utils';

export default function DayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = params.token;
  const dayParam = searchParams.get('d');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [easyMode, setEasyMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;

    // First get runner data to find today's day if not specified
    async function loadData() {
      try {
        let dayNumber = dayParam;

        if (!dayNumber) {
          const runnerRes = await fetch(`/api/coaching/runner/${token}`);
          const runnerData = await runnerRes.json();
          if (runnerData.stats?.today_day) {
            dayNumber = runnerData.stats.today_day;
          } else {
            setError('No coaching day active today');
            setLoading(false);
            return;
          }
        }

        const res = await fetch(`/api/coaching/day/${token}/${dayNumber}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to load');
        }
        const dayData = await res.json();
        setData(dayData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token, dayParam]);

  const handleCopyTemplate = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleComplete = (result) => {
    setData(prev => ({
      ...prev,
      progress: { ...prev.progress, completed: true },
      stats: { ...prev.stats, streak: result.streak, total_raised: result.total_raised }
    }));
  };

  if (loading) {
    return (
      <div className="coaching-page">
        <div className="loading"><div className="loading-spinner"></div></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coaching-page">
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  const { runner, day, progress, stats } = data;
  const currentTemplates = easyMode && day.easy_mode_templates ? day.easy_mode_templates : day.templates;
  const currentPrompt = easyMode && day.easy_mode_prompt ? day.easy_mode_prompt : day.action_prompt;

  return (
    <div className="coaching-page">
      {/* Header */}
      <div className="coaching-header">
        <div className="coaching-header-left">
          <div>
            <div className="day-label">Day</div>
            <div className="day-number">{day.day_number} of 24</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StreakCounter streak={stats.streak} />
          <TierBadge tier={stats.tier} />
        </div>
      </div>

      {/* Body */}
      <div className="coaching-body">
        {/* Today's Title */}
        <h2 style={{ fontSize: '1.3rem', lineHeight: 1.3 }}>{day.title}</h2>

        {/* Lesson Card (collapsible) */}
        <div className="coaching-card lesson-card">
          <button className="lesson-toggle" onClick={() => setLessonOpen(!lessonOpen)}>
            <span>{lessonOpen ? '▼' : '▶'}</span>
            <span>{lessonOpen ? 'Hide' : 'Read'} today's lesson (90 sec)</span>
          </button>
          {lessonOpen && (
            <div className="lesson-content">
              {day.lesson.split('\n').map((line, i) => (
                <p key={i} style={{ marginBottom: line ? '8px' : '0' }}>{line}</p>
              ))}
            </div>
          )}
        </div>

        {/* Action Card */}
        <div className="coaching-card action-card">
          <div className="coaching-card-header">
            <span className="coaching-card-title">Today's Action</span>
          </div>

          <div className="action-prompt">
            {currentPrompt.split('\n').map((line, i) => (
              <p key={i} style={{ marginBottom: line ? '6px' : '0' }}>{line}</p>
            ))}
          </div>

          {/* Template Box */}
          {currentTemplates && (
            <div className="template-box">
              <button
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={() => handleCopyTemplate(currentTemplates)}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <div className="template-text">{currentTemplates}</div>
            </div>
          )}

          {/* Share Buttons */}
          <ShareButtons
            fundraiseUrl={runner.neon_fundraise_url}
            runnerName={runner.name}
          />
        </div>

        {/* Easy Mode Toggle */}
        {day.easy_mode_prompt && (
          <label className="easy-mode-toggle">
            <input
              type="checkbox"
              checked={easyMode}
              onChange={(e) => setEasyMode(e.target.checked)}
            />
            <span>Easy mode (shorter version)</span>
          </label>
        )}

        {/* Mark Complete Button */}
        <MarkCompleteButton
          token={token}
          dayNumber={day.day_number}
          isCompleted={progress.completed}
          easyMode={easyMode}
          onComplete={handleComplete}
        />
      </div>

      {/* Progress Footer */}
      <div className="progress-footer">
        <div className="footer-stat">
          <div className="footer-stat-value">{formatCurrency(stats.total_raised)}</div>
          <div className="footer-stat-label">Raised</div>
        </div>
        <div className="footer-stat">
          <div className="footer-stat-value">{stats.streak}</div>
          <div className="footer-stat-label">Streak</div>
        </div>
        <div className="footer-stat">
          <div className="footer-stat-value">{day.day_number}/24</div>
          <div className="footer-stat-label">Day</div>
        </div>
        <a href={`/dashboard/${token}`} style={{ textDecoration: 'none' }}>
          <div className="footer-stat">
            <div className="footer-stat-value" style={{ color: 'var(--fc-teal)' }}>→</div>
            <div className="footer-stat-label">Dashboard</div>
          </div>
        </a>
      </div>
    </div>
  );
}
