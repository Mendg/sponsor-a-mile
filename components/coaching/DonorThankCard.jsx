'use client';

import { useState, useMemo, useRef } from 'react';
import { formatCurrency } from '@/lib/utils';

export default function DonorThankCard({ activity, fundraiseUrl, runnerName }) {
  const [dismissed, setDismissed] = useState(false);
  const [showGraphic, setShowGraphic] = useState(false);
  const [generating, setGenerating] = useState(false);
  const graphicRef = useRef(null);

  // Find most recent donation from activity feed
  const recentDonation = useMemo(() => {
    if (!activity) return null;

    const donation = activity.find(item => item.event_type === 'donation');
    if (!donation) return null;

    // Only show if within last 48 hours
    const donationTime = new Date(donation.created_at);
    const now = new Date();
    const hoursSince = (now - donationTime) / (1000 * 60 * 60);
    if (hoursSince > 48) return null;

    return donation;
  }, [activity]);

  if (!recentDonation || dismissed) return null;

  // Extract donor name from title (format: "Name donated")
  const donorName = recentDonation.title.replace(' donated', '');
  const amount = recentDonation.amount;

  const thankMessage = `Thank you so much for your ${amount ? formatCurrency(amount) : ''} donation to my NYC Half Marathon fundraiser! It means the world to me and the kids and teens at Friendship Circle.`;
  const encodedMessage = encodeURIComponent(thankMessage);

  const handleSaveGraphic = async () => {
    if (!graphicRef.current || generating) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(graphicRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false
      });
      const link = document.createElement('a');
      link.download = `thank-you-${donorName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generating graphic:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="donor-thank-card">
      <button className="donor-thank-dismiss" onClick={() => setDismissed(true)}>x</button>
      <div className="donor-thank-header">
        <span className="donor-thank-emoji">💰</span>
        <div>
          <div className="donor-thank-name">{donorName} donated{amount ? ` ${formatCurrency(amount)}` : ''}!</div>
          <div className="donor-thank-prompt">Send a quick thank you</div>
        </div>
      </div>
      <div className="donor-thank-actions">
        <a className="donor-thank-btn sms" href={`sms:?&body=${encodedMessage}`}>
          💬 Text
        </a>
        <a
          className="donor-thank-btn whatsapp"
          href={`https://wa.me/?text=${encodedMessage}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          📱 WhatsApp
        </a>
        <button
          className="donor-thank-btn graphic"
          onClick={() => setShowGraphic(!showGraphic)}
        >
          📸
        </button>
      </div>

      {showGraphic && (
        <div className="donor-graphic-section">
          <div ref={graphicRef} className="donor-graphic-card">
            <div className="donor-graphic-bh">B"H</div>
            <div className="donor-graphic-emoji">🙏</div>
            <div className="donor-graphic-thank">Thank You</div>
            <div className="donor-graphic-donor">{donorName}</div>
            {amount && <div className="donor-graphic-amount">{formatCurrency(amount)}</div>}
            <div className="donor-graphic-message">
              Thank you for supporting {runnerName || 'my'}{runnerName ? "'s" : ''} marathon!
            </div>
            <div className="donor-graphic-branding">
              <span className="donor-graphic-logo">Team Friendship</span>
              <span className="donor-graphic-event">NYC Half 2026</span>
            </div>
          </div>
          <button
            className="share-achievement-btn"
            onClick={handleSaveGraphic}
            disabled={generating}
          >
            {generating ? 'Generating...' : '📸 Save & Share'}
          </button>
        </div>
      )}
    </div>
  );
}
