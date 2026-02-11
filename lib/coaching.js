import { getDb } from './db';

// Program dates: Feb 15 - Mar 14, 2026 (skipping Shabbat/Saturdays)
const PROGRAM_START = new Date('2026-02-15');
const PROGRAM_END = new Date('2026-03-14');

// Check if a date is Shabbat (Saturday)
export function isShabbat(date) {
  const d = new Date(date);
  return d.getDay() === 6; // Saturday
}

// Get the coaching day number for a given date, or null if not a coaching day
export function getDayForDate(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const start = new Date(PROGRAM_START);
  start.setHours(0, 0, 0, 0);

  const end = new Date(PROGRAM_END);
  end.setHours(23, 59, 59, 999);

  if (d < start || d > end) return null;
  if (isShabbat(d)) return null;

  // Count non-Shabbat days from start to this date
  let dayNumber = 0;
  const cursor = new Date(start);
  while (cursor <= d) {
    if (!isShabbat(cursor)) {
      dayNumber++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dayNumber > 24 ? null : dayNumber;
}

// Generate calendar_date for each coaching day (for seeding coaching_days table)
export function generateCoachingCalendar() {
  const calendar = [];
  let dayNumber = 0;
  const cursor = new Date(PROGRAM_START);
  const end = new Date(PROGRAM_END);

  while (cursor <= end && dayNumber < 24) {
    if (!isShabbat(cursor)) {
      dayNumber++;
      calendar.push({
        day_number: dayNumber,
        calendar_date: cursor.toISOString().split('T')[0]
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return calendar;
}

// Get a runner by their coaching token
export async function getRunnerByToken(token) {
  if (!token) return null;
  const db = getDb();

  const runners = await db`
    SELECT * FROM runners WHERE coaching_token = ${token} AND coaching_active = true
  `;

  return runners.length > 0 ? runners[0] : null;
}

// Get all active coaching runners
export async function getActiveRunners() {
  const db = getDb();
  return db`
    SELECT * FROM runners WHERE coaching_active = true AND phone IS NOT NULL
  `;
}

// Get coaching day content
export async function getCoachingDay(dayNumber) {
  const db = getDb();
  const days = await db`
    SELECT * FROM coaching_days WHERE day_number = ${dayNumber}
  `;
  return days.length > 0 ? days[0] : null;
}

// Get coaching day content by calendar date
export async function getCoachingDayByDate(date) {
  const db = getDb();
  const dateStr = new Date(date).toISOString().split('T')[0];
  const days = await db`
    SELECT * FROM coaching_days WHERE calendar_date = ${dateStr}
  `;
  return days.length > 0 ? days[0] : null;
}

// Calculate streak for a runner (consecutive completed days, Shabbat doesn't break)
export async function getStreak(runnerId) {
  const db = getDb();

  const progress = await db`
    SELECT day_number, completed FROM coaching_progress
    WHERE runner_id = ${runnerId}
    ORDER BY day_number DESC
  `;

  if (progress.length === 0) return 0;

  // Get current day number
  const today = getDayForDate(new Date());
  let streak = 0;

  // Walk backwards from most recent day
  // If today is a coaching day and not yet completed, start checking from yesterday's day
  const completedDays = new Set(
    progress.filter(p => p.completed).map(p => p.day_number)
  );

  // Walk backwards from today (or the last coaching day)
  const startDay = today || getLastCoachingDay();

  for (let d = startDay; d >= 1; d--) {
    if (completedDays.has(d)) {
      streak++;
    } else if (d === today) {
      // Today not completed yet is ok, don't break streak
      continue;
    } else {
      break;
    }
  }

  return streak;
}

// Get the last coaching day number that has passed
function getLastCoachingDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(PROGRAM_START);
  start.setHours(0, 0, 0, 0);

  let dayNumber = 0;
  const cursor = new Date(start);
  while (cursor <= today) {
    if (!isShabbat(cursor)) {
      dayNumber++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return Math.min(dayNumber, 24);
}

// Get tier based on total raised
export function getTier(totalRaised) {
  if (totalRaised >= 2500) return { name: 'Legend', emoji: '👑', threshold: 2500 };
  if (totalRaised >= 1000) return { name: 'Champion', emoji: '🏆', threshold: 1000 };
  if (totalRaised >= 250) return { name: 'Fundraiser', emoji: '⭐', threshold: 250 };
  return { name: 'Runner', emoji: '🏃', threshold: 0 };
}

// Get next tier info for progress display
export function getNextTier(totalRaised) {
  if (totalRaised >= 2500) return null; // Already at max
  if (totalRaised >= 1000) return { name: 'Legend', threshold: 2500, remaining: 2500 - totalRaised };
  if (totalRaised >= 250) return { name: 'Champion', threshold: 1000, remaining: 1000 - totalRaised };
  return { name: 'Fundraiser', threshold: 250, remaining: 250 - totalRaised };
}

// Get total raised for a runner from coaching_donations
export async function getTotalRaised(runnerId) {
  const db = getDb();
  const result = await db`
    SELECT COALESCE(SUM(amount), 0) as total FROM coaching_donations WHERE runner_id = ${runnerId}
  `;
  return parseFloat(result[0].total);
}

// Get days completed count
export async function getDaysCompleted(runnerId) {
  const db = getDb();
  const result = await db`
    SELECT COUNT(*) as count FROM coaching_progress
    WHERE runner_id = ${runnerId} AND completed = true
  `;
  return parseInt(result[0].count);
}

// Get recent activity for a runner (their donations + their completions)
export async function getActivity(runnerId, limit = 20) {
  const db = getDb();
  return db`
    SELECT * FROM coaching_activity
    WHERE runner_id = ${runnerId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}

// Get team-wide activity feed
export async function getTeamActivity(limit = 30) {
  const db = getDb();
  return db`
    SELECT ca.*, r.name as runner_name FROM coaching_activity ca
    JOIN runners r ON ca.runner_id = r.id
    ORDER BY ca.created_at DESC
    LIMIT ${limit}
  `;
}

// Get team leaderboard
export async function getTeamLeaderboard() {
  const db = getDb();
  return db`
    SELECT
      r.id, r.name, r.slug, r.coaching_token,
      COALESCE(cd.total_raised, 0) as total_raised,
      COALESCE(cp.days_completed, 0) as days_completed
    FROM runners r
    LEFT JOIN (
      SELECT runner_id, SUM(amount) as total_raised FROM coaching_donations GROUP BY runner_id
    ) cd ON r.id = cd.runner_id
    LEFT JOIN (
      SELECT runner_id, COUNT(*) as days_completed FROM coaching_progress WHERE completed = true GROUP BY runner_id
    ) cp ON r.id = cp.runner_id
    WHERE r.coaching_active = true
    ORDER BY COALESCE(cd.total_raised, 0) DESC
  `;
}

// Log activity event
export async function logActivity({ runnerId, eventType, title, detail, amount }) {
  const db = getDb();
  await db`
    INSERT INTO coaching_activity (runner_id, event_type, title, detail, amount)
    VALUES (${runnerId}, ${eventType}, ${title}, ${detail || null}, ${amount || null})
  `;
}

// Check for milestone achievements and return any new ones
export async function checkMilestones(runnerId) {
  const milestones = [];
  const totalRaised = await getTotalRaised(runnerId);
  const streak = await getStreak(runnerId);
  const db = getDb();

  // Check amount milestones
  const amountThresholds = [500, 1000, 1500, 2500];
  for (const threshold of amountThresholds) {
    if (totalRaised >= threshold) {
      const existing = await db`
        SELECT id FROM coaching_activity
        WHERE runner_id = ${runnerId} AND event_type = 'milestone' AND title = ${'raised_' + threshold}
      `;
      if (existing.length === 0) {
        milestones.push({ type: `raised_${threshold}`, value: totalRaised });
      }
    }
  }

  // Check streak milestones
  const streakThresholds = [7, 14, 21];
  for (const threshold of streakThresholds) {
    if (streak >= threshold) {
      const existing = await db`
        SELECT id FROM coaching_activity
        WHERE runner_id = ${runnerId} AND event_type = 'milestone' AND title = ${'streak_' + threshold}
      `;
      if (existing.length === 0) {
        milestones.push({ type: `streak_${threshold}`, value: streak });
      }
    }
  }

  return milestones;
}
