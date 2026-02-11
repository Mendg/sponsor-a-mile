import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getActiveRunners, getDayForDate, getStreak } from '@/lib/coaching';
import { sendSMS, buildReminderSMS } from '@/lib/sms';

// POST /api/coaching/send-reminders
// Triggered by Make.com cron at 6pm ET (Sun-Fri)
// Only sends to runners who haven't completed today's action
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const secret = body.secret || request.headers.get('x-webhook-secret');
    const expectedSecret = process.env.COACHING_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const dayNumber = getDayForDate(today);

    if (!dayNumber) {
      return NextResponse.json({
        success: true,
        message: 'Not a coaching day',
        sent: 0
      });
    }

    const db = getDb();
    const runners = await getActiveRunners();
    const results = [];

    for (const runner of runners) {
      // Check if already completed today
      const completed = await db`
        SELECT id FROM coaching_progress
        WHERE runner_id = ${runner.id} AND day_number = ${dayNumber} AND completed = true
      `;

      if (completed.length > 0) {
        results.push({ runner: runner.name, skipped: true, reason: 'already_completed' });
        continue;
      }

      const streak = await getStreak(runner.id);

      const smsBody = buildReminderSMS({ runner, streak, dayNumber });

      const result = await sendSMS({
        to: runner.phone,
        body: smsBody,
        runnerId: runner.id,
        messageType: 'reminder'
      });

      results.push({
        runner: runner.name,
        success: result.success,
        error: result.error || null
      });
    }

    const sent = results.filter(r => r.success && !r.skipped).length;
    const skipped = results.filter(r => r.skipped).length;

    return NextResponse.json({
      success: true,
      day: dayNumber,
      sent,
      skipped,
      total: runners.length,
      results
    });
  } catch (error) {
    console.error('Send reminders error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
