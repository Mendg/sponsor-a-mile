'use client';

import { useState, useMemo, useEffect } from 'react';
import { generateMileNumbers, isFeaturedMile, formatMile, formatCurrency } from '@/lib/utils';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(27, 54, 93, 0.6)',
    display: 'flex',
    alignItems: 'flex-end', // Mobile: slide up from bottom
    justifyContent: 'center',
    padding: '0',
    zIndex: 1000,
  },
  overlayDesktop: {
    alignItems: 'center',
    padding: '20px',
  },
  content: {
    background: 'white',
    borderRadius: '20px 20px 0 0', // Mobile: rounded top corners
    width: '100%',
    maxWidth: '100%',
    maxHeight: '95vh',
    overflowY: 'auto',
    padding: '20px 16px',
    paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
    position: 'relative',
    WebkitOverflowScrolling: 'touch',
  },
  contentDesktop: {
    borderRadius: '16px',
    maxWidth: '560px',
    maxHeight: '90vh',
    padding: '32px',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: '#f3f4f6',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnDesktop: {
    background: 'none',
    padding: '4px',
    minWidth: 'auto',
    minHeight: 'auto',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1b365d',
    margin: '0 0 6px 0',
    paddingRight: '48px', // Space for close button
  },
  titleDesktop: {
    fontSize: '1.5rem',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#6b7280',
    margin: '0 0 16px 0',
    fontSize: '0.9rem',
  },
  subtitleDesktop: {
    margin: '0 0 24px 0',
    fontSize: '1rem',
  },
  gridContainer: {
    maxHeight: '200px',
    overflowY: 'auto',
    marginBottom: '16px',
    padding: '4px',
    WebkitOverflowScrolling: 'touch',
  },
  gridContainerDesktop: {
    maxHeight: '240px',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(54px, 1fr))',
    gap: '6px',
  },
  gridDesktop: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '8px',
  },
  mileOption: {
    padding: '10px 6px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    position: 'relative',
    minHeight: '48px',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
  },
  mileOptionDesktop: {
    padding: '12px 8px',
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
    fontSize: '0.9rem',
    color: '#1b365d',
  },
  mileNumDesktop: {
    fontSize: '0.95rem',
  },
  mileFeatLabel: {
    fontSize: '0.55rem',
    textTransform: 'uppercase',
    color: '#6b7280',
  },
  mileFeatLabelDesktop: {
    fontSize: '0.6rem',
  },
  takenBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '0.6rem',
    background: '#36bbae',
    color: 'white',
    padding: '2px 5px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  takenBadgeDesktop: {
    fontSize: '0.65rem',
    padding: '2px 6px',
  },
  dedicationForm: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '16px',
    marginBottom: '16px',
  },
  dedicationFormDesktop: {
    paddingTop: '20px',
    marginBottom: '24px',
  },
  selectedBadge: {
    display: 'inline-block',
    background: '#36bbae',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 600,
    marginBottom: '14px',
  },
  selectedBadgeDesktop: {
    padding: '6px 12px',
    fontSize: '0.85rem',
    marginBottom: '16px',
  },
  formGroup: {
    marginBottom: '14px',
  },
  formGroupDesktop: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#1b365d',
    marginBottom: '5px',
  },
  labelDesktop: {
    fontSize: '0.9rem',
    marginBottom: '6px',
  },
  required: {
    color: '#ef4444',
    marginLeft: '2px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px', // Prevents iOS zoom
    boxSizing: 'border-box',
    WebkitAppearance: 'none',
  },
  inputDesktop: {
    padding: '10px 12px',
    fontSize: '0.95rem',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.8rem',
    marginTop: '4px',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    minHeight: '44px', // Touch-friendly
  },
  checkboxGroupDesktop: {
    gap: '8px',
    minHeight: 'auto',
  },
  checkbox: {
    width: '22px',
    height: '22px',
    accentColor: '#36bbae',
  },
  checkboxDesktop: {
    width: '18px',
    height: '18px',
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
    flexDirection: 'column-reverse', // Mobile: primary button first visually
    gap: '10px',
  },
  actionsDesktop: {
    flexDirection: 'row',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  btnSecondary: {
    padding: '14px 24px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'white',
    border: '2px solid #e5e7eb',
    color: '#6b7280',
    minHeight: '48px',
    width: '100%',
  },
  btnSecondaryDesktop: {
    padding: '12px 24px',
    minHeight: 'auto',
    width: 'auto',
  },
  btnPrimary: {
    padding: '14px 24px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    background: '#36bbae',
    border: 'none',
    color: 'white',
    minHeight: '48px',
    width: '100%',
  },
  btnPrimaryDesktop: {
    padding: '12px 24px',
    minHeight: 'auto',
    width: 'auto',
  },
  btnPrimaryDisabled: {
    background: '#e5e7eb',
    cursor: 'not-allowed',
  },
  loadingSpinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid white',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: '8px',
  },
};

