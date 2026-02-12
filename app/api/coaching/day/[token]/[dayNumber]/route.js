import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getRunnerByToken, getCoachingDay, getStreak, getTier, getTotalRaised } from '@/lib/coaching';

export const dynamic = 'force-dynamic';

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

    // Interpolate runner-specific values into templates
    const goalAmount = parseFloat(runner.goal_amount) || 0;
    const pricePerMile = parseFloat(runner.price_per_mile) || 36;
    const firstName = runner.name.split(' ')[0];
    const fundraiseUrl = runner.neon_fundraise_url || runner.donation_url || '';

    function interpolate(text) {
      if (!text) return text;
      return text
        .replace(/raise 0([^0-9]|$)/g, `raise $${goalAmount.toLocaleString()}$1`)
        .replace(/goal of 0([^0-9]|$)/g, `goal of $${goalAmount.toLocaleString()}$1`)
        .replace(/raised 0 /g, `raised $${Math.round(totalRaised).toLocaleString()} `)
        .replace(/ 0 of 0/g, ` $${Math.round(totalRaised).toLocaleString()} of $${goalAmount.toLocaleString()}`)
        .replace(/sponsor a mile for \?/gi, `sponsor a mile for $${pricePerMile}?`)
        .replace(/sponsor a mile for  on/gi, `sponsor a mile for $${pricePerMile} on`)
        .replace(/a mile for \$/g, `a mile for $${pricePerMile} ($`)
        .replace(/\(sponsor a mile\)/gi, `(sponsor a mile for $${pricePerMile})`)
        .replace(/miles for  \//g, `miles for $${pricePerMile * 5} /`)
        .replace(/for  \/ the finish/g, `for $${pricePerMile * 5} / the finish`)
        .replace(/the finish line for \]/g, `the finish line for $${pricePerMile}]`)
        .replace(/raise  in/g, `raise $${Math.round(goalAmount * 0.1)} in`)
        .replace(/\[URL\]/g, fundraiseUrl);
    }

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
        action_prompt: interpolate(dayContent.action_prompt),
        templates: interpolate(dayContent.templates),
        easy_mode_prompt: interpolate(dayContent.easy_mode_prompt),
        easy_mode_templates: interpolate(dayContent.easy_mode_templates),
        sms_text: dayContent.sms_text,
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
