'use client';

import { useRef, useState } from 'react';

export default function GraphicsPage() {
  // Editable global settings
  const [settings, setSettings] = useState({
    runnerName: 'Levi',
    eventName: 'Miami Marathon',
    pricePerMile: 36,
    totalMiles: 26.2,
    pageUrl: 'sponsor-a-mile.vercel.app',
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

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
        <p className="intro">Customize and download graphics to promote Sponsor a Mile</p>

        {/* Global Settings */}
        <div className="settings-panel">
          <h2>Customize All Graphics</h2>
          <div className="settings-grid">
            <div className="setting">
              <label>Runner Name</label>
              <input
                type="text"
                value={settings.runnerName}
                onChange={(e) => updateSetting('runnerName', e.target.value)}
              />
            </div>
            <div className="setting">
              <label>Event Name</label>
              <input
                type="text"
                value={settings.eventName}
                onChange={(e) => updateSetting('eventName', e.target.value)}
              />
            </div>
            <div className="setting">
              <label>Price Per Mile ($)</label>
              <input
                type="number"
                value={settings.pricePerMile}
                onChange={(e) => updateSetting('pricePerMile', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="setting">
              <label>Total Miles</label>
              <input
                type="number"
                step="0.1"
                value={settings.totalMiles}
                onChange={(e) => updateSetting('totalMiles', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="setting">
              <label>Page URL</label>
              <input
                type="text"
                value={settings.pageUrl}
                onChange={(e) => updateSetting('pageUrl', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="graphics-grid">
          <GraphicCard title="Main Explainer" description="What is Dedicate a Mile?">
            <DedicateMileExplainer settings={settings} />
          </GraphicCard>

          <GraphicCard title="How It Works" description="3-step process">
            <HowItWorksGraphic settings={settings} />
          </GraphicCard>

          <GraphicCard title="Social Share - Square" description="Perfect for Instagram">
            <SocialSquare settings={settings} />
          </GraphicCard>

          <GraphicCard title="Story Format" description="For Instagram/Facebook Stories">
            <StoryGraphic settings={settings} />
          </GraphicCard>

          <GraphicCard title="Mile Meaning" description="Every mile tells a story">
            <MileMeaningGraphic settings={settings} />
          </GraphicCard>

          <GraphicCard title="Impact Card" description="Show the difference">
            <ImpactGraphic settings={settings} />
          </GraphicCard>

          <GraphicCard title="Personal Ask" description="Runner's personal invitation">
            <PersonalAskGraphic settings={settings} />
          </GraphicCard>

          <GraphicCard title="Dedication Example" description="Show what a dedication looks like">
            <DedicationExampleGraphic settings={settings} />
          </GraphicCard>

          <GraphicCard title="Pick Your Mile" description="Story: Own the moment">
            <PickYourMileStory settings={settings} />
          </GraphicCard>

          <GraphicCard title="Mile Grid" description="Story: Visual mile tracker">
            <MileGridStory settings={settings} />
          </GraphicCard>

          <GraphicCard title="Finish Line Open" description="Story: Sponsor the final mile">
            <FinishLineStory settings={settings} />
          </GraphicCard>

          <GraphicCard title="Miles Going Fast" description="Story: Create urgency">
            <MilesGoingFastStory settings={settings} />
          </GraphicCard>

          <GraphicCard title="Extra Mile" description="Story: Punny ask">
            <ExtraMileStory settings={settings} />
          </GraphicCard>

          <GraphicCard title="Per Mile Ask" description="Story: Direct sponsorship ask">
            <PerMileStory settings={settings} />
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
          margin-bottom: 32px;
        }

        .settings-panel {
          background: white;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .settings-panel h2 {
          color: var(--fc-navy);
          font-size: 1.1rem;
          margin-bottom: 16px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .setting label {
          display: block;
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .setting input {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid var(--fc-gray);
          border-radius: 8px;
          font-size: 0.95rem;
        }

        .setting input:focus {
          outline: none;
          border-color: var(--fc-teal);
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

          .settings-grid {
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
function DedicateMileExplainer({ settings }) {
  return (
    <div className="explainer">
      <div className="bh">B"H</div>
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
          <div className="mile finish">{settings.totalMiles}</div>
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
          position: relative;
        }

        .bh {
          position: absolute;
          top: 12px;
          right: 16px;
          font-size: 0.7rem;
          opacity: 0.5;
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
function HowItWorksGraphic({ settings }) {
  return (
    <div className="how-it-works">
      <div className="bh">B"H</div>
      <h2>How It Works</h2>

      <div className="steps">
        <div className="step">
          <div className="icon">1</div>
          <div className="content">
            <h3>Pick Your Mile</h3>
            <p>Choose from {settings.totalMiles} available miles</p>
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
        {settings.pageUrl}
      </div>

      <style jsx>{`
        .how-it-works {
          width: 400px;
          background: white;
          padding: 40px 32px;
          border-radius: 16px;
          border: 3px solid var(--fc-navy);
          position: relative;
        }

        .bh {
          position: absolute;
          top: 12px;
          right: 16px;
          font-size: 0.7rem;
          color: var(--fc-navy);
          opacity: 0.5;
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
function SocialSquare({ settings }) {
  return (
    <div className="social-square">
      <div className="bh">B"H</div>
      <div className="content">
        <div className="top-text">TEAM FRIENDSHIP</div>
        <h2>Sponsor<br/>a Mile</h2>
        <div className="divider" />
        <p>Dedicate a mile of {settings.runnerName}'s {settings.eventName} to someone you love</p>
        <div className="mile-icons">
          <span className="mile active">1</span>
          <span className="mile active">2</span>
          <span className="mile">3</span>
          <span className="mile">4</span>
          <span className="mile">5</span>
        </div>
        <p className="small">${settings.pricePerMile} per mile</p>
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
          position: relative;
        }

        .bh {
          position: absolute;
          top: 12px;
          right: 16px;
          font-size: 0.7rem;
          opacity: 0.5;
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
function StoryGraphic({ settings }) {
  return (
    <div className="story">
      <div className="bh">B"H</div>
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
          <p>Sponsor a mile of {settings.runnerName}'s race</p>
          <p className="link">${settings.pricePerMile}/mile</p>
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
          position: relative;
        }

        .bh {
          position: absolute;
          top: 12px;
          right: 16px;
          font-size: 0.6rem;
          opacity: 0.5;
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
function MileMeaningGraphic({ settings }) {
  return (
    <div className="mile-meaning">
      <div className="bh">B"H</div>
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
          <span className="mile">{settings.totalMiles}</span>
          <p>"Finish line dedication"</p>
        </div>
      </div>

      <div className="bottom">
        <p>What will YOUR mile say?</p>
        <span className="brand">Sponsor a Mile • ${settings.pricePerMile}</span>
      </div>

      <style jsx>{`
        .mile-meaning {
          width: 400px;
          background: var(--fc-gray-light);
          border: 3px solid var(--fc-teal);
          padding: 40px 32px;
          border-radius: 16px;
          text-align: center;
          position: relative;
        }

        .bh {
          position: absolute;
          top: 12px;
          right: 16px;
          font-size: 0.7rem;
          color: var(--fc-navy);
          opacity: 0.5;
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
function ImpactGraphic({ settings }) {
  return (
    <div className="impact">
      <div className="bh">B"H</div>
      <div className="header">
        <h2>Your Mile<br/>Makes a Difference</h2>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="number">${settings.pricePerMile}</span>
          <span className="label">Per Mile</span>
        </div>
        <div className="stat">
          <span className="number">{settings.totalMiles}</span>
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
          position: relative;
        }

        .bh {
          position: absolute;
          top: 12px;
          right: 16px;
          font-size: 0.7rem;
          opacity: 0.5;
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

// Personal Ask Graphic - NEW
function PersonalAskGraphic({ settings }) {
  return (
    <div className="personal-ask">
      <div className="bh">B"H</div>
      <div className="header">
        <div className="avatar">{settings.runnerName.charAt(0)}</div>
        <h2>Run With Me</h2>
      </div>

      <div className="message">
        <p>I'm running the <strong>{settings.eventName}</strong> to support Friendship Circle.</p>
        <p>Will you sponsor one of my {settings.totalMiles} miles?</p>
      </div>

      <div className="how">
        <div className="how-item">
          <span className="check">✓</span>
          <span>Pick a mile number</span>
        </div>
        <div className="how-item">
          <span className="check">✓</span>
          <span>Add a personal dedication</span>
        </div>
        <div className="how-item">
          <span className="check">✓</span>
          <span>I'll carry your message to the finish</span>
        </div>
      </div>

      <div className="cta">
        <span>${settings.pricePerMile} per mile</span>
      </div>

      <div className="footer">
        <span>- {settings.runnerName}</span>
      </div>

      <style jsx>{`
        .personal-ask {
          width: 400px;
          background: white;
          padding: 40px 32px;
          border-radius: 16px;
          border: 3px solid var(--fc-navy);
          text-align: center;
          position: relative;
        }

        .bh {
          position: absolute;
          top: 12px;
          right: 16px;
          font-size: 0.7rem;
          color: var(--fc-navy);
          opacity: 0.5;
        }

        .header {
          margin-bottom: 24px;
        }

        .avatar {
          width: 64px;
          height: 64px;
          background: var(--fc-navy);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 auto 16px;
        }

        h2 {
          color: var(--fc-navy);
          font-size: 1.8rem;
        }

        .message {
          margin-bottom: 24px;
        }

        .message p {
          color: #4b5563;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .message strong {
          color: var(--fc-navy);
        }

        .how {
          background: var(--fc-gray-light);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          text-align: left;
        }

        .how-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          color: #4b5563;
          font-size: 0.95rem;
        }

        .check {
          color: var(--fc-teal);
          font-weight: 700;
        }

        .cta span {
          display: inline-block;
          background: var(--fc-teal);
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .footer {
          margin-top: 20px;
          color: var(--fc-navy);
          font-style: italic;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}

// Dedication Example Graphic - NEW
function DedicationExampleGraphic({ settings }) {
  return (
    <div className="dedication-example">
      <div className="bh">B"H</div>
      <div className="card-label">MILE DEDICATION</div>

      <div className="mile-badge">Mile 18</div>

      <div className="dedication-content">
        <p className="dedication-text">"In loving memory of my father, who taught me that every step forward matters"</p>
        <p className="sponsor">Sponsored by David M.</p>
      </div>

      <div className="runner-info">
        <p>Carried by <strong>{settings.runnerName}</strong></p>
        <p className="event">{settings.eventName}</p>
      </div>

      <div className="footer">
        <span className="brand">Sponsor a Mile</span>
        <span className="price">${settings.pricePerMile}</span>
      </div>

      <style jsx>{`
        .dedication-example {
          width: 350px;
          background: linear-gradient(135deg, var(--fc-navy) 0%, #2a4a7a 100%);
          color: white;
          padding: 40px 28px;
          border-radius: 16px;
          text-align: center;
          position: relative;
        }

        .bh {
          position: absolute;
          top: 12px;
          right: 16px;
          font-size: 0.7rem;
          opacity: 0.5;
        }

        .card-label {
          font-size: 0.7rem;
          letter-spacing: 2px;
          opacity: 0.6;
          margin-bottom: 20px;
        }

        .mile-badge {
          display: inline-block;
          background: var(--fc-teal);
          padding: 12px 28px;
          border-radius: 30px;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .dedication-content {
          background: rgba(255,255,255,0.1);
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .dedication-text {
          font-style: italic;
          font-size: 1.05rem;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .sponsor {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .runner-info {
          margin-bottom: 24px;
        }

        .runner-info p {
          font-size: 0.95rem;
          margin-bottom: 4px;
        }

        .runner-info strong {
          color: var(--fc-teal);
        }

        .event {
          opacity: 0.7;
          font-size: 0.85rem;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.2);
        }

        .brand {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .price {
          background: rgba(255,255,255,0.15);
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}

// Story: Pick Your Mile
function PickYourMileStory({ settings }) {
  return (
    <div className="story-card">
      <div className="bh">B"H</div>
      <div className="headline">
        <div className="blue">PICK YOUR MILE.</div>
        <div className="white">OWN THE MOMENT.</div>
      </div>
      <div className="subtext">SPONSOR MILE 1, MILE 13, OR THE FINISH LINE</div>
      <div className="emoji">🗺️</div>
      <div className="cta-section">
        <div className="cta-main">Choose your mile at</div>
        <div className="cta-url">{settings.pageUrl}</div>
      </div>
      <div className="brand">
        <div className="brand-icon" />
        <span className="team">Team</span>Friendship
      </div>

      <style jsx>{`
        .story-card {
          width: 270px;
          height: 480px;
          background: linear-gradient(180deg, #1a2744 0%, #0f1729 100%);
          border-radius: 12px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 25px 20px;
          color: white;
        }
        .bh {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 15px;
          letter-spacing: 1px;
        }
        .headline {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 28px;
          line-height: 1.05;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .blue { color: #7dd3fc; }
        .white { color: white; }
        .subtext {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          line-height: 1.4;
          text-transform: uppercase;
        }
        .emoji {
          font-size: 80px;
          margin: 15px 0;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
        }
        .cta-section {
          position: absolute;
          bottom: 60px;
          text-align: center;
        }
        .cta-main {
          font-weight: 700;
          font-size: 14px;
          color: white;
          margin-bottom: 8px;
        }
        .cta-url {
          font-size: 11px;
          color: rgba(255,255,255,0.7);
        }
        .brand {
          position: absolute;
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
        }
        .brand-icon {
          width: 16px;
          height: 16px;
          background: #7dd3fc;
          border-radius: 50%;
        }
        .team {
          color: white;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

// Story: Mile Grid Visual
function MileGridStory({ settings }) {
  const totalMiles = Math.floor(settings.totalMiles);
  const sponsoredMiles = [1, 2, 5, 8]; // Example sponsored miles

  return (
    <div className="story-card">
      <div className="bh">B"H</div>
      <div className="headline">
        <div className="blue">{totalMiles} MILES.</div>
        <div className="white">WHICH ONE IS YOURS?</div>
      </div>
      <div className="subtext">DEDICATE A MILE IN SOMEONE'S HONOR</div>
      <div className="mile-grid">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((mile) => (
          <div
            key={mile}
            className={`mile ${sponsoredMiles.includes(mile) ? 'sponsored' : 'available'}`}
          >
            {mile}
          </div>
        ))}
      </div>
      <div className="legend">🟢 Sponsored  ⬜ Available</div>
      <div className="cta-section">
        <div className="cta-main">Claim yours at</div>
        <div className="cta-url">{settings.pageUrl}</div>
      </div>
      <div className="brand">
        <div className="brand-icon" />
        <span className="team">Team</span>Friendship
      </div>

      <style jsx>{`
        .story-card {
          width: 270px;
          height: 480px;
          background: linear-gradient(180deg, #1a2744 0%, #0f1729 100%);
          border-radius: 12px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 25px 20px;
          color: white;
        }
        .bh {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 15px;
          letter-spacing: 1px;
        }
        .headline {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 28px;
          line-height: 1.05;
          margin-bottom: 8px;
        }
        .blue { color: #7dd3fc; }
        .white { color: white; }
        .subtext {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 15px;
          text-transform: uppercase;
        }
        .mile-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 4px;
          margin: 10px;
          width: 90%;
        }
        .mile {
          border-radius: 4px;
          padding: 6px 0;
          font-size: 10px;
          font-weight: 600;
        }
        .mile.sponsored {
          background: #36bbae;
          color: white;
        }
        .mile.available {
          background: #e5e7eb;
          color: #1b365d;
        }
        .legend {
          font-size: 9px;
          color: rgba(255,255,255,0.6);
          margin-top: 5px;
        }
        .cta-section {
          position: absolute;
          bottom: 60px;
          text-align: center;
        }
        .cta-main {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .cta-url {
          font-size: 11px;
          color: rgba(255,255,255,0.7);
        }
        .brand {
          position: absolute;
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
        }
        .brand-icon {
          width: 16px;
          height: 16px;
          background: #7dd3fc;
          border-radius: 50%;
        }
        .team {
          color: white;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

// Story: Finish Line Open
function FinishLineStory({ settings }) {
  return (
    <div className="story-card">
      <div className="bh">B"H</div>
      <div className="headline">
        <div className="blue">THE FINISH LINE</div>
        <div className="white">IS STILL OPEN.</div>
      </div>
      <div className="subtext">SPONSOR MILE {settings.totalMiles}<br/>AND CARRY ME HOME</div>
      <div className="emoji">🏁</div>
      <div className="cta-section">
        <div className="cta-main">Claim the finish line at</div>
        <div className="cta-url">{settings.pageUrl}</div>
      </div>
      <div className="brand">
        <div className="brand-icon" />
        <span className="team">Team</span>Friendship
      </div>

      <style jsx>{`
        .story-card {
          width: 270px;
          height: 480px;
          background: linear-gradient(180deg, #1a2744 0%, #0f1729 100%);
          border-radius: 12px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 25px 20px;
          color: white;
        }
        .bh {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 15px;
          letter-spacing: 1px;
        }
        .headline {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 28px;
          line-height: 1.05;
          margin-bottom: 8px;
        }
        .blue { color: #7dd3fc; }
        .white { color: white; }
        .subtext {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 20px;
          text-transform: uppercase;
          line-height: 1.4;
        }
        .emoji {
          font-size: 80px;
          margin: 15px 0;
        }
        .cta-section {
          position: absolute;
          bottom: 60px;
          text-align: center;
        }
        .cta-main {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .cta-url {
          font-size: 11px;
          color: rgba(255,255,255,0.7);
        }
        .brand {
          position: absolute;
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
        }
        .brand-icon {
          width: 16px;
          height: 16px;
          background: #7dd3fc;
          border-radius: 50%;
        }
        .team {
          color: white;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

// Story: Miles Going Fast
function MilesGoingFastStory({ settings }) {
  return (
    <div className="story-card">
      <div className="bh">B"H</div>
      <div className="headline">
        <div className="blue">MILES ARE</div>
        <div className="white">GOING FAST.</div>
      </div>
      <div className="subtext">18 OF {Math.floor(settings.totalMiles)} ALREADY CLAIMED!</div>
      <div className="emoji">🔥</div>
      <div className="cta-section">
        <div className="cta-main">Grab yours before they're gone</div>
        <div className="cta-url">{settings.pageUrl}</div>
      </div>
      <div className="brand">
        <div className="brand-icon" />
        <span className="team">Team</span>Friendship
      </div>

      <style jsx>{`
        .story-card {
          width: 270px;
          height: 480px;
          background: linear-gradient(180deg, #1a2744 0%, #0f1729 100%);
          border-radius: 12px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 25px 20px;
          color: white;
        }
        .bh {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 15px;
          letter-spacing: 1px;
        }
        .headline {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 28px;
          line-height: 1.05;
          margin-bottom: 8px;
        }
        .blue { color: #7dd3fc; }
        .white { color: white; }
        .subtext {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 20px;
          text-transform: uppercase;
        }
        .emoji {
          font-size: 80px;
          margin: 15px 0;
        }
        .cta-section {
          position: absolute;
          bottom: 60px;
          text-align: center;
        }
        .cta-main {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .cta-url {
          font-size: 11px;
          color: rgba(255,255,255,0.7);
        }
        .brand {
          position: absolute;
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
        }
        .brand-icon {
          width: 16px;
          height: 16px;
          background: #7dd3fc;
          border-radius: 50%;
        }
        .team {
          color: white;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

// Story: Extra Mile
function ExtraMileStory({ settings }) {
  return (
    <div className="story-card">
      <div className="bh">B"H</div>
      <div className="headline">
        <div className="blue">GO THE EXTRA MILE.</div>
        <div className="white">LITERALLY.</div>
      </div>
      <div className="subtext">I'M RUNNING. YOU'RE GIVING.<br/>KIDS ARE WINNING.</div>
      <div className="emoji">🏃‍♂️</div>
      <div className="cta-section">
        <div className="cta-main">Support {settings.runnerName}'s run</div>
        <div className="cta-url">{settings.pageUrl}</div>
      </div>
      <div className="brand">
        <div className="brand-icon" />
        <span className="team">Team</span>Friendship
      </div>

      <style jsx>{`
        .story-card {
          width: 270px;
          height: 480px;
          background: linear-gradient(180deg, #1a2744 0%, #0f1729 100%);
          border-radius: 12px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 25px 20px;
          color: white;
        }
        .bh {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 15px;
          letter-spacing: 1px;
        }
        .headline {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 28px;
          line-height: 1.05;
          margin-bottom: 8px;
        }
        .blue { color: #7dd3fc; }
        .white { color: white; }
        .subtext {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 20px;
          text-transform: uppercase;
          line-height: 1.4;
        }
        .emoji {
          font-size: 80px;
          margin: 15px 0;
        }
        .cta-section {
          position: absolute;
          bottom: 60px;
          text-align: center;
        }
        .cta-main {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .cta-url {
          font-size: 11px;
          color: rgba(255,255,255,0.7);
        }
        .brand {
          position: absolute;
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
        }
        .brand-icon {
          width: 16px;
          height: 16px;
          background: #7dd3fc;
          border-radius: 50%;
        }
        .team {
          color: white;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

// Story: Per Mile Ask
function PerMileStory({ settings }) {
  return (
    <div className="story-card">
      <div className="bh">B"H</div>
      <div className="headline">
        <div className="blue">SPONSOR A MILE.</div>
        <div className="white">${settings.pricePerMile} PER MILE.</div>
      </div>
      <div className="subtext">I'M RUNNING {settings.totalMiles} OF THEM.</div>
      <div className="emoji">📍</div>
      <div className="cta-section">
        <div className="cta-main">Support {settings.runnerName}'s run</div>
        <div className="cta-url">{settings.pageUrl}</div>
      </div>
      <div className="brand">
        <div className="brand-icon" />
        <span className="team">Team</span>Friendship
      </div>

      <style jsx>{`
        .story-card {
          width: 270px;
          height: 480px;
          background: linear-gradient(180deg, #1a2744 0%, #0f1729 100%);
          border-radius: 12px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 25px 20px;
          color: white;
        }
        .bh {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 15px;
          letter-spacing: 1px;
        }
        .headline {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 28px;
          line-height: 1.05;
          margin-bottom: 8px;
        }
        .blue { color: #7dd3fc; }
        .white { color: white; }
        .subtext {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 20px;
          text-transform: uppercase;
        }
        .emoji {
          font-size: 80px;
          margin: 15px 0;
        }
        .cta-section {
          position: absolute;
          bottom: 60px;
          text-align: center;
        }
        .cta-main {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .cta-url {
          font-size: 11px;
          color: rgba(255,255,255,0.7);
        }
        .brand {
          position: absolute;
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
        }
        .brand-icon {
          width: 16px;
          height: 16px;
          background: #7dd3fc;
          border-radius: 50%;
        }
        .team {
          color: white;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
