import { NextResponse } from 'next/server';
import { getActiveRunners, getCoachingDayByDate, getDayForDate, getStreak } from '@/lib/coaching';
import { sendSMS, buildDailySMS } from '@/lib/sms';

// POST /api/coaching/send-daily
// Triggered by Make.com cron at 8am ET (Sun-Fri)
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
        message: 'Not a coaching day (Shabbat or outside program dates)',
        sent: 0
      });
    }

    const dayContent = await getCoachingDayByDate(today);
    if (!dayContent) {
      return NextResponse.json({
        error: `No content found for day ${dayNumber}`,
        date: today.toISOString().split('T')[0]
      }, { status: 404 });
    }

    const runners = await getActiveRunners();
    const results = [];

    for (const runner of runners) {
      const streak = await getStreak(runner.id);

      const smsBody = buildDailySMS({
        runner,
        dayNumber,
        streak,
        title: dayContent.title,
        briefDescription: dayContent.sms_text
      });

      const result = await sendSMS({
        to: runner.phone,
        body: smsBody,
        runnerId: runner.id,
        messageType: 'daily'
      });

      results.push({
        runner: runner.name,
        success: result.success,
        error: result.error || null
      });
    }

    const sent = results.filter(r => r.success).length;
    return NextResponse.json({
      success: true,
      day: dayNumber,
      sent,
      total: runners.length,
      results
    });
  } catch (error) {
    console.error('Send daily error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
