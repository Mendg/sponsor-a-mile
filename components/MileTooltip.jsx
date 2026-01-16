'use client';

import { formatMile, formatCurrency } from '@/lib/utils';

export default function MileTooltip({ mile, sponsorship, position, pricePerMile = 36 }) {
  const isSponsored = !!sponsorship;

  return (
    <div
      className="mile-tooltip"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className="tooltip-content">
        <div className="tooltip-header">
          <span className="tooltip-mile">Mile {formatMile(mile)}</span>
          <span className={`tooltip-status ${isSponsored ? 'sponsored' : 'available'}`}>
            {isSponsored ? 'Sponsored' : 'Available'}
          </span>
        </div>

        {isSponsored ? (
          <>
            <div className="tooltip-sponsor">
              Sponsored by <strong>{sponsorship.sponsor_name}</strong>
            </div>
            {sponsorship.dedication && (
              <div className="tooltip-dedication">
                "{sponsorship.dedication}"
              </div>
            )}
          </>
        ) : (
          <div className="tooltip-cta">
            Click to sponsor for {formatCurrency(pricePerMile)}
          </div>
        )}
      </div>

      <style jsx>{`
        .mile-tooltip {
          position: fixed;
          transform: translate(-50%, -100%);
          margin-top: -12px;
          z-index: 1000;
          pointer-events: none;
        }

        .tooltip-content {
          background: var(--fc-navy);
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(27, 54, 93, 0.3);
          min-width: 180px;
          max-width: 280px;
        }

        .tooltip-content::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 8px solid transparent;
          border-top-color: var(--fc-navy);
        }

        .tooltip-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .tooltip-mile {
          font-weight: 700;
          font-size: 1rem;
        }

        .tooltip-status {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .tooltip-status.sponsored {
          background: var(--fc-teal);
        }

        .tooltip-status.available {
          background: rgba(255, 255, 255, 0.2);
        }

        .tooltip-sponsor {
          font-size: 0.9rem;
          margin-bottom: 6px;
        }

        .tooltip-dedication {
          font-size: 0.85rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.4;
        }

        .tooltip-cta {
          font-size: 0.85rem;
          color: var(--fc-teal);
        }
      `}</style>
    </div>
  );
}
