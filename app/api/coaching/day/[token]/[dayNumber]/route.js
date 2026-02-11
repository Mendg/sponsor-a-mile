import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getRunnerByToken, getCoachingDay, getStreak, getTier, getTotalRaised } from '@/lib/coaching';

// GET /api/coaching/day/[token]/[dayNumber]
// Returns day content + runner context for the action page
export async function GET(request, { params }) {
  try {
    const { token, dayNumber } = params;
    const dayNum = parseInt(dayNumber);

    if (!dayNum || dayNum < 1 || dayNum > 24) {
      return NextResponse.json({ error: 'Invalid day number (1-24)' }, { status: 400 });
    }

    const runner = await getRunnerByToken(token);
    if (!runner) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const [dayContent, nextDayContent] = await Promise.all([
      getCoachingDay(dayNum),
      dayNum < 24 ? getCoachingDay(dayNum + 1) : null
    ]);
    if (!dayContent) {
      return NextResponse.json({ error: `No content for day ${dayNum}` }, { status: 404 });
    }

    const db = getDb();

    // Check if already completed
    const progress = await db`
      SELECT * FROM coaching_progress
      WHERE runner_id = ${runner.id} AND day_number = ${dayNum}
    `;

    const [streak, totalRaised] = await Promise.all([
      getStreak(runner.id),
      getTotalRaised(runner.id)
    ]);

    const tier = getTier(totalRaised);

    return NextResponse.json({
      runner: {
        id: runner.id,
        name: runner.name,
        token: runner.coaching_token,
        neon_fundraise_url: runner.neon_fundraise_url
      },
      day: {
        day_number: dayContent.day_number,
        title: dayContent.title,
        lesson: dayContent.lesson,
        action_prompt: dayContent.action_prompt,
        templates: dayContent.templates,
        easy_mode_prompt: dayContent.easy_mode_prompt,
        easy_mode_templates: dayContent.easy_mode_templates,
        phase: dayContent.phase
      },
      next_day: nextDayContent ? {
        day_number: nextDayContent.day_number,
        title: nextDayContent.title,
        phase: nextDayContent.phase
      } : null,
      progress: {
        completed: progress.length > 0 && progress[0].completed,
        completed_at: progress.length > 0 ? progress[0].completed_at : null,
        easy_mode: progress.length > 0 ? progress[0].easy_mode : false
      },
      stats: {
        streak,
        total_raised: totalRaised,
        tier
      }
    });
  } catch (error) {
    console.error('Day content error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
