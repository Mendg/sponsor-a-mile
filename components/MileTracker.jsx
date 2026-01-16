'use client';

import { useState, useMemo } from 'react';
import MileTooltip from './MileTooltip';
import { generateMileNumbers, isFeaturedMile, formatMile } from '@/lib/utils';

export default function MileTracker({
  totalMiles = 26.2,
  sponsorships = [],
  onSponsorClick,
  pricePerMile = 36
}) {
  const [hoveredMile, setHoveredMile] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const miles = useMemo(() => generateMileNumbers(totalMiles), [totalMiles]);

  const sponsorshipMap = useMemo(() => {
    const map = new Map();
    sponsorships.forEach(s => {
      map.set(parseFloat(s.mile_number), s);
    });
    return map;
  }, [sponsorships]);

  const sponsoredCount = sponsorships.length;
  const totalMileCount = miles.length;

  const handleMileHover = (mile, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setHoveredMile(mile);
  };

  const handleMileLeave = () => {
    setHoveredMile(null);
  };

  const handleMileClick = (mile) => {
    const sponsorship = sponsorshipMap.get(mile);
    if (!sponsorship && onSponsorClick) {
      onSponsorClick(mile);
    }
  };

  return (
    <div className="mile-tracker">
      <div className="mile-tracker-header">
        <h3 className="mile-tracker-title">Sponsor a Mile</h3>
        <div className="mile-tracker-progress">
          <span className="sponsored-count">{sponsoredCount}</span>
          <span className="total-count">of {totalMileCount} miles sponsored</span>
        </div>
      </div>

      <div className="mile-track-container">
        <div className="mile-track">
          {miles.map((mile) => {
            const sponsorship = sponsorshipMap.get(mile);
            const isSponsored = !!sponsorship;
            const { featured, label } = isFeaturedMile(mile, totalMiles);

            return (
              <div
                key={mile}
                className={`mile-segment ${isSponsored ? 'sponsored' : 'available'} ${featured ? 'featured' : ''} ${hoveredMile === mile ? 'hovered' : ''}`}
                onMouseEnter={(e) => handleMileHover(mile, e)}
                onMouseLeave={handleMileLeave}
                onClick={() => handleMileClick(mile)}
                role="button"
                tabIndex={0}
                aria-label={`Mile ${formatMile(mile)}${isSponsored ? ` - Sponsored by ${sponsorship.sponsor_name}` : ' - Available'}`}
              >
                <span className="mile-number">{formatMile(mile)}</span>
                {featured && <span className="mile-label">{label}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mile-legend">
        <div className="legend-item">
          <span className="legend-color sponsored"></span>
          <span>Sponsored</span>
        </div>
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Available (${pricePerMile})</span>
        </div>
      </div>

      {onSponsorClick && (
        <button
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '14px 24px',
            background: '#36bbae',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
          onClick={() => onSponsorClick(null)}
        >
          Sponsor a Mile
        </button>
      )}

      {hoveredMile !== null && (
        <MileTooltip
          mile={hoveredMile}
          sponsorship={sponsorshipMap.get(hoveredMile)}
          position={tooltipPosition}
          pricePerMile={pricePerMile}
        />
      )}

      <style jsx>{`
        .mile-tracker {
          background: var(--fc-white);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(27, 54, 93, 0.1);
        }

        .mile-tracker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .mile-tracker-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--fc-navy);
          margin: 0;
        }

        .mile-tracker-progress {
          font-size: 0.95rem;
          color: #6b7280;
        }

        .sponsored-count {
          font-weight: 700;
          color: var(--fc-teal);
          font-size: 1.1rem;
        }

        .mile-track-container {
          overflow-x: auto;
          padding: 8px 0;
          margin: 0 -8px;
        }

        .mile-track {
          display: flex;
          gap: 6px;
          min-width: fit-content;
          padding: 0 8px;
        }

        .mile-segment {
          min-width: 48px;
          height: 64px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .mile-segment.available {
          background: var(--fc-gray);
          border: 2px solid transparent;
        }

        .mile-segment.available:hover,
        .mile-segment.available.hovered {
          background: var(--fc-gray-light);
          border-color: var(--fc-navy);
          transform: translateY(-2px);
        }

        .mile-segment.sponsored {
          background: var(--fc-teal);
          color: white;
        }

        .mile-segment.sponsored:hover,
        .mile-segment.sponsored.hovered {
          background: #2da89a;
          transform: translateY(-2px);
        }

        .mile-segment.featured {
          min-width: 56px;
        }

        .mile-segment.featured.available {
          border: 2px dashed var(--fc-navy);
        }

        .mile-number {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .mile-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.8;
          margin-top: 2px;
        }

        .mile-legend {
          display: flex;
          gap: 20px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--fc-gray);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }

        .legend-color.sponsored {
          background: var(--fc-teal);
        }

        .legend-color.available {
          background: var(--fc-gray);
          border: 1px solid #d1d5db;
        }

        .sponsor-cta {
          width: 100%;
          margin-top: 20px;
          padding: 14px 24px;
          background: var(--fc-teal);
          color: white;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .sponsor-cta:hover {
          background: #2da89a;
        }

        @media (max-width: 640px) {
          .mile-tracker {
            padding: 16px;
          }

          .mile-segment {
            min-width: 42px;
            height: 56px;
          }

          .mile-tracker-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
