'use client';

import { useRef, useState } from 'react';

export default function GraphicsPage() {
  return (
    <div className="graphics-page">
      <header className="page-header">
        <div className="container">
          <div className="logo">TEAM FRIENDSHIP</div>
          <div className="bh">B"H</div>
        </div>
      </header>

      <main className="container">
        <h1>Promotional Graphics</h1>
        <p className="intro">Download and share these graphics to promote Sponsor a Mile</p>

        <div className="graphics-grid">
          <GraphicCard title="Main Explainer" description="What is Dedicate a Mile?">
            <DedicateMileExplainer />
          </GraphicCard>

          <GraphicCard title="How It Works" description="3-step process">
            <HowItWorksGraphic />
          </GraphicCard>

          <GraphicCard title="Social Share - Square" description="Perfect for Instagram">
            <SocialSquare />
          </GraphicCard>

          <GraphicCard title="Story Format" description="For Instagram/Facebook Stories">
            <StoryGraphic />
          </GraphicCard>

          <GraphicCard title="Mile Meaning" description="Every mile tells a story">
            <MileMeaningGraphic />
          </GraphicCard>

          <GraphicCard title="Impact Card" description="Show the difference">
            <ImpactGraphic />
          </GraphicCard>
        </div>
      </main>

      <style jsx>{`
        .graphics-page {
          min-height: 100vh;
          background: var(--fc-gray-light);
        }

        .page-header {
          background: var(--fc-navy);
          color: white;
          padding: 16px 0;
        }

        .page-header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .logo {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .bh {
          font-size: 0.75rem;
          opacity: 0.6;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        h1 {
          color: var(--fc-navy);
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .intro {
          color: #6b7280;
          margin-bottom: 40px;
        }

        .graphics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 32px;
        }

        @media (max-width: 480px) {
          .graphics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function GraphicCard({ title, description, children }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      // Dynamic import for html2canvas
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Try right-clicking and saving the image.');
    }

    setDownloading(false);
  };

  return (
    <div className="graphic-card">
      <div className="card-header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <button onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Saving...' : 'Download'}
        </button>
      </div>
      <div className="graphic-preview" ref={cardRef}>
        {children}
      </div>

      <style jsx>{`
        .graphic-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .card-header {
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--fc-gray);
        }

        .card-header h3 {
          font-size: 1rem;
          color: var(--fc-navy);
          margin-bottom: 2px;
        }

        .card-header p {
          font-size: 0.85rem;
          color: #6b7280;
        }

        .card-header button {
          background: var(--fc-teal);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .card-header button:hover:not(:disabled) {
          background: #2da89a;
        }

        .card-header button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .graphic-preview {
          padding: 20px;
          display: flex;
          justify-content: center;
          background: #f8f9fa;
        }
      `}</style>
    </div>
  );
}

// Main Explainer Graphic
function DedicateMileExplainer() {
  return (
    <div className="explainer">
      <div className="header-section">
        <div className="small-text">TEAM FRIENDSHIP PRESENTS</div>
        <h2>Dedicate a Mile</h2>
        <p className="subtitle">Turn every step into a meaningful tribute</p>
      </div>

      <div className="visual-section">
        <div className="mile-track">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className={`mile ${n <= 3 ? 'sponsored' : ''}`}>
              {n}
            </div>
          ))}
          <div className="dots">...</div>
          <div className="mile finish">26.2</div>
        </div>
      </div>

      <div className="message-section">
        <p>"I'm running mile 5 in memory of Grandma Rose"</p>
        <p className="small">"Mile 13 is for my kids - Maya & Eli"</p>
      </div>

      <div className="cta-section">
        <p>Sponsor a mile. Add your dedication.</p>
        <p className="small">Every mile tells a story.</p>
      </div>

      <style jsx>{`
        .explainer {
          width: 400px;
          background: linear-gradient(135deg, var(--fc-navy) 0%, #2a4a7a 100%);
          color: white;
          padding: 40px 32px;
          border-radius: 16px;
          text-align: center;
        }

        .header-section {
          margin-bottom: 32px;
        }

        .small-text {
          font-size: 0.7rem;
          letter-spacing: 2px;
          opacity: 0.6;
          margin-bottom: 12px;
        }

        h2 {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .subtitle {
          color: var(--fc-teal);
          font-size: 1rem;
        }

        .visual-section {
          margin-bottom: 32px;
        }

        .mile-track {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .mile {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .mile.sponsored {
          background: var(--fc-teal);
        }

        .mile.finish {
          width: 50px;
          background: var(--fc-teal);
        }

        .dots {
          color: rgba(255,255,255,0.4);
          font-size: 1.2rem;
        }

        .message-section {
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .message-section p {
          font-style: italic;
          font-size: 0.95rem;
          margin-bottom: 8px;
        }

        .message-section p:last-child {
          margin-bottom: 0;
        }

        .message-section .small {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .cta-section p {
          font-size: 1rem;
          font-weight: 600;
        }

        .cta-section .small {
          font-size: 0.85rem;
          opacity: 0.7;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

// How It Works Graphic
function HowItWorksGraphic() {
  return (
    <div className="how-it-works">
      <h2>How It Works</h2>

      <div className="steps">
        <div className="step">
          <div className="icon">1</div>
          <div className="content">
            <h3>Pick Your Mile</h3>
            <p>Choose from 26.2 available miles</p>
          </div>
        </div>

        <div className="connector" />

        <div className="step">
          <div className="icon">2</div>
          <div className="content">
            <h3>Add a Dedication</h3>
            <p>Honor someone special with a personal message</p>
          </div>
        </div>

        <div className="connector" />

        <div className="step">
          <div className="icon">3</div>
          <div className="content">
            <h3>Make an Impact</h3>
            <p>Support Friendship Circle programs</p>
          </div>
        </div>
      </div>

      <div className="footer-text">
        sponsor-a-mile.vercel.app
      </div>

      <style jsx>{`
        .how-it-works {
          width: 400px;
          background: white;
          padding: 40px 32px;
          border-radius: 16px;
          border: 3px solid var(--fc-navy);
        }

        h2 {
          color: var(--fc-navy);
          font-size: 1.8rem;
          text-align: center;
          margin-bottom: 32px;
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          background: var(--fc-teal);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 700;
        }

        .content h3 {
          color: var(--fc-navy);
          font-size: 1.05rem;
          margin-bottom: 2px;
        }

        .content p {
          color: #6b7280;
          font-size: 0.85rem;
        }

        .connector {
          width: 3px;
          height: 20px;
          background: var(--fc-gray);
          margin-left: 22px;
          border-radius: 2px;
        }

        .footer-text {
          margin-top: 32px;
          text-align: center;
          font-size: 0.85rem;
          color: var(--fc-teal);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

// Social Square Graphic (Instagram)
function SocialSquare() {
  return (
    <div className="social-square">
      <div className="content">
        <div className="top-text">TEAM FRIENDSHIP</div>
        <h2>Sponsor<br/>a Mile</h2>
        <div className="divider" />
        <p>Dedicate a mile of my marathon to someone you love</p>
        <div className="mile-icons">
          <span className="mile active">1</span>
          <span className="mile active">2</span>
          <span className="mile">3</span>
          <span className="mile">4</span>
          <span className="mile">5</span>
        </div>
        <p className="small">$36 per mile</p>
      </div>

      <style jsx>{`
        .social-square {
          width: 350px;
          height: 350px;
          background: linear-gradient(145deg, var(--fc-navy) 0%, #1a2d4d 100%);
          color: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .content {
          padding: 32px;
        }

        .top-text {
          font-size: 0.65rem;
          letter-spacing: 3px;
          opacity: 0.5;
          margin-bottom: 16px;
        }

        h2 {
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        .divider {
          width: 60px;
          height: 4px;
          background: var(--fc-teal);
          margin: 0 auto 20px;
          border-radius: 2px;
        }

        p {
          font-size: 0.95rem;
          opacity: 0.9;
          margin-bottom: 20px;
        }

        .mile-icons {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .mile {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.15);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .mile.active {
          background: var(--fc-teal);
        }

        .small {
          font-size: 0.85rem;
          opacity: 0.6;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}

// Story Format Graphic
function StoryGraphic() {
  return (
    <div className="story">
      <div className="top-section">
        <div className="brand">TEAM FRIENDSHIP</div>
      </div>

      <div className="main-content">
        <h2>DEDICATE<br/>A MILE</h2>
        <p className="tagline">Run with meaning</p>

        <div className="example-card">
          <div className="mile-badge">Mile 13</div>
          <p>"For my grandmother who always believed in me"</p>
          <span className="author">- Sarah K.</span>
        </div>
      </div>

      <div className="bottom-section">
        <div className="cta">
          <p>Sponsor a mile of my marathon</p>
          <p className="link">Link in bio</p>
        </div>
      </div>

      <style jsx>{`
        .story {
          width: 270px;
          height: 480px;
          background: linear-gradient(180deg, var(--fc-navy) 0%, #0f1f3d 100%);
          color: white;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .top-section {
          padding: 24px 20px 16px;
        }

        .brand {
          font-size: 0.6rem;
          letter-spacing: 2px;
          opacity: 0.5;
          text-align: center;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
          text-align: center;
        }

        h2 {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 8px;
        }

        .tagline {
          color: var(--fc-teal);
          font-size: 1rem;
          margin-bottom: 32px;
        }

        .example-card {
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 12px;
          width: 100%;
        }

        .mile-badge {
          background: var(--fc-teal);
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .example-card p {
          font-style: italic;
          font-size: 0.9rem;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .author {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .bottom-section {
          padding: 24px;
        }

        .cta {
          background: var(--fc-teal);
          padding: 16px;
          border-radius: 12px;
          text-align: center;
        }

        .cta p {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .cta .link {
          font-weight: 700;
          margin-top: 4px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

// Mile Meaning Graphic
function MileMeaningGraphic() {
  return (
    <div className="mile-meaning">
      <h2>Every Mile<br/>Tells a Story</h2>

      <div className="examples">
        <div className="example">
          <span className="mile">1</span>
          <p>"For a fresh start"</p>
        </div>
        <div className="example">
          <span className="mile">13</span>
          <p>"Bar/Bat Mitzvah milestone"</p>
        </div>
        <div className="example">
          <span className="mile">18</span>
          <p>"Chai - for life!"</p>
        </div>
        <div className="example">
          <span className="mile">26.2</span>
          <p>"Finish line dedication"</p>
        </div>
      </div>

      <div className="bottom">
        <p>What will YOUR mile say?</p>
        <span className="brand">Sponsor a Mile</span>
      </div>

      <style jsx>{`
        .mile-meaning {
          width: 400px;
          background: var(--fc-gray-light);
          border: 3px solid var(--fc-teal);
          padding: 40px 32px;
          border-radius: 16px;
          text-align: center;
        }

        h2 {
          color: var(--fc-navy);
          font-size: 1.8rem;
          margin-bottom: 32px;
          line-height: 1.2;
        }

        .examples {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .example {
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          padding: 12px 16px;
          border-radius: 10px;
        }

        .mile {
          width: 44px;
          height: 44px;
          min-width: 44px;
          background: var(--fc-navy);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .example p {
          font-style: italic;
          color: #4b5563;
          font-size: 0.95rem;
          text-align: left;
        }

        .bottom p {
          color: var(--fc-navy);
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 8px;
        }

        .brand {
          color: var(--fc-teal);
          font-weight: 700;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

// Impact Graphic
function ImpactGraphic() {
  return (
    <div className="impact">
      <div className="header">
        <h2>Your Mile<br/>Makes a Difference</h2>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="number">$36</span>
          <span className="label">Per Mile</span>
        </div>
        <div className="stat">
          <span className="number">26.2</span>
          <span className="label">Miles Available</span>
        </div>
      </div>

      <div className="impact-text">
        <p>Every sponsorship supports</p>
        <h3>Friendship Circle</h3>
        <p className="small">Creating friendships for individuals<br/>with special needs</p>
      </div>

      <div className="cta">
        <span>Sponsor a Mile Today</span>
      </div>

      <style jsx>{`
        .impact {
          width: 400px;
          background: linear-gradient(135deg, var(--fc-teal) 0%, #2da89a 100%);
          color: white;
          padding: 40px 32px;
          border-radius: 16px;
          text-align: center;
        }

        .header {
          margin-bottom: 32px;
        }

        h2 {
          font-size: 1.8rem;
          line-height: 1.2;
        }

        .stats {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-bottom: 32px;
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .number {
          font-size: 2.5rem;
          font-weight: 800;
        }

        .label {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .impact-text {
          background: rgba(255,255,255,0.15);
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .impact-text p {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .impact-text h3 {
          font-size: 1.4rem;
          margin: 8px 0;
        }

        .impact-text .small {
          font-size: 0.85rem;
          opacity: 0.8;
          line-height: 1.4;
        }

        .cta span {
          display: inline-block;
          background: white;
          color: var(--fc-teal);
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}
