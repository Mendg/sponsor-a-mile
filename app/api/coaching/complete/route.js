import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getRunnerByToken, getStreak, checkMilestones, logActivity, getTotalRaised } from '@/lib/coaching';
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

    // Upsert completion (idempotent)
    await db`
      INSERT INTO coaching_progress (runner_id, day_number, completed, completed_at, easy_mode)
      VALUES (${runner.id}, ${day_number}, true, NOW(), ${easy_mode})
      ON CONFLICT (runner_id, day_number)
      DO UPDATE SET completed = true, completed_at = NOW(), easy_mode = ${easy_mode}
    `;

    // Log activity
    await logActivity({
      runnerId: runner.id,
      eventType: 'action_completed',
      title: `Completed Day ${day_number}`,
      detail: easy_mode ? 'Easy mode' : null
    });

    // Calculate updated streak
    const streak = await getStreak(runner.id);
    const totalRaised = await getTotalRaised(runner.id);

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

    return NextResponse.json({
      success: true,
      streak,
      total_raised: totalRaised,
      milestones: milestones.map(m => m.type)
    });
  } catch (error) {
    console.error('Complete action error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
