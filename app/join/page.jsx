'use client';

import { useState } from 'react';

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    event_name: '',
    event_date: '',
    donation_url: '',
    race_type: 'half',
    custom_miles: '',
    mile_increment: '1',
    price_per_mile: '36',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    let totalMiles;
    if (formData.race_type === 'half') {
      totalMiles = 13.1;
    } else if (formData.race_type === 'full') {
      totalMiles = 26.2;
    } else {
      totalMiles = parseFloat(formData.custom_miles) || 13.1;
    }

    try {
      const response = await fetch('/api/admin/runners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          event_name: formData.event_name,
          event_date: formData.event_date || null,
          donation_url: formData.donation_url,
          total_miles: totalMiles,
          mile_increment: parseFloat(formData.mile_increment) || 1,
          price_per_mile: parseFloat(formData.price_per_mile) || 36,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create page');
      }

      setResult({
        url: `${window.location.origin}${data.page_url}`,
        name: formData.name,
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.successCard}>
            <div style={styles.successIcon}>✓</div>
            <h1 style={styles.successTitle}>You're All Set!</h1>
            <p style={styles.successText}>
              Your Sponsor a Mile page is ready, {result.name.split(' ')[0]}!
            </p>

            <div style={styles.urlBox}>
              <label style={styles.urlLabel}>Your personal page:</label>
              <div style={styles.urlDisplay}>
                <input
                  type="text"
                  value={result.url}
                  readOnly
                  style={styles.urlInput}
                  onClick={(e) => e.target.select()}
                />
                <button
                  style={styles.copyBtn}
                  onClick={() => {
                    navigator.clipboard.writeText(result.url);
                    alert('Link copied!');
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            <div style={styles.nextSteps}>
              <h3 style={styles.nextStepsTitle}>Next Steps:</h3>
              <ol style={styles.stepsList}>
                <li>Share your link with friends and family</li>
                <li>Ask them to sponsor a mile in someone's honor</li>
                <li>Watch your miles fill up!</li>
              </ol>
            </div>

            <a href={result.url} style={styles.viewBtn}>
              View Your Page
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>TEAM FRIENDSHIP</div>
          <div style={styles.bh}>B"H</div>
        </div>
      </header>

      <div style={styles.container}>
        <div style={styles.intro}>
          <h1 style={styles.title}>Join Sponsor a Mile</h1>
          <p style={styles.subtitle}>
            Create your personal fundraising page where supporters can sponsor individual miles of your run.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>About You</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Your Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Mendel Groner"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Email <span style={styles.required}>*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                style={styles.input}
              />
              <p style={styles.helpText}>We'll use this to match donations to your page</p>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Your Event</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Event Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.event_name}
                onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                placeholder="e.g., Miami Half Marathon"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Event Date</label>
              <input
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Race Distance</label>
              <div style={styles.raceButtons}>
                {[
                  { value: 'half', label: 'Half Marathon', miles: '13.1 mi' },
                  { value: 'full', label: 'Full Marathon', miles: '26.2 mi' },
                  { value: 'custom', label: 'Custom', miles: 'Any distance' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, race_type: option.value })}
                    style={{
                      ...styles.raceButton,
                      ...(formData.race_type === option.value ? styles.raceButtonActive : {}),
                    }}
                  >
                    <span style={styles.raceLabel}>{option.label}</span>
                    <span style={styles.raceMiles}>{option.miles}</span>
                  </button>
                ))}
              </div>
            </div>

            {formData.race_type === 'custom' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Total Miles</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.custom_miles}
                  onChange={(e) => setFormData({ ...formData, custom_miles: e.target.value })}
                  placeholder="e.g., 5"
                  style={styles.input}
                />
              </div>
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Sponsorship Settings</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Price Per Mile</label>
              <div style={styles.priceInput}>
                <span style={styles.priceCurrency}>$</span>
                <input
                  type="number"
                  min="1"
                  value={formData.price_per_mile}
                  onChange={(e) => setFormData({ ...formData, price_per_mile: e.target.value })}
                  style={{ ...styles.input, paddingLeft: '28px' }}
                />
              </div>
              <p style={styles.helpText}>Suggested: $36 (chai x2) or $18 (chai)</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Mile Increment</label>
              <select
                value={formData.mile_increment}
                onChange={(e) => setFormData({ ...formData, mile_increment: e.target.value })}
                style={styles.select}
              >
                <option value="1">Every mile (1, 2, 3...)</option>
                <option value="0.5">Every half mile (0.5, 1, 1.5...)</option>
                <option value="0.25">Every quarter mile</option>
                <option value="0.1">Every tenth mile (for short races)</option>
              </select>
              <p style={styles.helpText}>Smaller increments = more sponsorship slots</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Your Fundraising Page URL</label>
              <input
                type="url"
                value={formData.donation_url}
                onChange={(e) => setFormData({ ...formData, donation_url: e.target.value })}
                placeholder="e.g., https://teamfriendship.org/yourname"
                style={styles.input}
              />
              <p style={styles.helpText}>Where sponsors go to complete their donation</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.submitBtn,
              ...(submitting ? styles.submitBtnDisabled : {}),
            }}
          >
            {submitting ? 'Creating Your Page...' : 'Create My Page'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f3f4f6',
  },
  header: {
    background: '#1b365d',
    color: 'white',
    padding: '16px 20px',
  },
  headerContent: {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '0.95rem',
    fontWeight: 700,
    letterSpacing: '1.5px',
  },
  bh: {
    fontSize: '0.7rem',
    opacity: 0.6,
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '32px 20px',
  },
  intro: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1b365d',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#6b7280',
    lineHeight: 1.5,
  },
  form: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(27, 54, 93, 0.1)',
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '0.95rem',
  },
  section: {
    marginBottom: '28px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#1b365d',
    marginBottom: '16px',
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
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
    background: 'white',
  },
  helpText: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    marginTop: '4px',
  },
  raceButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  raceButton: {
    padding: '14px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  raceButtonActive: {
    borderColor: '#36bbae',
    background: 'rgba(54, 187, 174, 0.1)',
  },
  raceLabel: {
    display: 'block',
    fontWeight: 600,
    color: '#1b365d',
    fontSize: '0.9rem',
  },
  raceMiles: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '2px',
  },
  priceInput: {
    position: 'relative',
  },
  priceCurrency: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6b7280',
    fontWeight: 500,
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    background: '#36bbae',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  submitBtnDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed',
  },
  // Success state styles
  successCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px 24px',
    boxShadow: '0 4px 20px rgba(27, 54, 93, 0.1)',
    textAlign: 'center',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    background: '#d1fae5',
    color: '#059669',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 auto 20px',
  },
  successTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#1b365d',
    marginBottom: '8px',
  },
  successText: {
    fontSize: '1.1rem',
    color: '#6b7280',
    marginBottom: '24px',
  },
  urlBox: {
    background: '#f3f4f6',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  urlLabel: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#6b7280',
    marginBottom: '8px',
  },
  urlDisplay: {
    display: 'flex',
    gap: '8px',
  },
  urlInput: {
    flex: 1,
    padding: '10px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '0.9rem',
    background: 'white',
  },
  copyBtn: {
    padding: '10px 16px',
    background: '#1b365d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  nextSteps: {
    textAlign: 'left',
    background: '#eff6ff',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '24px',
  },
  nextStepsTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1b365d',
    marginBottom: '10px',
  },
  stepsList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#4b5563',
    lineHeight: 1.7,
  },
  viewBtn: {
    display: 'inline-block',
    padding: '14px 32px',
    background: '#36bbae',
    color: 'white',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    textDecoration: 'none',
  },
};
