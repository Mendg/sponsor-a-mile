'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f3f4f6',
  },
  header: {
    background: '#1b365d',
    color: 'white',
    padding: '20px',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '2px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 20px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1b365d',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: '32px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(27, 54, 93, 0.1)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1b365d',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#1b365d',
    marginBottom: '6px',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
  },
  inputHalf: {
    width: '48%',
    display: 'inline-block',
  },
  helpText: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    marginTop: '4px',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    background: '#36bbae',
    color: 'white',
    width: '100%',
    marginTop: '8px',
  },
  buttonDisabled: {
    background: '#e5e7eb',
    cursor: 'not-allowed',
  },
  successMessage: {
    background: '#d1fae5',
    color: '#065f46',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  errorMessage: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  runnerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  runnerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  runnerInfo: {
    flex: 1,
  },
  runnerName: {
    fontWeight: 600,
    color: '#1b365d',
    marginBottom: '4px',
  },
  runnerEvent: {
    fontSize: '0.85rem',
    color: '#6b7280',
  },
  runnerStats: {
    textAlign: 'right',
    marginRight: '16px',
  },
  runnerRaised: {
    fontWeight: 600,
    color: '#36bbae',
  },
  runnerMiles: {
    fontSize: '0.85rem',
    color: '#6b7280',
  },
  runnerActions: {
    display: 'flex',
    gap: '8px',
  },
  linkButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    border: '1px solid #e5e7eb',
    background: 'white',
    color: '#6b7280',
    textDecoration: 'none',
  },
  copyButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    border: '1px solid #36bbae',
    background: 'white',
    color: '#36bbae',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6b7280',
  },
};

export default function AdminPage() {
  const [runners, setRunners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    event_name: 'Team Friendship: The Beaches',
    event_date: '2026-01-30',
    donation_url: '',
    photo_url: '',
    total_miles: '13.1',
    price_per_mile: '36',
  });

  useEffect(() => {
    fetchRunners();
  }, []);

  const fetchRunners = async () => {
    try {
      const response = await fetch('/api/admin/runners');
      const data = await response.json();
      setRunners(data.runners || []);
    } catch (error) {
      console.error('Error fetching runners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/admin/runners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          total_miles: parseFloat(formData.total_miles),
          price_per_mile: parseFloat(formData.price_per_mile),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create runner');
      }

      setMessage({
        type: 'success',
        text: `Runner created! Page URL: ${window.location.origin}${data.page_url}`,
      });

      // Reset form
      setFormData({
        ...formData,
        name: '',
        donation_url: '',
        photo_url: '',
      });

      // Refresh list
      fetchRunners();

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: 'Copied to clipboard!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>SPONSOR A MILE - ADMIN</div>
          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>B"H</span>
        </div>
      </header>

      <main style={styles.container}>
        <h1 style={styles.title}>Manage Runners</h1>
        <p style={styles.subtitle}>Add runners and get their personalized mile sponsorship pages</p>

        {message.text && (
          <div style={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
            {message.text}
          </div>
        )}

        <div style={styles.grid}>
          {/* Add Runner Form */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Add New Runner</h2>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Runner Name <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Sarah Cohen"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Event Name <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  placeholder="Team Friendship: The Beaches"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Event Date</label>
                <input
                  type="date"
                  style={styles.input}
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Donation URL <span style={styles.required}>*</span>
                </label>
                <input
                  type="url"
                  style={styles.input}
                  value={formData.donation_url}
                  onChange={(e) => setFormData({ ...formData, donation_url: e.target.value })}
                  placeholder="https://teamfriendship.org/beaches/runner/sarah-cohen"
                />
                <p style={styles.helpText}>
                  The runner's personal fundraising page URL on Neon Fundraise
                </p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Photo URL</label>
                <input
                  type="url"
                  style={styles.input}
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Total Miles</label>
                  <input
                    type="number"
                    step="0.1"
                    style={styles.input}
                    value={formData.total_miles}
                    onChange={(e) => setFormData({ ...formData, total_miles: e.target.value })}
                  />
                </div>

                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Price per Mile ($)</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={formData.price_per_mile}
                    onChange={(e) => setFormData({ ...formData, price_per_mile: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ ...styles.button, ...(submitting ? styles.buttonDisabled : {}) }}
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Runner Page'}
              </button>
            </form>
          </div>

          {/* Runner List */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Existing Runners</h2>

            {loading ? (
              <p>Loading...</p>
            ) : runners.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No runners yet. Add your first runner!</p>
              </div>
            ) : (
              <ul style={styles.runnerList}>
                {runners.map((runner) => (
                  <li key={runner.id} style={styles.runnerItem}>
                    <div style={styles.runnerInfo}>
                      <div style={styles.runnerName}>{runner.name}</div>
                      <div style={styles.runnerEvent}>{runner.event_name}</div>
                    </div>
                    <div style={styles.runnerStats}>
                      <div style={styles.runnerRaised}>
                        {formatCurrency(parseFloat(runner.total_raised) || 0)}
                      </div>
                      <div style={styles.runnerMiles}>
                        {runner.sponsored_count || 0}/{Math.ceil(parseFloat(runner.total_miles))} miles
                      </div>
                    </div>
                    <div style={styles.runnerActions}>
                      <a
                        href={`/runner/${runner.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.linkButton}
                      >
                        View
                      </a>
                      <button
                        style={styles.copyButton}
                        onClick={() => copyToClipboard(`${window.location.origin}/runner/${runner.slug}`)}
                      >
                        Copy URL
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
