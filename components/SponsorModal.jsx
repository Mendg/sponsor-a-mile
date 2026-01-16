'use client';

import { useState, useMemo } from 'react';
import { generateMileNumbers, isFeaturedMile, formatMile, formatCurrency } from '@/lib/utils';

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

    // Build donation URL with parameters
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="modal-title">Sponsor a Mile</h2>
        <p className="modal-subtitle">
          Choose a mile to sponsor for {formatCurrency(pricePerMile)}
        </p>

        {/* Mile Selection Grid */}
        <div className="mile-grid-container">
          <div className="mile-grid">
            {miles.map((mile) => {
              const isSponsored = sponsoredMiles.has(mile);
              const isSelected = currentMile === mile;
              const { featured, label } = isFeaturedMile(mile, totalMiles);

              return (
                <button
                  key={mile}
                  className={`mile-option ${isSponsored ? 'sponsored' : ''} ${isSelected ? 'selected' : ''} ${featured ? 'featured' : ''}`}
                  onClick={() => handleMileSelect(mile)}
                  disabled={isSponsored}
                  aria-label={`Mile ${formatMile(mile)}${isSponsored ? ' - Already sponsored' : ''}`}
                >
                  <span className="mile-num">{formatMile(mile)}</span>
                  {featured && <span className="mile-feat-label">{label}</span>}
                  {isSponsored && <span className="taken-badge">Taken</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dedication Form */}
        {currentMile && (
          <div className="dedication-form">
            <div className="selected-mile-badge">
              Mile {formatMile(currentMile)} selected
            </div>

            <div className="form-group">
              <label htmlFor="sponsorName">Your Name</label>
              <input
                type="text"
                id="sponsorName"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="How should we display your name?"
                disabled={isAnonymous}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span>Make my sponsorship anonymous</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="dedication">Dedication Message (optional)</label>
              <textarea
                id="dedication"
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
                placeholder="In honor of... / In memory of... / Running for..."
                rows={3}
                maxLength={200}
              />
              <span className="char-count">{dedication.length}/200</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleProceed}
            disabled={!currentMile}
          >
            Continue to Payment - {formatCurrency(pricePerMile)}
          </button>
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(27, 54, 93, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            z-index: 1000;
            backdrop-filter: blur(4px);
          }

          .modal-content {
            background: white;
            border-radius: 16px;
            width: 100%;
            max-width: 560px;
            max-height: 90vh;
            overflow-y: auto;
            padding: 32px;
            position: relative;
          }

          .modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            color: #6b7280;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: color 0.2s;
          }

          .modal-close:hover {
            color: var(--fc-navy);
          }

          .modal-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--fc-navy);
            margin: 0 0 8px 0;
          }

          .modal-subtitle {
            color: #6b7280;
            margin: 0 0 24px 0;
          }

          .mile-grid-container {
            max-height: 240px;
            overflow-y: auto;
            margin-bottom: 24px;
            padding: 4px;
          }

          .mile-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
            gap: 8px;
          }

          .mile-option {
            padding: 12px 8px;
            border: 2px solid var(--fc-gray);
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            position: relative;
          }

          .mile-option:hover:not(:disabled) {
            border-color: var(--fc-navy);
            background: var(--fc-gray-light);
          }

          .mile-option.selected {
            border-color: var(--fc-teal);
            background: rgba(54, 187, 174, 0.1);
          }

          .mile-option.sponsored {
            background: var(--fc-gray-light);
            border-color: transparent;
            cursor: not-allowed;
            opacity: 0.6;
          }

          .mile-option.featured:not(.sponsored) {
            border-style: dashed;
            border-color: var(--fc-navy);
          }

          .mile-num {
            font-weight: 600;
            font-size: 0.95rem;
            color: var(--fc-navy);
          }

          .mile-feat-label {
            font-size: 0.6rem;
            text-transform: uppercase;
            color: #6b7280;
          }

          .taken-badge {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 0.65rem;
            background: var(--fc-teal);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            text-transform: uppercase;
          }

          .dedication-form {
            border-top: 1px solid var(--fc-gray);
            padding-top: 20px;
            margin-bottom: 24px;
          }

          .selected-mile-badge {
            display: inline-block;
            background: var(--fc-teal);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 16px;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-group label {
            display: block;
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--fc-navy);
            margin-bottom: 6px;
          }

          .form-group input[type="text"],
          .form-group textarea {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid var(--fc-gray);
            border-radius: 8px;
            font-size: 0.95rem;
            transition: border-color 0.2s;
          }

          .form-group input[type="text"]:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: var(--fc-teal);
          }

          .form-group input:disabled {
            background: var(--fc-gray-light);
            color: #9ca3af;
          }

          .checkbox-group label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
          }

          .checkbox-group input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: var(--fc-teal);
          }

          .char-count {
            display: block;
            text-align: right;
            font-size: 0.75rem;
            color: #9ca3af;
            margin-top: 4px;
          }

          .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
          }

          .btn-secondary,
          .btn-primary {
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-secondary {
            background: white;
            border: 2px solid var(--fc-gray);
            color: #6b7280;
          }

          .btn-secondary:hover {
            border-color: var(--fc-navy);
            color: var(--fc-navy);
          }

          .btn-primary {
            background: var(--fc-teal);
            border: none;
            color: white;
          }

          .btn-primary:hover:not(:disabled) {
            background: #2da89a;
          }

          .btn-primary:disabled {
            background: var(--fc-gray);
            cursor: not-allowed;
          }

          @media (max-width: 480px) {
            .modal-content {
              padding: 20px;
            }

            .modal-actions {
              flex-direction: column;
            }

            .btn-secondary,
            .btn-primary {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
