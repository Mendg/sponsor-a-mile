'use client';

const PHASE_EMOJI = {
  foundation: '🌱',
  expand: '🚀',
  push: '⚡',
  close: '🏁',
};

const TEASERS = {
  2: "Tomorrow: your page becomes a magnet",
  3: "Tomorrow: 3 texts that raise real money",
  4: "Tomorrow: one story, thousands of eyeballs",
  5: "Tomorrow: the email your family actually reads",
  6: "Tomorrow: Shabbat table becomes your fundraiser",
  7: "Tomorrow: you go beyond your inner circle",
  8: "Tomorrow: donors hear your voice (literally)",
  9: "Tomorrow: 5 friends who've been waiting to hear from you",
  10: "Tomorrow: a training photo worth $100+",
  11: "Tomorrow: the single highest-leverage ask of the program",
  12: "Tomorrow: halfway celebration + a Shabbat share",
  13: "Tomorrow: friendly competition gets serious",
  14: "Tomorrow: your 30-second video might raise more than everything else combined",
  15: "Tomorrow: your silent followers become donors",
  16: "Tomorrow: your community steps up",
  17: "Tomorrow: a local business says yes",
  18: "Tomorrow: the countdown begins",
  19: "Tomorrow: unfinished business from week 1",
  20: "Tomorrow: one hour. Maximum impact.",
  21: "Tomorrow: public gratitude unlocks generosity",
  22: "Tomorrow: the ask you've been building toward",
  23: "Tomorrow: the last big push",
  24: "Tomorrow: you finish what you started",
};

export default function TomorrowTeaser({ nextDay }) {
  if (!nextDay) return null;

  const emoji = PHASE_EMOJI[nextDay.phase] || '📋';
  const teaser = TEASERS[nextDay.day_number];

  return (
    <div className="tomorrow-card">
      <div className="tomorrow-label">What's next</div>
      <div className="tomorrow-title">
        {emoji} Day {nextDay.day_number}: {nextDay.title}
      </div>
      {teaser && (
        <div className="tomorrow-teaser">{teaser}</div>
      )}
    </div>
  );
}
