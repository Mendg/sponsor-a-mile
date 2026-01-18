'use client';

import { useState, useEffect, useRef } from 'react';
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
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    background: 'white',
    cursor: 'pointer',
  },
  raceTypeButtons: {
    display: 'flex',
    gap: '12px',
  },
  raceTypeButton: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  raceTypeButtonActive: {
    borderColor: '#36bbae',
    background: 'rgba(54, 187, 174, 0.1)',
  },
  raceTypeLabel: {
    fontWeight: 600,
    color: '#1b365d',
    display: 'block',
  },
  raceTypeMiles: {
    fontSize: '0.8rem',
    color: '#6b7280',
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
  buttonSecondary: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: '2px solid #1b365d',
    background: 'white',
    color: '#1b365d',
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
  tabs: {
    display: 'flex',
    gap: '0',
    marginBottom: '20px',
    borderBottom: '2px solid #e5e7eb',
  },
  tab: {
    padding: '12px 20px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#6b7280',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
  },
  tabActive: {
    color: '#1b365d',
    borderBottomColor: '#36bbae',
  },
  dropZone: {
    border: '2px dashed #e5e7eb',
    borderRadius: '8px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  dropZoneActive: {
    borderColor: '#36bbae',
    background: 'rgba(54, 187, 174, 0.05)',
  },
  dropZoneText: {
    color: '#6b7280',
    marginBottom: '8px',
  },
  dropZoneSubtext: {
    fontSize: '0.8rem',
    color: '#9ca3af',
  },
  csvPreview: {
    marginTop: '16px',
    padding: '12px',
    background: '#f9fafb',
    borderRadius: '8px',
    fontSize: '0.85rem',
    maxHeight: '200px',
    overflow: 'auto',
  },
  csvRow: {
    display: 'flex',
    gap: '8px',
    padding: '4px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  runnerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '500px',
    overflow: 'auto',
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
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 500,
    marginLeft: '8px',
  },
  badgeHalf: {
    background: '#dbeafe',
    color: '#1e40af',
  },
  badgeFull: {
    background: '#fef3c7',
    color: '#92400e',
  },
  pendingSection: {
    marginTop: '32px',
  },
  pendingCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(27, 54, 93, 0.1)',
  },
  pendingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  pendingCount: {
    background: '#fef3c7',
    color: '#92400e',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  pendingList: {
    display: 'grid',
    gap: '12px',
  },
  pendingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#fffbeb',
    borderRadius: '12px',
    border: '1px solid #fef3c7',
  },
  pendingInfo: {
    flex: 1,
  },
  pendingMile: {
    fontWeight: 700,
    color: '#1b365d',
    fontSize: '1.1rem',
  },
  pendingDetails: {
    fontSize: '0.9rem',
    color: '#6b7280',
    marginTop: '4px',
  },
  pendingRunner: {
    fontSize: '0.85rem',
    color: '#9ca3af',
    marginTop: '2px',
  },
  pendingActions: {
    display: 'flex',
    gap: '8px',
  },
  confirmButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    background: '#36bbae',
    color: 'white',
  },
  rejectButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid #e5e7eb',
    background: 'white',
    color: '#6b7280',
  },
};

