'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="home-page">
      <header className="hero">
        <div className="hero-content">
          <span className="bh">B"H</span>
          <h1>Sponsor a Mile</h1>
          <p className="tagline">Transform every step into a meaningful dedication</p>
          <p className="description">
            Support runners by sponsoring individual miles of their marathon journey.
            Each mile becomes a personal dedication - a tribute, a memory, a message of hope.
          </p>
        </div>
      </header>

      <main className="container">
        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Choose a Mile</h3>
              <p>Select from 26.2 available miles - from the starting line to the finish</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Add Your Dedication</h3>
              <p>Honor someone special, share a message, or run in memory of a loved one</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Make an Impact</h3>
              <p>Your sponsorship supports Friendship Circle programs for individuals with special needs</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-card">
            <h2>Ready to Sponsor a Mile?</h2>
            <p>Visit a runner's page to see available miles and add your dedication.</p>
            <Link href="/runner/alex-nyc-half" className="cta-button">
              View Demo Runner
            </Link>
          </div>
        </section>

        <section className="about-section">
          <h2>About Team Friendship</h2>
          <p>
            Team Friendship combines athletic achievement with meaningful fundraising.
            Participants train for marathons, mountain climbs, and endurance events
            while raising funds for Friendship Circle International - creating friendships
            between teen volunteers and individuals with special needs.
          </p>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Team Friendship - A Friendship Circle International Initiative</p>
        </div>
      </footer>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .hero {
          background: linear-gradient(135deg, var(--fc-navy) 0%, #2a4a7a 100%);
          color: white;
          padding: 80px 20px;
          text-align: center;
          position: relative;
        }

        .hero::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(to bottom right, transparent 49%, var(--fc-gray-light) 50%);
        }

        .hero-content {
          max-width: 700px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .bh {
          display: block;
          font-size: 0.8rem;
          opacity: 0.5;
          margin-bottom: 16px;
        }

        .hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .tagline {
          font-size: 1.25rem;
          color: var(--fc-teal);
          margin-bottom: 24px;
        }

        .description {
          font-size: 1.1rem;
          line-height: 1.7;
          opacity: 0.9;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .how-it-works {
          padding: 60px 0;
        }

        .how-it-works h2 {
          text-align: center;
          color: var(--fc-navy);
          margin-bottom: 48px;
          font-size: 2rem;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .step {
          text-align: center;
          padding: 24px;
        }

        .step-number {
          width: 56px;
          height: 56px;
          background: var(--fc-teal);
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .step h3 {
          color: var(--fc-navy);
          margin-bottom: 12px;
          font-size: 1.25rem;
        }

        .step p {
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .cta-section {
          padding: 40px 0 60px;
        }

        .cta-card {
          background: var(--fc-navy);
          color: white;
          text-align: center;
          padding: 48px 32px;
          border-radius: 16px;
        }

        .cta-card h2 {
          margin-bottom: 12px;
        }

        .cta-card p {
          opacity: 0.8;
          margin-bottom: 24px;
        }

        .cta-button {
          display: inline-block;
          background: var(--fc-teal);
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          transition: background 0.2s;
        }

        .cta-button:hover {
          background: #2da89a;
          color: white;
        }

        .about-section {
          padding: 40px 0 80px;
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }

        .about-section h2 {
          color: var(--fc-navy);
          margin-bottom: 20px;
        }

        .about-section p {
          color: #4b5563;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .footer {
          background: var(--fc-navy);
          color: white;
          padding: 24px 20px;
          text-align: center;
          margin-top: auto;
        }

        .footer p {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 60px 20px;
          }

          .hero h1 {
            font-size: 2.5rem;
          }

          .steps {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}
