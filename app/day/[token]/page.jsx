'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import '@/styles/coaching.css';
import StreakCounter from '@/components/coaching/StreakCounter';
import TierBadge from '@/components/coaching/TierBadge';
import ProgressRing from '@/components/coaching/ProgressRing';
import ShareButtons from '@/components/coaching/ShareButtons';
import MarkCompleteButton from '@/components/coaching/MarkCompleteButton';
import WelcomeOverlay from '@/components/coaching/WelcomeOverlay';
import TomorrowTeaser from '@/components/coaching/TomorrowTeaser';
import BonusAction from '@/components/coaching/BonusAction';
import { formatCurrency } from '@/lib/utils';

const PHASE_CONFIG = {
  foundation: { accent: '#36bbae', emoji: '🌱', label: 'Foundation' },
  expand: { accent: '#3b82f6', emoji: '🚀', label: 'Expand' },
  push: { accent: '#f59e0b', emoji: '⚡', label: 'Push' },
  close: { accent: '#ef4444', emoji: '🏁', label: 'Final Push' },
};

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
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        let dayNumber = dayParam;

        if (!dayNumber) {
          const runnerRes = await fetch(`/api/coaching/runner/${token}`);
          const runnerData = await runnerRes.json();
          if (runnerData.stats?.today_day) {
            dayNumber = runnerData.stats.today_day;
          } else {
            setError('No coaching day active today. Check back tomorrow!');
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

  useEffect(() => {
    if (data && token) {
      try {
        const welcomed = localStorage.getItem(`coaching_welcomed_${token}`);
        if (!welcomed) setShowWelcome(true);
      } catch {}
    }
  }, [data, token]);

  const handleWelcomeDismiss = () => {
    try { localStorage.setItem(`coaching_welcomed_${token}`, 'true'); } catch {}
    setShowWelcome(false);
  };

  const handleCopyTemplate = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    if (navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="error-state">
          <div className="error-emoji">😴</div>
          <div className="error-message">{error}</div>
          <a href={`/dashboard/${token}`} className="error-link">Go to Dashboard</a>
        </div>
      </div>
    );
  }

  const { runner, day, progress, stats } = data;
  const phase = PHASE_CONFIG[day.phase] || PHASE_CONFIG.foundation;
  const currentTemplates = easyMode && day.easy_mode_templates ? day.easy_mode_templates : day.templates;
  const currentPrompt = easyMode && day.easy_mode_prompt ? day.easy_mode_prompt : day.action_prompt;

  return (
    <div className="coaching-page" style={{ '--phase-accent': phase.accent }}>
      {showWelcome && (
        <WelcomeOverlay
          firstName={runner.name.split(' ')[0]}
          onDismiss={handleWelcomeDismiss}
        />
      )}

      {/* Header */}
      <div className="coaching-header">
        <div className="coaching-header-left">
          <ProgressRing current={day.day_number} total={24} size={44} strokeWidth={4}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{day.day_number}</span>
          </ProgressRing>
          <div>
            <div className="phase-label">{phase.emoji} {phase.label}</div>
            <div className="day-subtitle">Day {day.day_number} of 24</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <StreakCounter streak={stats.streak} />
          {stats.freezes_available > 0 && (
            <div style={{
              background: 'rgba(59,130,246,0.15)',
              color: '#2563eb',
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              🧊 x{stats.freezes_available}
            </div>
          )}
          <TierBadge tier={stats.tier} />
        </div>
      </div>

      {/* Body */}
      <div className="coaching-body">
        {/* Title with phase accent */}
        <div className="day-title-card" style={{ borderLeftColor: phase.accent }}>
          <h2 className="day-title">{day.title}</h2>
          <p className="day-sms-preview">{day.sms_text}</p>
        </div>

        {/* Lesson Card (collapsible) */}
        <div className="coaching-card lesson-card">
          <button className="lesson-toggle" onClick={() => setLessonOpen(!lessonOpen)}>
            <span className={`lesson-chevron ${lessonOpen ? 'open' : ''}`}>›</span>
            <span>90-second lesson</span>
          </button>
          <div className={`lesson-content-wrap ${lessonOpen ? 'open' : ''}`}>
            <div className="lesson-content">
              {day.lesson.split('\n').map((line, i) => (
                <p key={i}>{line || '\u00A0'}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="coaching-card action-card">
          <div className="action-header">
            <span className="action-badge">Today's Action</span>
            {day.easy_mode_prompt && (
              <button
                className={`easy-toggle ${easyMode ? 'active' : ''}`}
                onClick={() => setEasyMode(!easyMode)}
              >
                {easyMode ? 'Easy' : 'Full'}
              </button>
            )}
          </div>

          <div className="action-prompt">
            {currentPrompt.split('\n').map((line, i) => (
              <p key={i}>{line || '\u00A0'}</p>
            ))}
          </div>

          {/* Template Box */}
          {currentTemplates && (
            <div className="template-box">
              <div className="template-header">
                <span className="template-label">Copy-paste template</span>
                <button
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                  onClick={() => handleCopyTemplate(currentTemplates)}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="template-text">{currentTemplates}</div>
            </div>
          )}

          {/* Share Buttons */}
          <ShareButtons
            fundraiseUrl={runner.neon_fundraise_url}
            runnerName={runner.name}
          />
        </div>

        {/* Mark Complete Button */}
        <MarkCompleteButton
          token={token}
          dayNumber={day.day_number}
          isCompleted={progress.completed}
          easyMode={easyMode}
          onComplete={handleComplete}
          runnerName={runner.name}
        />

        {/* Post-completion engagement */}
        {progress.completed && (
          <>
            <BonusAction
              dayNumber={day.day_number}
              fundraiseUrl={runner.neon_fundraise_url}
              token={token}
            />
            <TomorrowTeaser nextDay={data.next_day} />
          </>
        )}
      </div>

      {/* Progress Footer */}
      <div className="progress-footer">
        <div className="footer-stat">
          <div className="footer-stat-value">{formatCurrency(stats.total_raised)}</div>
          <div className="footer-stat-label">Raised</div>
        </div>
        <div className="footer-divider" />
        <div className="footer-stat">
          <div className="footer-stat-value">🔥 {stats.streak}</div>
          <div className="footer-stat-label">Streak</div>
        </div>
        <div className="footer-divider" />
        <a href={`/dashboard/${token}`} className="footer-dashboard-link">
          Dashboard →
        </a>
      </div>
    </div>
  );
}