export default function SponsorModal({
  isOpen,
  onClose,
  runnerId,
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
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const miles = useMemo(() => generateMileNumbers(totalMiles), [totalMiles]);

  const sponsoredMiles = useMemo(() => {
    return new Set(sponsorships.map(s => parseFloat(s.mile_number)));
  }, [sponsorships]);

  const currentMile = selectedMile ?? internalSelectedMile;

  const handleMileSelect = (mile) => {
    if (sponsoredMiles.has(mile)) return;
    setInternalSelectedMile(mile);
    setError('');
    if (onSelectMile) onSelectMile(mile);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Convert Neon Fundraise member page URL to direct donate URL
  const getDirectDonateUrl = (url) => {
    if (!url || url === '#') return url;

    // If already a donate URL, use as-is
    if (url.toLowerCase().includes('/donate')) return url;

    // Remove trailing slash
    let cleanUrl = url.replace(/\/$/, '');

    // Append /Donate for Neon Fundraise URLs
    // Works for both /Member/MyPage/123 and personal URLs like /beaches/levi-groner
    if (cleanUrl.includes('teamfriendship.org') || cleanUrl.includes('rallybound')) {
      return `${cleanUrl}/Donate`;
    }

    return url;
  };

  const handleProceed = async () => {
    if (!currentMile) return;

    // Validate email
    if (!sponsorEmail.trim()) {
      setError('Email is required to complete your sponsorship');
      return;
    }
    if (!validateEmail(sponsorEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Save pending selection
      const response = await fetch('/api/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runner_id: runnerId,
          mile_number: currentMile,
          sponsor_name: isAnonymous ? 'Anonymous' : sponsorName,
          sponsor_email: sponsorEmail.trim().toLowerCase(),
          dedication: dedication || null,
          amount: pricePerMile,
          is_anonymous: isAnonymous
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save your selection. Please try again.');
        setIsLoading(false);
        return;
      }

      // Success - redirect directly to donation form (not profile page)
      window.location.href = getDirectDonateUrl(donationUrl);

    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const canProceed = currentMile && sponsorEmail.trim() && !isLoading;

  // Responsive style helper
  const rs = (base, desktop) => isMobile ? base : { ...base, ...desktop };

  return (
    <div style={rs(styles.overlay, styles.overlayDesktop)} onClick={onClose}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={rs(styles.content, styles.contentDesktop)} onClick={(e) => e.stopPropagation()}>
        <button style={rs(styles.closeBtn, styles.closeBtnDesktop)} onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 style={rs(styles.title, styles.titleDesktop)}>Sponsor a Mile</h2>
        <p style={rs(styles.subtitle, styles.subtitleDesktop)}>
          Choose a mile to sponsor for {formatCurrency(pricePerMile)}
        </p>

        <div style={rs(styles.gridContainer, styles.gridContainerDesktop)}>
          <div style={rs(styles.grid, styles.gridDesktop)}>
            {miles.map((mile) => {
              const isSponsored = sponsoredMiles.has(mile);
              const isSelected = currentMile === mile;
              const { featured, label } = isFeaturedMile(mile, totalMiles);

              const optionStyle = {
                ...rs(styles.mileOption, styles.mileOptionDesktop),
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
                  <span style={rs(styles.mileNum, styles.mileNumDesktop)}>{formatMile(mile)}</span>
                  {featured && <span style={rs(styles.mileFeatLabel, styles.mileFeatLabelDesktop)}>{label}</span>}
                  {isSponsored && <span style={rs(styles.takenBadge, styles.takenBadgeDesktop)}>Taken</span>}
                </button>
              );
            })}
          </div>
        </div>

        {currentMile && (
          <div style={rs(styles.dedicationForm, styles.dedicationFormDesktop)}>
            <div style={rs(styles.selectedBadge, styles.selectedBadgeDesktop)}>
              Mile {formatMile(currentMile)} selected
            </div>

            <div style={rs(styles.formGroup, styles.formGroupDesktop)}>
              <label style={rs(styles.label, styles.labelDesktop)} htmlFor="sponsorEmail">
                Your Email<span style={styles.required}>*</span>
              </label>
              <input
                type="email"
                id="sponsorEmail"
                style={{...rs(styles.input, styles.inputDesktop), ...(error && !sponsorEmail ? styles.inputError : {})}}
                value={sponsorEmail}
                onChange={(e) => { setSponsorEmail(e.target.value); setError(''); }}
                placeholder="email@example.com"
                required
              />
              <span style={{...styles.charCount, color: '#6b7280'}}>
                Use the same email you'll use for payment
              </span>
            </div>

            <div style={rs(styles.formGroup, styles.formGroupDesktop)}>
              <label style={rs(styles.label, styles.labelDesktop)} htmlFor="sponsorName">Your Name</label>
              <input
                type="text"
                id="sponsorName"
                style={{...rs(styles.input, styles.inputDesktop), ...(isAnonymous ? {background: '#f3f4f6', color: '#9ca3af'} : {})}}
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="How should we display your name?"
                disabled={isAnonymous}
              />
            </div>

            <div style={rs(styles.formGroup, styles.formGroupDesktop)}>
              <label style={rs(styles.checkboxGroup, styles.checkboxGroupDesktop)}>
                <input
                  type="checkbox"
                  style={rs(styles.checkbox, styles.checkboxDesktop)}
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span>Make my sponsorship anonymous</span>
              </label>
            </div>

            <div style={rs(styles.formGroup, styles.formGroupDesktop)}>
              <label style={rs(styles.label, styles.labelDesktop)} htmlFor="dedication">Dedication Message (optional)</label>
              <textarea
                id="dedication"
                style={{...rs(styles.input, styles.inputDesktop), resize: 'vertical'}}
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
                placeholder="In honor of... / In memory of... / Running for..."
                rows={3}
                maxLength={200}
              />
              <span style={styles.charCount}>{dedication.length}/200</span>
            </div>

            {error && (
              <div style={styles.errorText}>{error}</div>
            )}
          </div>
        )}

        <div style={rs(styles.actions, styles.actionsDesktop)}>
          <button style={rs(styles.btnSecondary, styles.btnSecondaryDesktop)} onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            style={{...rs(styles.btnPrimary, styles.btnPrimaryDesktop), ...(!canProceed ? styles.btnPrimaryDisabled : {})}}
            onClick={handleProceed}
            disabled={!canProceed}
          >
            {isLoading && <span style={styles.loadingSpinner}></span>}
            {isLoading ? 'Saving...' : `Continue to Payment - ${formatCurrency(pricePerMile)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
