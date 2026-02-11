'use client';

import { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';

export default function DonorThankCard({ activity, fundraiseUrl }) {
  const [dismissed, setDismissed] = useState(false);

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

  return (
    <div className="donor-thank-card">
      <button className="donor-thank-dismiss" onClick={() => setDismissed(true)}>×</button>
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
      </div>
    </div>
  );
}
