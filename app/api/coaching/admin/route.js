import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getDayForDate, getTier } from '@/lib/coaching';

// GET /api/coaching/admin
// Returns admin dashboard data: all runners + stats
export async function GET(request) {
  try {
    const webhookSecret = request.headers.get('x-webhook-secret');
    if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const todayDay = getDayForDate(new Date());

    // Get all coaching runners with aggregated stats
    const runners = await db`
      SELECT
        r.id, r.name, r.email, r.phone, r.slug, r.coaching_token, r.coaching_active,
        COALESCE(d.total_raised, 0) as total_raised,
        COALESCE(d.donation_count, 0) as donation_count,
        COALESCE(p.days_completed, 0) as days_completed,
        COALESCE(p.last_completed_day, 0) as last_completed_day,
        CASE WHEN tp.id IS NOT NULL THEN true ELSE false END as completed_today
      FROM runners r
      LEFT JOIN (
        SELECT runner_id, SUM(amount) as total_raised, COUNT(*) as donation_count
        FROM coaching_donations GROUP BY runner_id
      ) d ON r.id = d.runner_id
      LEFT JOIN (
        SELECT runner_id, COUNT(*) as days_completed, MAX(day_number) as last_completed_day
        FROM coaching_progress WHERE completed = true GROUP BY runner_id
      ) p ON r.id = p.runner_id
      LEFT JOIN (
        SELECT DISTINCT runner_id, id FROM coaching_progress
        WHERE day_number = ${todayDay || 0} AND completed = true
      ) tp ON r.id = tp.runner_id
      WHERE r.coaching_active = true OR r.coaching_token IS NOT NULL
      ORDER BY COALESCE(d.total_raised, 0) DESC
    `;

    // Calculate summary stats
    const totalRaised = runners.reduce((sum, r) => sum + parseFloat(r.total_raised), 0);
    const activeToday = runners.filter(r => r.completed_today).length;
    const totalActive = runners.filter(r => r.coaching_active).length;
    const completionRate = todayDay && totalActive > 0
      ? Math.round((activeToday / totalActive) * 100)
      : 0;

    return NextResponse.json({
      summary: {
        total_raised: totalRaised,
        active_runners: totalActive,
        active_today: activeToday,
        completion_rate: completionRate,
        current_day: todayDay
      },
      runners: runners.map(r => ({
        ...r,
        total_raised: parseFloat(r.total_raised),
        tier: getTier(parseFloat(r.total_raised)),
        stalling: todayDay && (todayDay - parseInt(r.last_completed_day)) >= 3
      }))
    });
  } catch (error) {
    console.error('Admin data error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
