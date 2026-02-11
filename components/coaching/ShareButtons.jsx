'use client';

import { useState } from 'react';

export default function ShareButtons({ fundraiseUrl, runnerName }) {
  const [linkCopied, setLinkCopied] = useState(false);

  if (!fundraiseUrl) return null;

  const shareText = `I'm running the NYC Half Marathon with Team Friendship to support kids and teens with special needs. Every dollar makes a difference. Can you help me reach my goal?`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(fundraiseUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${fundraiseUrl}`);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = `${shareText}\n\n${fundraiseUrl}`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <div className="share-row">
      <a
        className="share-btn sms"
        href={`sms:?&body=${encodedText}%0A%0A${encodedUrl}`}
      >
        💬 Text
      </a>
      <a
        className="share-btn whatsapp"
        href={`https://wa.me/?text=${encodedText}%0A%0A${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        📱 WhatsApp
      </a>
      <button
        className={`share-btn copy-link ${linkCopied ? 'copied' : ''}`}
        onClick={handleCopyLink}
      >
        {linkCopied ? '✓ Copied!' : '🔗 Copy'}
      </button>
    </div>
  );
}
