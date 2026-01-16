'use client';

import { useRef, useState } from 'react';
import { formatMile } from '@/lib/utils';

export default function DedicationCard({
  mileNumber,
  sponsorName,
  dedication,
  eventName,
  isAnonymous = false,
  format = 'square' // 'square' (1080x1080) or 'story' (1080x1920)
}) {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const displayName = isAnonymous ? 'Anonymous' : sponsorName;
  const isStory = format === 'story';

  const downloadImage = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `mile-${formatMile(mileNumber)}-dedication.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="dedication-card-wrapper">
      {/* The actual card that will be captured */}
      <div
        ref={cardRef}
        className={`dedication-card ${isStory ? 'story' : 'square'}`}
      >
        <div className="card-background">
          {/* Team Friendship branding element */}
          <div className="brand-accent"></div>

          <div className="card-content">
            <div className="mile-badge">
              <span className="mile-label">MILE</span>
              <span className="mile-number">{formatMile(mileNumber)}</span>
            </div>

            <div className="sponsor-section">
              <span className="sponsored-by">Sponsored by</span>
              <span className="sponsor-name">{displayName}</span>
            </div>

            {dedication && (
              <div className="dedication-section">
                <span className="dedication-text">"{dedication}"</span>
              </div>
            )}

            <div className="event-section">
              <span className="event-name">{eventName}</span>
            </div>

            <div className="logo-section">
              <span className="team-friendship">TEAM FRIENDSHIP</span>
            </div>
          </div>

          {/* B"H in corner */}
          <div className="bh-corner">B"H</div>
        </div>
      </div>

      {/* Download button (not captured in image) */}
      <div className="card-actions">
        <button
          onClick={downloadImage}
          disabled={isGenerating}
          className="download-btn"
        >
          {isGenerating ? 'Generating...' : 'Download Image'}
        </button>

        <div className="format-toggle">
          <span className="format-label">Format:</span>
          <span className={`format-option ${!isStory ? 'active' : ''}`}>Square</span>
          <span className="format-divider">/</span>
          <span className={`format-option ${isStory ? 'active' : ''}`}>Story</span>
        </div>
      </div>

      <style jsx>{`
        .dedication-card-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .dedication-card {
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(27, 54, 93, 0.2);
        }

        .dedication-card.square {
          width: 340px;
          height: 340px;
        }

        .dedication-card.story {
          width: 270px;
          height: 480px;
        }

        .card-background {
          width: 100%;
          height: 100%;
          background: var(--fc-navy);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-accent {
          position: absolute;
          top: 0;
          right: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(54, 187, 174, 0.1) 50%,
            rgba(54, 187, 174, 0.2) 100%
          );
        }

        .card-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 24px;
          gap: 16px;
        }

        .story .card-content {
          gap: 24px;
          padding: 48px 24px;
        }

        .mile-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .mile-label {
          font-size: 0.9rem;
          letter-spacing: 4px;
          color: var(--fc-teal);
          font-weight: 600;
        }

        .mile-number {
          font-size: 4rem;
          font-weight: 800;
          color: white;
          line-height: 1;
        }

        .story .mile-number {
          font-size: 5rem;
        }

        .sponsor-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sponsored-by {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .sponsor-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--fc-teal);
        }

        .story .sponsor-name {
          font-size: 1.75rem;
        }

        .dedication-section {
          max-width: 260px;
        }

        .dedication-text {
          font-size: 1rem;
          font-style: italic;
          color: white;
          line-height: 1.5;
          opacity: 0.9;
        }

        .story .dedication-text {
          font-size: 1.1rem;
        }

        .event-section {
          padding-top: 8px;
        }

        .event-name {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .logo-section {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
        }

        .team-friendship {
          font-size: 0.7rem;
          letter-spacing: 3px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
        }

        .bh-corner {
          position: absolute;
          top: 12px;
          right: 16px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
        }

        .card-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .download-btn {
          padding: 12px 32px;
          background: var(--fc-teal);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .download-btn:hover:not(:disabled) {
          background: #2da89a;
        }

        .download-btn:disabled {
          background: var(--fc-gray);
          cursor: not-allowed;
        }

        .format-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .format-option {
          cursor: pointer;
          transition: color 0.2s;
        }

        .format-option.active {
          color: var(--fc-navy);
          font-weight: 600;
        }

        .format-divider {
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
}

// Exportable version that generates both formats
export function DedicationCardGenerator({
  mileNumber,
  sponsorName,
  dedication,
  eventName,
  isAnonymous = false
}) {
  const [format, setFormat] = useState('square');

  return (
    <div className="card-generator">
      <div className="format-selector">
        <button
          className={format === 'square' ? 'active' : ''}
          onClick={() => setFormat('square')}
        >
          Square (Instagram)
        </button>
        <button
          className={format === 'story' ? 'active' : ''}
          onClick={() => setFormat('story')}
        >
          Story
        </button>
      </div>

      <DedicationCard
        mileNumber={mileNumber}
        sponsorName={sponsorName}
        dedication={dedication}
        eventName={eventName}
        isAnonymous={isAnonymous}
        format={format}
      />

      <style jsx>{`
        .card-generator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .format-selector {
          display: flex;
          gap: 8px;
        }

        .format-selector button {
          padding: 8px 16px;
          border: 2px solid var(--fc-gray);
          background: white;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .format-selector button.active {
          border-color: var(--fc-navy);
          background: var(--fc-navy);
          color: white;
        }

        .format-selector button:hover:not(.active) {
          border-color: var(--fc-navy);
        }
      `}</style>
    </div>
  );
}
