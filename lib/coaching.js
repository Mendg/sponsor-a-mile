import { getDb } from './db';

// Program dates: Feb 11 - Mar 10, 2026 (skipping Shabbat/Saturdays)
const PROGRAM_START = new Date('2026-02-11');
const PROGRAM_END = new Date('2026-03-10');

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

// ============================================
// STREAK FREEZE SYSTEM
// ============================================

// Check if runner has earned a new streak freeze (every 7 consecutive days)
export async function checkAndAwardStreakFreeze(runnerId) {
  const db = getDb();
  const streak = await getStreak(runnerId);

  // Earn 1 freeze every 7 days of streak
  const freezesEarned = Math.floor(streak / 7);

  // Get runner's current freeze data
  const runner = await db`
    SELECT streak_freezes_available, streak_freezes_earned FROM runners WHERE id = ${runnerId}
  `;

  if (runner.length === 0) return null;

  const currentEarned = runner[0].streak_freezes_earned || 0;
  const currentAvailable = runner[0].streak_freezes_available || 0;

  // If they've earned more than they have recorded, award new freeze
  if (freezesEarned > currentEarned && currentAvailable < 3) {
    await db`
      UPDATE runners SET
        streak_freezes_available = LEAST(${currentAvailable + 1}, 3),
        streak_freezes_earned = ${freezesEarned},
        last_freeze_earned_at = NOW()
      WHERE id = ${runnerId}
    `;

    await logActivity({
      runnerId,
      eventType: 'freeze_earned',
      title: 'Streak Freeze Earned!',
      detail: `7-day streak = 1 freeze earned. You now have ${Math.min(currentAvailable + 1, 3)} freezes.`
    });

    return { freezesAvailable: Math.min(currentAvailable + 1, 3) };
  }

  return null;
}

// Use a streak freeze when a day is missed
export async function useStreakFreeze(runnerId) {
  const db = getDb();

  const runner = await db`
    SELECT streak_freezes_available, streak_freezes_used FROM runners WHERE id = ${runnerId}
  `;

  if (runner.length === 0 || runner[0].streak_freezes_available <= 0) {
    return { success: false, reason: 'no_freezes_available' };
  }

  const available = runner[0].streak_freezes_available;
  const used = runner[0].streak_freezes_used || 0;

  await db`
    UPDATE runners SET
      streak_freezes_available = ${available - 1},
      streak_freezes_used = ${used + 1},
      last_freeze_used_at = NOW()
    WHERE id = ${runnerId}
  `;

  await logActivity({
    runnerId,
    eventType: 'freeze_used',
    title: 'Streak Freeze Used',
    detail: `Streak protected! ${available - 1} freezes remaining.`
  });

  return {
    success: true,
    freezesRemaining: available - 1
  };
}

// Get runner's streak freeze status
export async function getStreakFreezeStatus(runnerId) {
  const db = getDb();

  const runner = await db`
    SELECT
      streak_freezes_available,
      streak_freezes_earned,
      streak_freezes_used
    FROM runners
    WHERE id = ${runnerId}
  `;

  if (runner.length === 0) return { available: 0, earned: 0, used: 0 };

  return {
    available: runner[0].streak_freezes_available || 0,
    earned: runner[0].streak_freezes_earned || 0,
    used: runner[0].streak_freezes_used || 0
  };
}

// ============================================
// TEAM QUEST SYSTEM
// ============================================

// Get current active team quest
export async function getCurrentTeamQuest() {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  const quests = await db`
    SELECT * FROM team_quests
    WHERE start_date <= ${today} AND end_date >= ${today}
    ORDER BY week_number DESC
    LIMIT 1
  `;

  return quests.length > 0 ? quests[0] : null;
}

