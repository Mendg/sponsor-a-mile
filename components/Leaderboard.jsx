'use client';

import { formatCurrency, formatMile, getRelativeTime } from '@/lib/utils';

export default function Leaderboard({
  runner,
  sponsorships = [],
  stats
}) {
  const {
    sponsored_count = 0,
    total_raised = 0,
    total_miles = 26.2,
    goal_amount = 943.20,
    progress_percent = 0
  } = stats || {};

  // Sort sponsorships by most recent
  const recentSponsorships = [...sponsorships]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  // Get total mile count
  const totalMileCount = Math.ceil(total_miles);

  return (
    <div className="leaderboard">
      {/* Runner Profile */}
      <div className="runner-profile">
        {runner.photo_url && (
          <div className="runner-photo">
            <img src={runner.photo_url} alt={runner.name} />
          </div>
        )}
        <div className="runner-info">
          <h2 className="runner-name">{runner.name}</h2>
          <p className="runner-event">{runner.event_name}</p>
          {runner.event_date && (
            <p className="runner-date">
              {new Date(runner.event_date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>

      {/* Progress Stats */}
      <div className="progress-section">
        <div className="progress-header">
          <div className="progress-amount">
            <span className="raised">{formatCurrency(total_raised)}</span>
            <span className="goal">of {formatCurrency(goal_amount)} goal</span>
          </div>
          <div className="progress-miles">
            <span className="miles-count">{sponsored_count}/{totalMileCount}</span>
            <span className="miles-label">miles</span>
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(100, progress_percent)}%` }}
          />
        </div>

        <div className="progress-percent">{Math.round(progress_percent)}% funded</div>
      </div>

      {/* Featured Miles */}
      <div className="featured-miles">
        <h3 className="section-title">Featured Miles</h3>
        <div className="featured-grid">
          {[
            { mile: 1, label: 'Start Line' },
            { mile: total_miles / 2, label: 'Halfway' },
            { mile: total_miles, label: 'Finish Line' }
          ].map(({ mile, label }) => {
            const sponsorship = sponsorships.find(
              s => Math.abs(parseFloat(s.mile_number) - mile) < 0.1
            );
            return (
              <div
                key={mile}
                className={`featured-mile ${sponsorship ? 'sponsored' : 'available'}`}
              >
                <span className="featured-label">{label}</span>
                <span className="featured-number">Mile {formatMile(mile)}</span>
                {sponsorship ? (
                  <span className="featured-sponsor">{sponsorship.sponsor_name}</span>
                ) : (
                  <span className="featured-available">Available</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Dedications */}
      {recentSponsorships.length > 0 && (
        <div className="recent-dedications">
          <h3 className="section-title">Recent Dedications</h3>
          <div className="dedications-list">
            {recentSponsorships.map((sponsorship) => (
              <div key={sponsorship.id} className="dedication-item">
                <div className="dedication-mile">
                  Mile {formatMile(sponsorship.mile_number)}
                </div>
                <div className="dedication-content">
                  {sponsorship.dedication && (
                    <p className="dedication-text">"{sponsorship.dedication}"</p>
                  )}
                  <div className="dedication-meta">
                    <span className="dedication-sponsor">
                      {sponsorship.sponsor_name}
                    </span>
                    <span className="dedication-time">
                      {getRelativeTime(sponsorship.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .leaderboard {
          background: var(--fc-white);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 12px rgba(27, 54, 93, 0.08);
        }

        @media (min-width: 768px) {
          .leaderboard {
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(27, 54, 93, 0.1);
          }
        }

        .runner-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        @media (min-width: 768px) {
          .runner-profile {
            gap: 16px;
            margin-bottom: 24px;
          }
        }

        .runner-photo {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 3px solid var(--fc-teal);
        }

        @media (min-width: 768px) {
          .runner-photo {
            width: 80px;
            height: 80px;
          }
        }

        .runner-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .runner-info {
          flex: 1;
          min-width: 0;
        }

        .runner-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--fc-navy);
          margin: 0 0 2px 0;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .runner-name {
            font-size: 1.5rem;
            margin: 0 0 4px 0;
          }
        }

        .runner-event {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0;
        }

        @media (min-width: 768px) {
          .runner-event {
            font-size: 1rem;
          }
        }

        .runner-date {
          font-size: 0.8rem;
          color: #9ca3af;
          margin: 2px 0 0 0;
        }

        @media (min-width: 768px) {
          .runner-date {
            font-size: 0.85rem;
            margin: 4px 0 0 0;
          }
        }

        .progress-section {
          background: var(--fc-gray-light);
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 20px;
        }

        @media (min-width: 768px) {
          .progress-section {
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
          }
        }

        .progress-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 10px;
        }

        @media (min-width: 400px) {
          .progress-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: baseline;
            gap: 8px;
            margin-bottom: 12px;
          }
        }

        .progress-amount .raised {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--fc-navy);
        }

        @media (min-width: 768px) {
          .progress-amount .raised {
            font-size: 1.75rem;
          }
        }

        .progress-amount .goal {
          font-size: 0.8rem;
          color: #6b7280;
          margin-left: 6px;
        }

        @media (min-width: 768px) {
          .progress-amount .goal {
            font-size: 0.9rem;
            margin-left: 8px;
          }
        }

        .progress-miles {
          text-align: left;
        }

        @media (min-width: 400px) {
          .progress-miles {
            text-align: right;
          }
        }

        .miles-count {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--fc-teal);
        }

        @media (min-width: 768px) {
          .miles-count {
            font-size: 1.25rem;
          }
        }

        .miles-label {
          font-size: 0.8rem;
          color: #6b7280;
          margin-left: 4px;
        }

        @media (min-width: 768px) {
          .miles-label {
            font-size: 0.85rem;
          }
        }

        .progress-bar {
          height: 10px;
          background: var(--fc-gray);
          border-radius: 5px;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .progress-bar {
            height: 12px;
            border-radius: 6px;
          }
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--fc-teal), #4ecdc4);
          border-radius: 5px;
          transition: width 0.5s ease;
        }

        @media (min-width: 768px) {
          .progress-fill {
            border-radius: 6px;
          }
        }

        .progress-percent {
          text-align: center;
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 6px;
        }

        @media (min-width: 768px) {
          .progress-percent {
            font-size: 0.85rem;
            margin-top: 8px;
          }
        }

        .section-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--fc-navy);
          margin: 0 0 10px 0;
        }

        @media (min-width: 768px) {
          .section-title {
            font-size: 1rem;
            margin: 0 0 12px 0;
          }
        }

        .featured-miles {
          margin-bottom: 20px;
        }

        @media (min-width: 768px) {
          .featured-miles {
            margin-bottom: 24px;
          }
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        @media (min-width: 768px) {
          .featured-grid {
            gap: 12px;
          }
        }

        .featured-mile {
          padding: 10px 8px;
          border-radius: 8px;
          text-align: center;
        }

        @media (min-width: 768px) {
          .featured-mile {
            padding: 16px 12px;
            border-radius: 10px;
          }
        }

        .featured-mile.sponsored {
          background: var(--fc-teal);
          color: white;
        }

        .featured-mile.available {
          background: var(--fc-gray-light);
          border: 2px dashed var(--fc-gray);
        }

        .featured-label {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          opacity: 0.8;
        }

        @media (min-width: 768px) {
          .featured-label {
            font-size: 0.7rem;
            letter-spacing: 0.5px;
          }
        }

        .featured-number {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          margin: 2px 0;
        }

        @media (min-width: 768px) {
          .featured-number {
            font-size: 1rem;
            margin: 4px 0;
          }
        }

        .featured-sponsor,
        .featured-available {
          display: block;
          font-size: 0.7rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (min-width: 768px) {
          .featured-sponsor,
          .featured-available {
            font-size: 0.8rem;
          }
        }

        .featured-available {
          color: var(--fc-teal);
        }

        .recent-dedications {
          border-top: 1px solid var(--fc-gray);
          padding-top: 16px;
        }

        @media (min-width: 768px) {
          .recent-dedications {
            padding-top: 20px;
          }
        }

        .dedications-list {
          max-height: 250px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        @media (min-width: 768px) {
          .dedications-list {
            max-height: 300px;
          }
        }

        .dedication-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 0;
          border-bottom: 1px solid var(--fc-gray-light);
        }

        @media (min-width: 480px) {
          .dedication-item {
            flex-direction: row;
            gap: 12px;
            padding: 12px 0;
          }
        }

        .dedication-item:last-child {
          border-bottom: none;
        }

        .dedication-mile {
          flex-shrink: 0;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--fc-teal);
        }

        @media (min-width: 480px) {
          .dedication-mile {
            width: 70px;
            font-size: 0.85rem;
          }
        }

        .dedication-content {
          flex: 1;
          min-width: 0;
        }

        .dedication-text {
          font-style: italic;
          color: #4b5563;
          margin: 0 0 4px 0;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        @media (min-width: 768px) {
          .dedication-text {
            font-size: 0.9rem;
          }
        }

        .dedication-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
        }

        @media (min-width: 768px) {
          .dedication-meta {
            font-size: 0.8rem;
          }
        }

        .dedication-sponsor {
          font-weight: 500;
          color: var(--fc-navy);
        }

        .dedication-time {
          color: #9ca3af;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
