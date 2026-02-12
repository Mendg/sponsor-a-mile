import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getRunnerByToken, getStreak, checkMilestones, logActivity, getTotalRaised, getTier, checkAndAwardStreakFreeze, awardPoints, POINTS_VALUES, recordQuestParticipation } from '@/lib/coaching';
import { sendSMS, buildMilestoneSMS } from '@/lib/sms';

// POST /api/coaching/complete
// Runner marks today's action as done
// Body: { token, day_number, easy_mode? }
export async function POST(request) {
  try {
    const { token, day_number, easy_mode = false } = await request.json();

    if (!token || !day_number) {
      return NextResponse.json({ error: 'Missing token or day_number' }, { status: 400 });
    }

    const runner = await getRunnerByToken(token);
    if (!runner) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const db = getDb();

    // Check if already completed (prevent duplicate activity/points)
    const existing = await db`
      SELECT id FROM coaching_progress
      WHERE runner_id = ${runner.id} AND day_number = ${day_number} AND completed = true
    `;
    const alreadyCompleted = existing.length > 0;

    // Upsert completion (idempotent)
    await db`
      INSERT INTO coaching_progress (runner_id, day_number, completed, completed_at, easy_mode)
      VALUES (${runner.id}, ${day_number}, true, NOW(), ${easy_mode})
      ON CONFLICT (runner_id, day_number)
      DO UPDATE SET completed = true, completed_at = NOW(), easy_mode = ${easy_mode}
    `;

    // Only log activity and award points on first completion
    if (!alreadyCompleted) {
      await logActivity({
        runnerId: runner.id,
        eventType: 'action_completed',
        title: `Completed Day ${day_number}`,
        detail: easy_mode ? 'Easy mode' : null
      });

      await awardPoints({
        runnerId: runner.id,
        points: POINTS_VALUES.DAILY_COMPLETION,
        reason: 'daily_completion',
        details: `Day ${day_number} completed`
      });

      await recordQuestParticipation(runner.id, 1);
    }

    // Calculate updated streak
    const streak = await getStreak(runner.id);
    const totalRaised = await getTotalRaised(runner.id);
    const tier = getTier(totalRaised);

    // Check for milestone achievements
    const milestones = await checkMilestones(runner.id);
    for (const milestone of milestones) {
      await logActivity({
        runnerId: runner.id,
        eventType: 'milestone',
        title: milestone.type,
        detail: `Value: ${milestone.value}`
      });

      // Send milestone SMS
      const milestoneSMS = buildMilestoneSMS({
        runner,
        milestone: milestone.type,
        value: milestone.value
      });

      await sendSMS({
        to: runner.phone,
        body: milestoneSMS,
        runnerId: runner.id,
        messageType: 'milestone'
      });
    }

    // Check if runner earned a streak freeze
    const freezeAwarded = await checkAndAwardStreakFreeze(runner.id);
    if (freezeAwarded && runner.phone) {
      await sendSMS({
        to: runner.phone,
        body: `🧊 Streak Freeze Earned! You completed 7 consecutive days. You now have ${freezeAwarded.freezesAvailable} ${freezeAwarded.freezesAvailable === 1 ? 'freeze' : 'freezes'}. If you miss a day, we'll automatically protect your streak.`,
        runnerId: runner.id,
        messageType: 'freeze_earned'
      });
    }

    return NextResponse.json({
      success: true,
      streak,
      total_raised: totalRaised,
      tier,
      milestones: milestones.map(m => m.type),
      freeze_earned: freezeAwarded !== null
    });
  } catch (error) {
    console.error('Complete action error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
