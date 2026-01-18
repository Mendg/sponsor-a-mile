'use client';

import { useState, useEffect, useCallback } from 'react';
import MileTracker from '@/components/MileTracker';
import Leaderboard from '@/components/Leaderboard';
import SponsorModal from '@/components/SponsorModal';
import { DedicationCardGenerator } from '@/components/DedicationCard';

export default function RunnerPage({ params }) {
  const { slug } = params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMile, setSelectedMile] = useState(null);
  const [showCardGenerator, setShowCardGenerator] = useState(false);
  const [selectedSponsorship, setSelectedSponsorship] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/runners/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Runner not found');
        }
        throw new Error('Failed to fetch runner data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleSponsorClick = (mile) => {
    setSelectedMile(mile);
    setShowModal(true);
  };

  const handleShowDedicationCard = (sponsorship) => {
    setSelectedSponsorship(sponsorship);
    setShowCardGenerator(true);
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <main className="container">
          <div className="loading">
            <div className="loading-spinner" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Header />
        <main className="container">
          <div className="error-message">
            <h2>Oops!</h2>
            <p>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  const { runner, sponsorships, stats } = data;

  return (
    <div className="page-container">
      <Header />

      <main className="container">
        <div className="main-grid">
          {/* Left Column - Mile Tracker */}
          <div className="tracker-column">
            <MileTracker
              totalMiles={runner.total_miles}
              mileIncrement={runner.mile_increment}
              sponsorships={sponsorships}
              pricePerMile={runner.price_per_mile}
              onSponsorClick={handleSponsorClick}
            />

            {/* Shareable Cards Section */}
            {sponsorships.length > 0 && (
              <div className="share-section card">
                <h3>Share Your Dedication</h3>
                <p>Create a shareable graphic for your sponsorship</p>
                <div className="sponsorship-select">
                  <select
                    onChange={(e) => {
                      const sp = sponsorships.find(s => s.id === parseInt(e.target.value));
                      if (sp) handleShowDedicationCard(sp);
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a mile to share...</option>
                    {sponsorships.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        Mile {sp.mile_number} - {sp.sponsor_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Leaderboard */}
          <div className="leaderboard-column">
            <Leaderboard
              runner={runner}
              sponsorships={sponsorships}
              stats={stats}
            />
          </div>
        </div>

        {/* Card Generator Modal */}
        {showCardGenerator && selectedSponsorship && (
          <div className="card-modal-overlay" onClick={() => setShowCardGenerator(false)}>
            <div className="card-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close-btn"
                onClick={() => setShowCardGenerator(false)}
              >
                Close
              </button>
              <DedicationCardGenerator
                mileNumber={selectedSponsorship.mile_number}
                sponsorName={selectedSponsorship.sponsor_name}
                dedication={selectedSponsorship.dedication}
                eventName={runner.event_name}
                isAnonymous={selectedSponsorship.is_anonymous}
              />
            </div>
          </div>
        )}
      </main>

      {/* Sponsor Modal */}
      <SponsorModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedMile(null);
        }}
        runnerId={runner.id}
        totalMiles={runner.total_miles}
        mileIncrement={runner.mile_increment}
        sponsorships={sponsorships}
        pricePerMile={runner.price_per_mile}
        selectedMile={selectedMile}
        donationUrl={runner.donation_url || 'https://teamfriendship.org/beaches'}
      />

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          min-height: -webkit-fill-available;
        }

        .tracker-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .tracker-column {
            gap: 24px;
          }
        }

        .share-section {
          margin-top: 0;
        }

        .share-section h3 {
          font-size: 1rem;
          margin-bottom: 6px;
          color: var(--fc-navy);
        }

        @media (min-width: 768px) {
          .share-section h3 {
            font-size: 1.1rem;
            margin-bottom: 8px;
          }
        }

        .share-section p {
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 12px;
        }

        @media (min-width: 768px) {
          .share-section p {
            font-size: 0.9rem;
            margin-bottom: 16px;
          }
        }

        .sponsorship-select select {
          width: 100%;
          padding: 12px;
          border: 2px solid var(--fc-gray);
          border-radius: 8px;
          font-size: 16px; /* Prevents iOS zoom */
          background: white;
          cursor: pointer;
          -webkit-appearance: none;
        }

        @media (min-width: 768px) {
          .sponsorship-select select {
            font-size: 0.95rem;
          }
        }

        .sponsorship-select select:focus {
          outline: none;
          border-color: var(--fc-teal);
        }

        .card-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(27, 54, 93, 0.7);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 1000;
          padding: 0;
        }

        @media (min-width: 640px) {
          .card-modal-overlay {
            align-items: center;
            padding: 20px;
          }
        }

        .card-modal {
          background: white;
          border-radius: 20px 20px 0 0;
          padding: 20px 16px;
          padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
          max-width: 100%;
          width: 100%;
          max-height: 95vh;
          overflow-y: auto;
          position: relative;
          -webkit-overflow-scrolling: touch;
        }

        @media (min-width: 640px) {
          .card-modal {
            border-radius: 16px;
            padding: 32px;
            max-width: 500px;
            max-height: 90vh;
          }
        }

        .modal-close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #f3f4f6;
          border: none;
          color: #6b7280;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 20px;
          min-height: 44px;
          display: flex;
          align-items: center;
        }

        @media (min-width: 640px) {
          .modal-close-btn {
            background: none;
            padding: 4px;
            min-height: auto;
          }
        }

        .modal-close-btn:hover {
          color: var(--fc-navy);
        }

        /* On mobile, show leaderboard first (runner info) */
        @media (max-width: 1023px) {
          .leaderboard-column {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}

function Header() {
  return (
    <header className="page-header">
      <div className="container">
        <div className="logo">TEAM FRIENDSHIP</div>
        <div className="bh">B"H</div>
      </div>

      <style jsx>{`
        .page-header {
          background: var(--fc-navy);
          color: white;
          padding: 14px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        @media (min-width: 768px) {
          .page-header {
            padding: 20px 0;
            position: static;
          }
        }

        .page-header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        @media (min-width: 768px) {
          .logo {
            font-size: 1.1rem;
            letter-spacing: 2px;
          }
        }

        .bh {
          font-size: 0.7rem;
          opacity: 0.6;
        }

        @media (min-width: 768px) {
          .bh {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </header>
  );
}