// Update team quest progress
export async function updateTeamQuestProgress() {
  const db = getDb();
  const quest = await getCurrentTeamQuest();

  if (!quest || quest.is_completed) return null;

  let currentValue = 0;

  // Calculate current value based on quest type
  if (quest.quest_type === 'fundraising') {
    // Total amount raised by all active runners
    const result = await db`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM coaching_donations cd
      JOIN runners r ON cd.runner_id = r.id
      WHERE r.coaching_active = true
    `;
    currentValue = parseFloat(result[0].total);
  } else if (quest.quest_type === 'completion') {
    // Calculate completion rate for this week
    const activeRunners = await db`
      SELECT COUNT(*) as count FROM runners WHERE coaching_active = true
    `;
    const runnerCount = parseInt(activeRunners[0].count);

    if (runnerCount > 0) {
      // Get days in this quest period
      const daysInPeriod = await db`
        SELECT COUNT(DISTINCT day_number) as count
        FROM coaching_days
        WHERE calendar_date BETWEEN ${quest.start_date} AND ${quest.end_date}
      `;
      const expectedCompletions = runnerCount * parseInt(daysInPeriod[0].count);

      if (expectedCompletions > 0) {
        const completions = await db`
          SELECT COUNT(*) as count
          FROM coaching_progress cp
          JOIN coaching_days cd ON cp.day_number = cd.day_number
          WHERE cp.completed = true
            AND cd.calendar_date BETWEEN ${quest.start_date} AND ${quest.end_date}
        `;
        currentValue = (parseInt(completions[0].count) / expectedCompletions) * 100;
      }
    }
  } else if (quest.quest_type === 'shares') {
    // Count share events in activity log for this week
    const shares = await db`
      SELECT COUNT(*) as count
      FROM coaching_activity
      WHERE event_type = 'share'
        AND created_at BETWEEN ${quest.start_date} AND ${quest.end_date}::date + interval '1 day'
    `;
    currentValue = parseInt(shares[0].count);
  }

  // Update quest progress
  const isCompleted = currentValue >= parseFloat(quest.target_value);

  await db`
    UPDATE team_quests
    SET current_value = ${currentValue},
        is_completed = ${isCompleted},
        completed_at = CASE WHEN ${isCompleted} AND completed_at IS NULL THEN NOW() ELSE completed_at END
    WHERE id = ${quest.id}
  `;

  return {
    ...quest,
    current_value: currentValue,
    is_completed: isCompleted,
    progress_percent: Math.min(100, (currentValue / parseFloat(quest.target_value)) * 100)
  };
}

// Record that a runner contributed to the current quest
export async function recordQuestParticipation(runnerId, contributionValue = 0) {
  const db = getDb();
  const quest = await getCurrentTeamQuest();

  if (!quest) return null;

  await db`
    INSERT INTO quest_participants (quest_id, runner_id, contribution_value, participated)
    VALUES (${quest.id}, ${runnerId}, ${contributionValue}, true)
    ON CONFLICT (quest_id, runner_id)
    DO UPDATE SET
      contribution_value = quest_participants.contribution_value + ${contributionValue},
      participated = true
  `;

  return { quest_id: quest.id };
}

// Check if quest was just completed and award rewards
export async function checkQuestCompletion() {
  const db = getDb();
  const quest = await getCurrentTeamQuest();

  if (!quest || !quest.is_completed || quest.reward_claimed) return null;

  // Get all participants
  const participants = await db`
    SELECT DISTINCT runner_id FROM quest_participants
    WHERE quest_id = ${quest.id} AND participated = true
  `;

  // Award badge/points to all participants
  for (const participant of participants) {
    // Award quest points
    await awardPoints({
      runnerId: participant.runner_id,
      points: quest.reward_points,
      reason: 'quest_completed',
      details: `Team Quest: ${quest.quest_name}`
    });

    await logActivity({
      runnerId: participant.runner_id,
      eventType: 'quest_completed',
      title: `Team Quest: ${quest.quest_name}`,
      detail: `Team defeated the boss! You earned the "${quest.reward_badge}" badge and ${quest.reward_points} bonus points.`
    });
  }

  return {
    quest,
    participant_count: participants.length
  };
}

// ============================================
// POINTS SYSTEM
// ============================================

// Award points to a runner
export async function awardPoints({ runnerId, points, reason, details = null }) {
  const db = getDb();

  // Update runner points
  await db`
    UPDATE runners SET
      points_balance = points_balance + ${points},
      points_lifetime = points_lifetime + ${points},
      points_this_week = points_this_week + ${points},
      last_points_earned_at = NOW()
    WHERE id = ${runnerId}
  `;

  // Log the points transaction
  await db`
    INSERT INTO points_log (runner_id, points_earned, points_reason, details)
    VALUES (${runnerId}, ${points}, ${reason}, ${details})
  `;

  return { points_awarded: points };
}

