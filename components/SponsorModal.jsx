'use client';

import { useState, useMemo } from 'react';
import { generateMileNumbers, isFeaturedMile, formatMile, formatCurrency } from '@/lib/utils';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(27, 54, 93, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 1000,
  },
  content: {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '32px',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1b365d',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#6b7280',
    margin: '0 0 24px 0',
  },
  gridContainer: {
    maxHeight: '240px',
    overflowY: 'auto',
    marginBottom: '24px',
    padding: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '8px',
  },
  mileOption: {
    padding: '12px 8px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    position: 'relative',
  },
  mileOptionSponsored: {
    background: '#f3f4f6',
    borderColor: 'transparent',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  mileOptionSelected: {
    borderColor: '#36bbae',
    background: 'rgba(54, 187, 174, 0.1)',
  },
  mileOptionFeatured: {
    borderStyle: 'dashed',
    borderColor: '#1b365d',
  },
  mileNum: {
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#1b365d',
  },
  mileFeatLabel: {
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    color: '#6b7280',
  },
  takenBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '0.65rem',
    background: '#36bbae',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  dedicationForm: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '20px',
    marginBottom: '24px',
  },
  selectedBadge: {
    display: 'inline-block',
    background: '#36bbae',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 600,
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
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#36bbae',
  },
  charCount: {
    display: 'block',
    textAlign: 'right',
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '4px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  btnSecondary: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'white',
    border: '2px solid #e5e7eb',
    color: '#6b7280',
  },
  btnPrimary: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    background: '#36bbae',
    border: 'none',
    color: 'white',
  },
  btnPrimaryDisabled: {
    background: '#e5e7eb',
    cursor: 'not-allowed',
  },
};

export default function SponsorModal({
  isOpen,
  onClose,
  totalMiles = 26.2,
  sponsorships = [],
  pricePerMile = 36,
  selectedMile = null,
  onSelectMile,
  donationUrl = '#'
}) {
  const [internalSelectedMile, setInternalSelectedMile] = useState(selectedMile);
  const [dedication, setDedication] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const miles = useMemo(() => generateMileNumbers(totalMiles), [totalMiles]);

  const sponsoredMiles = useMemo(() => {
    return new Set(sponsorships.map(s => parseFloat(s.mile_number)));
  }, [sponsorships]);

  const currentMile = selectedMile ?? internalSelectedMile;

  const handleMileSelect = (mile) => {
    if (sponsoredMiles.has(mile)) return;
    setInternalSelectedMile(mile);
    if (onSelectMile) onSelectMile(mile);
  };

  const handleProceed = () => {
    if (!currentMile) return;

    const params = new URLSearchParams({
      mile: currentMile.toString(),
      amount: pricePerMile.toString(),
      dedication: dedication,
      name: isAnonymous ? 'Anonymous' : sponsorName
    });

    window.location.href = `${donationUrl}?${params.toString()}`;
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 style={styles.title}>Sponsor a Mile</h2>
        <p style={styles.subtitle}>
          Choose a mile to sponsor for {formatCurrency(pricePerMile)}
        </p>

        <div style={styles.gridContainer}>
          <div style={styles.grid}>
            {miles.map((mile) => {
              const isSponsored = sponsoredMiles.has(mile);
              const isSelected = currentMile === mile;
              const { featured, label } = isFeaturedMile(mile, totalMiles);

              const optionStyle = {
                ...styles.mileOption,
                ...(isSponsored ? styles.mileOptionSponsored : {}),
                ...(isSelected && !isSponsored ? styles.mileOptionSelected : {}),
                ...(featured && !isSponsored ? styles.mileOptionFeatured : {}),
              };

              return (
                <button
                  key={mile}
                  style={optionStyle}
                  onClick={() => handleMileSelect(mile)}
                  disabled={isSponsored}
                >
                  <span style={styles.mileNum}>{formatMile(mile)}</span>
                  {featured && <span style={styles.mileFeatLabel}>{label}</span>}
                  {isSponsored && <span style={styles.takenBadge}>Taken</span>}
                </button>
              );
            })}
          </div>
        </div>

        {currentMile && (
          <div style={styles.dedicationForm}>
            <div style={styles.selectedBadge}>
              Mile {formatMile(currentMile)} selected
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="sponsorName">Your Name</label>
              <input
                type="text"
                id="sponsorName"
                style={{...styles.input, ...(isAnonymous ? {background: '#f3f4f6', color: '#9ca3af'} : {})}}
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="How should we display your name?"
                disabled={isAnonymous}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span>Make my sponsorship anonymous</span>
              </label>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="dedication">Dedication Message (optional)</label>
              <textarea
                id="dedication"
                style={{...styles.input, resize: 'vertical'}}
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
                placeholder="In honor of... / In memory of... / Running for..."
                rows={3}
                maxLength={200}
              />
              <span style={styles.charCount}>{dedication.length}/200</span>
            </div>
          </div>
        )}

        <div style={styles.actions}>
          <button style={styles.btnSecondary} onClick={onClose}>
            Cancel
          </button>
          <button
            style={{...styles.btnPrimary, ...(!currentMile ? styles.btnPrimaryDisabled : {})}}
            onClick={handleProceed}
            disabled={!currentMile}
          >
            Continue to Payment - {formatCurrency(pricePerMile)}
          </button>
        </div>
      </div>
    </div>
  );
}
