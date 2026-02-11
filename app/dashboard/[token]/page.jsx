'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import '@/styles/coaching.css';
import TierBadge from '@/components/coaching/TierBadge';
import ProgressRing from '@/components/coaching/ProgressRing';
import TeamLeaderboard from '@/components/coaching/TeamLeaderboard';
import ActivityFeed from '@/components/coaching/ActivityFeed';
import StreakLadder from '@/components/coaching/StreakLadder';
import DonorThankCard from '@/components/coaching/DonorThankCard';
import TeamQuest from '@/components/coaching/TeamQuest';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const params = useParams();
  const token = params.token;

  const [data, setData] = useState(null);
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        const [dashRes, questRes] = await Promise.all([
          fetch(`/api/coaching/runner/${token}`),
          fetch(`/api/coaching/quest`)
        ]);

        if (!dashRes.ok) {
          const errData = await dashRes.json();
          throw new Error(errData.error || 'Failed to load');
        }

        const dashData = await dashRes.json();
        setData(dashData);

        if (questRes.ok) {
          const questData = await questRes.json();
          setQuest(questData.quest);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Poll every 30 seconds for updates
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [token]);

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
          <div className="error-emoji">😕</div>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  const { runner, stats, activity, leaderboard } = data;
  const daysRemaining = 24 - (stats.days_completed || 0);

  return (
    <div className="coaching-page" style={{ paddingBottom: '24px' }}>
      {/* Header */}
      <div className="coaching-header">
        <div className="coaching-header-left">
          <div>
            <div style={{ fontSize: '0.7rem', opacity: 0.6, letterSpacing: '0.5px' }}>B"H</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{runner.name.split(' ')[0]}'s Dashboard</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {stats.points_balance > 0 && (
            <div style={{
              background: 'rgba(251,191,36,0.2)',
              color: '#fbbf24',
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '0.8rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ⭐ {stats.points_balance}
            </div>
          )}
          <TierBadge tier={stats.tier} />
        </div>
      </div>

      <div className="coaching-body">
        {/* Donor Thank Nudge */}
        <DonorThankCard activity={activity} fundraiseUrl={runner.neon_fundraise_url} />

        {/* Team Quest */}
        {quest && <TeamQuest quest={quest} />}

        {/* Hero: Streak + Progress Ring */}
        <div className="dash-hero">
          <ProgressRing current={stats.days_completed || 0} total={24} size={160} strokeWidth={10}>
            <div className="dash-hero-streak">🔥</div>
            <div className="dash-hero-number">{stats.streak}</div>
            <div className="dash-hero-label">day streak</div>
          </ProgressRing>
          <div className="dash-hero-sub">
            {daysRemaining > 0
              ? `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} to go`
              : 'Challenge complete!'
            }
          </div>
          {stats.freezes_available > 0 && (
            <div className="freeze-indicator">
              🧊 x{stats.freezes_available} {stats.freezes_available === 1 ? 'freeze' : 'freezes'} available
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="dash-stats">
          <div className="dash-stat-card raised">
            <div className="dash-stat-value">{formatCurrency(stats.total_raised)}</div>
            <div className="dash-stat-label">Raised</div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-value">{stats.days_completed}/24</div>
            <div className="dash-stat-label">Days Done</div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-value">#{stats.leaderboard_position || '—'}</div>
            <div className="dash-stat-label">Rank</div>
          </div>
        </div>

        {/* Next Tier Progress */}
        {stats.next_tier && (
          <div className="tier-progress-card">
            <div className="tier-progress-header">
              <span>Next: <strong>{stats.next_tier.name}</strong></span>
              <span className="tier-progress-remaining">
                {formatCurrency(stats.next_tier.remaining)} to go
              </span>
            </div>
            <div className="tier-progress-bar">
              <div
                className="tier-progress-fill"
                style={{ width: `${Math.min(100, (stats.total_raised / stats.next_tier.threshold) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Streak Milestones */}
        <StreakLadder streak={stats.streak} />

        {/* Today's Action CTA */}
        {stats.today_day && (
          <a href={`/day/${token}?d=${stats.today_day}`} className="today-cta">
            <div className="today-cta-left">
              <div className="today-cta-day">Day {stats.today_day}</div>
              <div className="today-cta-hint">Tap to see today's action</div>
            </div>
            <div className="today-cta-arrow">→</div>
          </a>
        )}

        {/* Team Leaderboard */}
        <TeamLeaderboard leaderboard={leaderboard} token={token} />

        {/* Activity Feed */}
        <ActivityFeed activity={activity} />

        {/* Share Fundraising Page */}
        {runner.neon_fundraise_url && (
          <a
            href={runner.neon_fundraise_url}
            target="_blank"
            rel="noopener noreferrer"
            className="share-page-btn"
          >
            Share My Fundraising Page
          </a>
        )}
      </div>
    </div>
  );
}