export default function AdminPage() {
  const [runners, setRunners] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('single');
  const [csvData, setCsvData] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    event_name: 'Team Friendship: The Beaches',
    event_date: '2026-01-30',
    donation_url: '',
    photo_url: '',
    race_type: 'half',
    custom_miles: '',
    mile_increment: '1',
    price_per_mile: '36',
  });

  useEffect(() => {
    fetchRunners();
    fetchPending();
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

  const fetchPending = async () => {
    try {
      const response = await fetch('/api/admin/pending');
      const data = await response.json();
      setPending(data.pending || []);
    } catch (error) {
      console.error('Error fetching pending:', error);
    }
  };

  const confirmSponsorship = async (pendingId) => {
    setConfirmingId(pendingId);
    try {
      const response = await fetch('/api/admin/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pending_id: pendingId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm');
      }

      setMessage({ type: 'success', text: data.message });
      fetchPending();
      fetchRunners();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setConfirmingId(null);
    }
  };

  const rejectSponsorship = async (pendingId) => {
    if (!confirm('Remove this pending sponsorship?')) return;

    try {
      await fetch(`/api/admin/pending?id=${pendingId}`, { method: 'DELETE' });
      fetchPending();
      setMessage({ type: 'success', text: 'Pending sponsorship removed' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove' });
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

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
          ...formData,
          total_miles: totalMiles,
          mile_increment: parseFloat(formData.mile_increment) || 1,
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

      setFormData({
        ...formData,
        name: '',
        donation_url: '',
        photo_url: '',
      });

      fetchRunners();

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 2) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        rows.push(row);
      }
    }

    return { headers, rows };
  };

  const handleFileSelect = (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      setMessage({ type: 'error', text: 'Please upload a CSV file' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCSV(e.target.result);
        setCsvData(parsed);
        setMessage({ type: '', text: '' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to parse CSV file' });
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleBulkImport = async () => {
    if (!csvData || csvData.rows.length === 0) return;

    setCsvUploading(true);
    setMessage({ type: '', text: '' });

    let successCount = 0;
    let errorCount = 0;

    for (const row of csvData.rows) {
      try {
        // Determine race type from miles or race_type column
        let totalMiles = 13.1;
        if (row.miles || row.total_miles) {
          totalMiles = parseFloat(row.miles || row.total_miles);
        } else if (row.race_type || row.type) {
          const type = (row.race_type || row.type).toLowerCase();
          totalMiles = type.includes('full') || type === '26' || type === '26.2' ? 26.2 : 13.1;
        }

        const response = await fetch('/api/admin/runners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: row.name || row.runner_name || row.runner,
            event_name: row.event_name || row.event || formData.event_name,
            event_date: row.event_date || row.date || formData.event_date,
            donation_url: row.donation_url || row.url || row.fundraising_url || '',
            photo_url: row.photo_url || row.photo || '',
            total_miles: totalMiles,
            price_per_mile: parseFloat(row.price_per_mile || row.price || formData.price_per_mile),
          }),
        });

        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    setCsvUploading(false);
    setCsvData(null);
    fetchRunners();

    setMessage({
      type: successCount > 0 ? 'success' : 'error',
      text: `Imported ${successCount} runners${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: 'Copied to clipboard!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const downloadTemplate = () => {
    const template = 'name,donation_url,race_type,event_name,event_date\nJohn Smith,https://teamfriendship.org/runner/john,half,Team Friendship: The Beaches,2026-01-30\nJane Doe,https://teamfriendship.org/runner/jane,full,Team Friendship: The Beaches,2026-01-30';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'runners-template.csv';
    a.click();
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
            <div style={styles.tabs}>
              <button
                style={{ ...styles.tab, ...(activeTab === 'single' ? styles.tabActive : {}) }}
                onClick={() => setActiveTab('single')}
              >
                Add Single Runner
              </button>
              <button
                style={{ ...styles.tab, ...(activeTab === 'bulk' ? styles.tabActive : {}) }}
                onClick={() => setActiveTab('bulk')}
              >
                Bulk Import (CSV)
              </button>
            </div>

            {activeTab === 'single' ? (
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
                  <label style={styles.label}>Race Distance</label>
                  <div style={styles.raceTypeButtons}>
                    <button
                      type="button"
                      style={{
                        ...styles.raceTypeButton,
                        ...(formData.race_type === 'half' ? styles.raceTypeButtonActive : {}),
                      }}
                      onClick={() => setFormData({ ...formData, race_type: 'half', custom_miles: '' })}
                    >
                      <span style={styles.raceTypeLabel}>Half</span>
                      <span style={styles.raceTypeMiles}>13.1 mi</span>
                    </button>
                    <button
                      type="button"
                      style={{
                        ...styles.raceTypeButton,
                        ...(formData.race_type === 'full' ? styles.raceTypeButtonActive : {}),
                      }}
                      onClick={() => setFormData({ ...formData, race_type: 'full', custom_miles: '' })}
                    >
                      <span style={styles.raceTypeLabel}>Full</span>
                      <span style={styles.raceTypeMiles}>26.2 mi</span>
                    </button>
                    <button
                      type="button"
                      style={{
                        ...styles.raceTypeButton,
                        ...(formData.race_type === 'custom' ? styles.raceTypeButtonActive : {}),
                      }}
                      onClick={() => setFormData({ ...formData, race_type: 'custom' })}
                    >
                      <span style={styles.raceTypeLabel}>Custom</span>
                      <span style={styles.raceTypeMiles}>Any distance</span>
                    </button>
                  </div>
                  {formData.race_type === 'custom' && (
                    <div style={{ marginTop: '12px' }}>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        style={styles.input}
                        value={formData.custom_miles}
                        onChange={(e) => setFormData({ ...formData, custom_miles: e.target.value })}
                        placeholder="Enter distance in miles (e.g., 3.1 for 5K)"
                        required={formData.race_type === 'custom'}
                      />
                      <p style={styles.helpText}>
                        Common: 5K = 3.1 mi, 10K = 6.2 mi, 15K = 9.3 mi
                      </p>
                    </div>
                  )}
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
                  <label style={styles.label}>Donation URL</label>
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
                  <label style={styles.label}>Sponsorship Increment</label>
                  <select
                    style={styles.select}
                    value={formData.mile_increment}
                    onChange={(e) => setFormData({ ...formData, mile_increment: e.target.value })}
                  >
                    <option value="1">Every 1 mile (standard for marathons)</option>
                    <option value="0.5">Every 0.5 miles</option>
                    <option value="0.25">Every 0.25 miles</option>
                    <option value="0.1">Every 0.1 miles (27 slots for 2.7 mi)</option>
                  </select>
                  <p style={styles.helpText}>
                    For short races, use smaller increments to offer more sponsorship slots
                  </p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Price per Slot ($)</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={formData.price_per_mile}
                    onChange={(e) => setFormData({ ...formData, price_per_mile: e.target.value })}
                  />
                  <p style={styles.helpText}>
                    Price for each sponsorship slot
                  </p>
                </div>

                <button
                  type="submit"
                  style={{ ...styles.button, ...(submitting ? styles.buttonDisabled : {}) }}
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Runner Page'}
                </button>
              </form>
            ) : (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />

                <div
                  style={{
                    ...styles.dropZone,
                    ...(dragActive ? styles.dropZoneActive : {}),
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <p style={styles.dropZoneText}>
                    Drop CSV file here or click to upload
                  </p>
                  <p style={styles.dropZoneSubtext}>
                    Columns: name, donation_url, race_type (half/full), event_name, event_date
                  </p>
                </div>

                <button
                  type="button"
                  style={styles.buttonSecondary}
                  onClick={downloadTemplate}
                >
                  Download CSV Template
                </button>

                {csvData && (
                  <div style={styles.csvPreview}>
                    <p style={{ fontWeight: 600, marginBottom: '8px' }}>
                      Preview: {csvData.rows.length} runners
                    </p>
                    {csvData.rows.slice(0, 5).map((row, i) => (
                      <div key={i} style={styles.csvRow}>
                        <span>{row.name || row.runner_name || row.runner}</span>
                        <span style={{ color: '#6b7280' }}>
                          {row.race_type || row.type || 'half'}
                        </span>
                      </div>
                    ))}
                    {csvData.rows.length > 5 && (
                      <p style={{ color: '#9ca3af', marginTop: '8px' }}>
                        ...and {csvData.rows.length - 5} more
                      </p>
                    )}

                    <button
                      type="button"
                      style={{ ...styles.button, ...(csvUploading ? styles.buttonDisabled : {}) }}
                      onClick={handleBulkImport}
                      disabled={csvUploading}
                    >
                      {csvUploading ? 'Importing...' : `Import ${csvData.rows.length} Runners`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Runner List */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              Existing Runners
              {runners.length > 0 && (
                <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.9rem' }}>
                  {' '}({runners.length})
                </span>
              )}
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : runners.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No runners yet. Add your first runner!</p>
              </div>
            ) : (
              <ul style={styles.runnerList}>
                {runners.map((runner) => {
                  const miles = parseFloat(runner.total_miles);
                  // Determine badge color based on distance
                  const getBadgeStyle = (m) => {
                    if (m <= 6.5) return { background: '#dcfce7', color: '#166534' }; // Green for short
                    if (m <= 14) return styles.badgeHalf; // Blue for half
                    return styles.badgeFull; // Yellow for full+
                  };
                  return (
                    <li key={runner.id} style={styles.runnerItem}>
                      <div style={styles.runnerInfo}>
                        <div style={styles.runnerName}>
                          {runner.name}
                          <span style={{
                            ...styles.badge,
                            ...getBadgeStyle(miles),
                          }}>
                            {miles} mi
                          </span>
                        </div>
                        <div style={styles.runnerEvent}>{runner.event_name}</div>
                      </div>
                      <div style={styles.runnerStats}>
                        <div style={styles.runnerRaised}>
                          {formatCurrency(parseFloat(runner.total_raised) || 0)}
                        </div>
                        <div style={styles.runnerMiles}>
                          {runner.sponsored_count || 0}/{Math.ceil(miles)} miles
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
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Pending Sponsorships Section */}
        {pending.length > 0 && (
          <div style={styles.pendingSection}>
            <div style={styles.pendingCard}>
              <div style={styles.pendingHeader}>
                <h2 style={styles.cardTitle}>Pending Sponsorships</h2>
                <span style={styles.pendingCount}>{pending.length} awaiting payment</span>
              </div>

              <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '0.9rem' }}>
                These sponsors selected miles but haven't completed payment yet.
                Click "Confirm" after verifying payment in Neon Fundraise.
              </p>

              <div style={styles.pendingList}>
                {pending.map((p) => (
                  <div key={p.id} style={styles.pendingItem}>
                    <div style={styles.pendingInfo}>
                      <div style={styles.pendingMile}>
                        Mile {parseFloat(p.mile_number)} - ${parseFloat(p.amount)}
                      </div>
                      <div style={styles.pendingDetails}>
                        {p.sponsor_name} ({p.sponsor_email})
                        {p.dedication && <span> - "{p.dedication}"</span>}
                      </div>
                      <div style={styles.pendingRunner}>
                        {p.runner_name} • {formatTimeAgo(p.created_at)}
                      </div>
                    </div>
                    <div style={styles.pendingActions}>
                      <button
                        style={styles.rejectButton}
                        onClick={() => rejectSponsorship(p.id)}
                      >
                        Remove
                      </button>
                      <button
                        style={{
                          ...styles.confirmButton,
                          ...(confirmingId === p.id ? { opacity: 0.6, cursor: 'wait' } : {}),
                        }}
                        onClick={() => confirmSponsorship(p.id)}
                        disabled={confirmingId === p.id}
                      >
                        {confirmingId === p.id ? 'Confirming...' : 'Confirm Payment'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
