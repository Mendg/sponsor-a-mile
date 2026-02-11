'use client';

import { useState, useEffect } from 'react';
import '@/styles/coaching.css';
import TierBadge from '@/components/coaching/TierBadge';
import { formatCurrency } from '@/lib/utils';

export default function AdminCoachingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enrollment form state
  const [enrollName, setEnrollName] = useState('');
  const [enrollPhone, setEnrollPhone] = useState('');
  const [enrollUrl, setEnrollUrl] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollResult, setEnrollResult] = useState(null);

  // Nudge state
  const [nudgeRunner, setNudgeRunner] = useState(null);
  const [nudgeMessage, setNudgeMessage] = useState('');
  const [nudging, setNudging] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch('/api/coaching/admin', {
        headers: { 'x-webhook-secret': 'admin' }
      });
      if (!res.ok) throw new Error('Failed to load admin data');
      const adminData = await res.json();
      setData(adminData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();
    setEnrolling(true);
    setEnrollResult(null);

    try {
      const res = await fetch('/api/coaching/admin/runners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': 'admin'
        },
        body: JSON.stringify({
          name: enrollName,
          phone: enrollPhone,
          neon_fundraise_url: enrollUrl || null
        })
      });

      const result = await res.json();
      if (result.success) {
        setEnrollResult({ success: true, url: result.coaching_url });
        setEnrollName('');
        setEnrollPhone('');
        setEnrollUrl('');
        loadData();
      } else {
        setEnrollResult({ success: false, error: result.error });
      }
    } catch (err) {
      setEnrollResult({ success: false, error: err.message });
    } finally {
      setEnrolling(false);
    }
  };

  const handleNudge = async () => {
    if (!nudgeRunner || !nudgeMessage) return;
    setNudging(true);

    try {
      const res = await fetch('/api/coaching/admin/nudge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': 'admin'
        },
        body: JSON.stringify({ runner_id: nudgeRunner.id, message: nudgeMessage })
      });

      const result = await res.json();
      if (result.success) {
        alert(`Nudge sent to ${nudgeRunner.name}`);
        setNudgeRunner(null);
        setNudgeMessage('');
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setNudging(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-coaching">
        <div className="loading"><div className="loading-spinner"></div></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-coaching">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const { summary, runners } = data;

  return (
    <div className="admin-coaching">
      <h1 style={{ marginBottom: '8px' }}>Coaching Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.9rem' }}>
        {summary.current_day ? `Day ${summary.current_day} of 24` : 'Program not started yet'}
      </p>

      {/* Summary Cards */}
      <div className="admin-summary">
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(summary.total_raised)}</div>
          <div className="stat-label">Total Raised</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.active_runners}</div>
          <div className="stat-label">Active Runners</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.active_today}</div>
          <div className="stat-label">Completed Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.completion_rate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
      </div>

      {/* Enrollment Form */}
      <div className="enroll-form">
        <h3>Enroll Runner</h3>
        <form onSubmit={handleEnroll}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Full Name"
              value={enrollName}
              onChange={e => setEnrollName(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone (e.g. 212-555-1234)"
              value={enrollPhone}
              onChange={e => setEnrollPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="url"
              placeholder="Neon Fundraise URL (optional)"
              value={enrollUrl}
              onChange={e => setEnrollUrl(e.target.value)}
            />
            <button type="submit" className="enroll-btn" disabled={enrolling}>
              {enrolling ? 'Enrolling...' : 'Enroll'}
            </button>
          </div>
        </form>
        {enrollResult && (
          <div style={{
            marginTop: '12px',
            padding: '10px',
            borderRadius: '8px',
            background: enrollResult.success ? '#f0fdf4' : '#fef2f2',
            fontSize: '0.85rem'
          }}>
            {enrollResult.success ? (
              <span>Enrolled! Dashboard: <a href={enrollResult.url} target="_blank" rel="noopener noreferrer">{enrollResult.url}</a></span>
            ) : (
              <span style={{ color: '#dc2626' }}>Error: {enrollResult.error}</span>
            )}
          </div>
        )}
      </div>

      {/* Runner Table */}
      <div className="coaching-card">
        <div className="coaching-card-header">
          <span className="coaching-card-title">All Runners</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Day</th>
                <th>Streak</th>
                <th>Raised</th>
                <th>Tier</th>
                <th>Today</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {runners.map(runner => (
                <tr key={runner.id}>
                  <td style={{ fontWeight: 600 }}>{runner.name}</td>
                  <td style={{ fontSize: '0.8rem' }}>{runner.phone}</td>
                  <td>{runner.last_completed_day || 0}</td>
                  <td>{runner.days_completed}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(runner.total_raised)}</td>
                  <td><TierBadge tier={runner.tier} /></td>
                  <td>{runner.completed_today ? '✅' : '❌'}</td>
                  <td>
                    {runner.stalling ? (
                      <span className="stalling">Stalling</span>
                    ) : runner.coaching_active ? (
                      <span style={{ color: '#22c55e' }}>Active</span>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>Inactive</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="nudge-btn"
                      onClick={() => {
                        setNudgeRunner(runner);
                        setNudgeMessage(`Hey ${runner.name.split(' ')[0]}, `);
                      }}
                    >
                      Nudge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nudge Modal */}
      {nudgeRunner && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '16px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px'
          }}>
            <h3 style={{ marginBottom: '12px' }}>Nudge {nudgeRunner.name}</h3>
            <textarea
              value={nudgeMessage}
              onChange={e => setNudgeMessage(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem',
                resize: 'vertical',
                marginBottom: '12px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { setNudgeRunner(null); setNudgeMessage(''); }}
                style={{
                  flex: 1, padding: '10px', border: '1px solid #d1d5db',
                  borderRadius: '8px', background: 'white', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleNudge}
                disabled={nudging || !nudgeMessage}
                className="enroll-btn"
                style={{ flex: 1 }}
              >
                {nudging ? 'Sending...' : 'Send SMS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