// Get runner's point balance
export async function getPoints(runnerId) {
  const db = getDb();

  const runner = await db`
    SELECT points_balance, points_lifetime, points_this_week
    FROM runners
    WHERE id = ${runnerId}
  `;

  if (runner.length === 0) return { balance: 0, lifetime: 0, this_week: 0 };

  return {
    balance: runner[0].points_balance || 0,
    lifetime: runner[0].points_lifetime || 0,
    this_week: runner[0].points_this_week || 0
  };
}

// Get point milestones (for badges)
export function getPointMilestone(lifetimePoints) {
  const milestones = [
    { threshold: 0, name: 'Beginner', emoji: '🌱', next: 100 },
    { threshold: 100, name: 'Bronze', emoji: '🥉', next: 250 },
    { threshold: 250, name: 'Silver', emoji: '🥈', next: 500 },
    { threshold: 500, name: 'Gold', emoji: '🥇', next: 1000 },
    { threshold: 1000, name: 'Platinum', emoji: '💎', next: null }
  ];

  for (let i = milestones.length - 1; i >= 0; i--) {
    if (lifetimePoints >= milestones[i].threshold) {
      return milestones[i];
    }
  }

  return milestones[0];
}

// Points values for different actions
export const POINTS_VALUES = {
  DAILY_COMPLETION: 10,
  DAILY_COMPLETION_FAST: 2, // Bonus for opening SMS within 1 hour
  SHARE_PAGE: 5,
  THANK_DONOR: 3,
  BONUS_ACTION: 5,
  DONATION_PER_10: 1, // 1 point per $10 donated
  PERFECT_WEEK: 50, // Bonus for completing all 7 days
  STREAK_MILESTONE_7: 25,
  STREAK_MILESTONE_14: 50,
  STREAK_MILESTONE_21: 100,
  HIGH_FIVE_SEND: 1 // Small reward for sending encouragement
};

// ============================================
// HIGH-FIVES SYSTEM
// ============================================

// Send a high-five to another runner
export async function sendHighFive({ senderId, recipientId }) {
  const db = getDb();

  // Check if already sent today
  const today = new Date().toISOString().split('T')[0];
  const existing = await db`
    SELECT id FROM high_fives
    WHERE sender_id = ${senderId}
      AND recipient_id = ${recipientId}
      AND created_at::date = ${today}::date
  `;

  if (existing.length > 0) {
    return { success: false, reason: 'already_sent_today' };
  }

  // Check daily limit (max 10 high-fives per day)
  const dailyCount = await db`
    SELECT COUNT(*) as count FROM high_fives
    WHERE sender_id = ${senderId}
      AND created_at::date = ${today}::date
  `;

  if (parseInt(dailyCount[0].count) >= 10) {
    return { success: false, reason: 'daily_limit_reached' };
  }

  // Send high-five
  await db`
    INSERT INTO high_fives (sender_id, recipient_id)
    VALUES (${senderId}, ${recipientId})
  `;

  // Award point to sender
  await awardPoints({
    runnerId: senderId,
    points: POINTS_VALUES.HIGH_FIVE_SEND,
    reason: 'high_five_sent',
    details: `Sent high-five to runner ${recipientId}`
  });

  // Log activity for recipient
  const sender = await db`SELECT name FROM runners WHERE id = ${senderId}`;
  if (sender.length > 0) {
    await logActivity({
      runnerId: recipientId,
      eventType: 'high_five_received',
      title: `High-five from ${sender[0].name}`,
      detail: '🙌'
    });
  }

  return { success: true };
}

// Get high-fives received today
export async function getHighFivesToday(runnerId) {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  const result = await db`
    SELECT COUNT(*) as count FROM high_fives
    WHERE recipient_id = ${runnerId}
      AND created_at::date = ${today}::date
  `;

  return parseInt(result[0].count);
}

// Get high-fives given today
export async function getHighFivesSentToday(runnerId) {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  const result = await db`
    SELECT COUNT(*) as count FROM high_fives
    WHERE sender_id = ${runnerId}
      AND created_at::date = ${today}::date
  `;

  return parseInt(result[0].count);
}
