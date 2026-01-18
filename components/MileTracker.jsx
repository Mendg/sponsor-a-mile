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
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 12px rgba(27, 54, 93, 0.08);
        }

        @media (min-width: 768px) {
          .mile-tracker {
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(27, 54, 93, 0.1);
          }
        }

        .mile-tracker-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        @media (min-width: 480px) {
          .mile-tracker-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
          }
        }

        .mile-tracker-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--fc-navy);
          margin: 0;
        }

        @media (min-width: 768px) {
          .mile-tracker-title {
            font-size: 1.5rem;
          }
        }

        .mile-tracker-progress {
          font-size: 0.9rem;
          color: #6b7280;
        }

        .sponsored-count {
          font-weight: 700;
          color: var(--fc-teal);
          font-size: 1rem;
        }

        @media (min-width: 768px) {
          .sponsored-count {
            font-size: 1.1rem;
          }
        }

        .mile-track-container {
          padding: 4px 0;
        }

        /* Mobile: Grid layout for easier tapping */
        .mile-track {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
          gap: 8px;
        }

        /* Desktop: Horizontal scroll */
        @media (min-width: 768px) {
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
        }

        .mile-segment {
          min-width: 0;
          min-height: 52px;
          height: auto;
          aspect-ratio: 1;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        @media (min-width: 768px) {
          .mile-segment {
            min-width: 48px;
            height: 64px;
            aspect-ratio: auto;
            transition: all 0.2s ease;
          }
        }

        .mile-segment.available {
          background: var(--fc-gray);
          border: 2px solid transparent;
        }

        .mile-segment.available:hover,
        .mile-segment.available.hovered {
          background: var(--fc-gray-light);
          border-color: var(--fc-navy);
        }

        @media (min-width: 768px) {
          .mile-segment.available:hover,
          .mile-segment.available.hovered {
            transform: translateY(-2px);
          }
        }

        /* Active state for mobile touch */
        .mile-segment.available:active {
          transform: scale(0.95);
          background: var(--fc-gray-light);
          border-color: var(--fc-navy);
        }

        .mile-segment.sponsored {
          background: var(--fc-teal);
          color: white;
        }

        .mile-segment.sponsored:hover,
        .mile-segment.sponsored.hovered {
          background: #2da89a;
        }

        @media (min-width: 768px) {
          .mile-segment.sponsored:hover,
          .mile-segment.sponsored.hovered {
            transform: translateY(-2px);
          }
        }

        .mile-segment.featured {
          min-width: 0;
        }

        @media (min-width: 768px) {
          .mile-segment.featured {
            min-width: 56px;
          }
        }

        .mile-segment.featured.available {
          border: 2px dashed var(--fc-navy);
        }

        .mile-number {
          font-weight: 600;
          font-size: 0.85rem;
        }

        @media (min-width: 768px) {
          .mile-number {
            font-size: 0.9rem;
          }
        }

        .mile-label {
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          opacity: 0.8;
          margin-top: 1px;
          line-height: 1;
        }

        @media (min-width: 768px) {
          .mile-label {
            font-size: 0.65rem;
            letter-spacing: 0.5px;
            margin-top: 2px;
          }
        }

        .mile-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--fc-gray);
        }

        @media (min-width: 768px) {
          .mile-legend {
            gap: 20px;
            margin-top: 16px;
            padding-top: 16px;
          }
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #6b7280;
        }

        @media (min-width: 768px) {
          .legend-item {
            gap: 8px;
            font-size: 0.85rem;
          }
        }

        .legend-color {
          width: 14px;
          height: 14px;
          border-radius: 4px;
        }

        @media (min-width: 768px) {
          .legend-color {
            width: 16px;
            height: 16px;
          }
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
      `}</style>
    </div>
  );
}
