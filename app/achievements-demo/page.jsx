'use client';

import { useState } from 'react';
import AchievementCard from '@/components/coaching/AchievementCard';
import '@/styles/coaching.css';

export default function AchievementsDemoPage() {
  const [selectedType, setSelectedType] = useState('raised_1000');

  const types = [
    { value: 'streak_7', label: '7-Day Streak' },
    { value: 'streak_14', label: '14-Day Streak' },
    { value: 'streak_21', label: '21-Day Streak' },
    { value: 'raised_500', label: '$500 Raised' },
    { value: 'raised_1000', label: '$1,000 Raised' },
    { value: 'raised_1500', label: '$1,500 Raised' },
    { value: 'raised_2500', label: '$2,500 Raised' },
    { value: 'tier_legend', label: 'Legend Tier' },
    { value: 'halfway', label: 'Halfway There' },
    { value: 'perfect_week', label: 'Perfect Week' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f6f8',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '10px',
          color: '#1b365d'
        }}>
          Achievement Graphics Demo
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '30px'
        }}>
          Preview shareable achievement graphics
        </p>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: 600,
            color: '#374151'
          }}>
            Select Achievement Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              fontSize: '1rem',
              background: 'white'
            }}
          >
            {types.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <AchievementCard
          type={selectedType}
          value={selectedType.includes('raised') ? 1000 : 14}
          runnerName="Mendel Groner"
        />

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'white',
          borderRadius: '16px'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#1b365d' }}>
            Usage Instructions:
          </h3>
          <ul style={{
            color: '#6b7280',
            lineHeight: '1.8',
            paddingLeft: '20px'
          }}>
            <li>Click "📸 Save & Share" to download the graphic</li>
            <li>Share to Instagram Stories, Facebook, or WhatsApp</li>
            <li>Graphics are optimized at 400x500px</li>
            <li>Each achievement type has unique colors and emojis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
