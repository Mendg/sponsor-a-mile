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
        totalMiles={runner.total_miles}
        sponsorships={sponsorships}
        pricePerMile={runner.price_per_mile}
        selectedMile={selectedMile}
        donationUrl={`/donate/${slug}`}
      />

      <style jsx>{`
        .page-container {
          min-height: 100vh;
        }

        .tracker-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .share-section {
          margin-top: 0;
        }

        .share-section h3 {
          font-size: 1.1rem;
          margin-bottom: 8px;
          color: var(--fc-navy);
        }

        .share-section p {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .sponsorship-select select {
          width: 100%;
          padding: 12px;
          border: 2px solid var(--fc-gray);
          border-radius: 8px;
          font-size: 0.95rem;
          background: white;
          cursor: pointer;
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
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .card-modal {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: #6b7280;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .modal-close-btn:hover {
          color: var(--fc-navy);
        }

        @media (max-width: 1024px) {
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
          padding: 20px 0;
        }

        .page-header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .bh {
          font-size: 0.75rem;
          opacity: 0.6;
        }
      `}</style>
    </header>
  );
}
