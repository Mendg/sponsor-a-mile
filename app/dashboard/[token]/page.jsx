'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import '@/styles/coaching.css';
import StreakCounter from '@/components/coaching/StreakCounter';
import TierBadge from '@/components/coaching/TierBadge';
import TeamLeaderboard from '@/components/coaching/TeamLeaderboard';
import ActivityFeed from '@/components/coaching/ActivityFeed';
import MileTracker from '@/components/MileTracker';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const params = useParams();
  const token = params.token;

  const [data, setData] = useState(null);
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        const res = await fetch(`/api/coaching/runner/${token}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to load');
        }
        const dashData = await res.json();
        setData(dashData);

        // Load sponsorships for mile map
        if (dashData.runner.slug) {
          const mileRes = await fetch(`/api/runners/${dashData.runner.slug}`);
          if (mileRes.ok) {
            const mileData = await mileRes.json();
            setSponsorships(mileData.sponsorships || []);
          }
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
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  const { runner, stats, activity, leaderboard } = data;

  return (
    <div className="coaching-page" style={{ paddingBottom: '24px' }}>
      {/* Header */}
      <div className="coaching-header">
        <div className="coaching-header-left">
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>B"H</div>
            <div style={{ fontWeight: 700 }}>{runner.name.split(' ')[0]}'s Dashboard</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StreakCounter streak={stats.streak} />
          <TierBadge tier={stats.tier} />
        </div>
      </div>

      <div className="coaching-body">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(stats.total_raised)}</div>
            <div className="stat-label">Raised</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              <StreakCounter streak={stats.streak} size="large" />
            </div>
            <div className="stat-label">Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.days_completed}/24</div>
            <div className="stat-label">Days Done</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">#{stats.leaderboard_position}</div>
            <div className="stat-label">Rank</div>
          </div>
        </div>

        {/* Next Tier Progress */}
        {stats.next_tier && (
          <div className="coaching-card" style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span>Next: <strong>{stats.next_tier.name}</strong></span>
              <span style={{ color: 'var(--fc-teal)', fontWeight: 600 }}>
                {formatCurrency(stats.next_tier.remaining)} to go
              </span>
            </div>
            <div style={{
              height: '6px',
              background: '#e5e7eb',
              borderRadius: '3px',
              marginTop: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                background: 'var(--fc-teal)',
                borderRadius: '3px',
                width: `${Math.min(100, (stats.total_raised / stats.next_tier.threshold) * 100)}%`,
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        )}

        {/* Today's Action Link */}
        {stats.today_day && (
          <a href={`/day/${token}?d=${stats.today_day}`} className="today-action-link">
            <div className="today-action-title">
              Day {stats.today_day} Action →
            </div>
            <div className="today-action-subtitle">
              Tap to see today's fundraising action
            </div>
          </a>
        )}

        {/* Mile Map (read-only) */}
        <MileTracker
          totalMiles={runner.total_miles}
          mileIncrement={runner.mile_increment}
          sponsorships={sponsorships}
          pricePerMile={36}
        />

        {/* Team Leaderboard */}
        <TeamLeaderboard leaderboard={leaderboard} />

        {/* Activity Feed */}
        <ActivityFeed activity={activity} />

        {/* Donate Link */}
        {runner.neon_fundraise_url && (
          <a
            href={runner.neon_fundraise_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '14px',
              background: 'var(--fc-navy)',
              color: 'white',
              borderRadius: '12px',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Share My Fundraising Page
          </a>
        )}
      </div>
    </div>
  );
}
