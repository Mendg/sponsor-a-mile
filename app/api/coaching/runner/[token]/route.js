import { NextResponse } from 'next/server';
import { getRunnerByToken, getStreak, getTier, getNextTier, getTotalRaised, getDaysCompleted, getActivity, getTeamLeaderboard, getDayForDate, getStreakFreezeStatus, getPoints, getPointMilestone } from '@/lib/coaching';
import { getRunnerStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/coaching/runner/[token]
// Returns full dashboard data for a runner
export async function GET(request, { params }) {
  try {
    const { token } = params;
    const runner = await getRunnerByToken(token);

    if (!runner) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const [streak, totalRaised, daysCompleted, activity, leaderboard, mileStats, freezeStatus, points] = await Promise.all([
      getStreak(runner.id),
      getTotalRaised(runner.id),
      getDaysCompleted(runner.id),
      getActivity(runner.id, 20),
      getTeamLeaderboard(),
      getRunnerStats(runner.id),
      getStreakFreezeStatus(runner.id),
      getPoints(runner.id)
    ]);

    const tier = getTier(totalRaised);
    const nextTier = getNextTier(totalRaised);
    const todayDay = getDayForDate(new Date());
    const pointMilestone = getPointMilestone(points.lifetime);

    // Find this runner's position on leaderboard
    const position = leaderboard.findIndex(r => r.id === runner.id) + 1;

    return NextResponse.json({
      runner: {
        id: runner.id,
        name: runner.name,
        slug: runner.slug,
        photo_url: runner.photo_url,
        neon_fundraise_url: runner.neon_fundraise_url,
        total_miles: parseFloat(runner.total_miles),
        mile_increment: parseFloat(runner.mile_increment)
      },
      stats: {
        total_raised: totalRaised,
        streak,
        days_completed: daysCompleted,
        miles_sponsored: mileStats.sponsoredCount,
        tier,
        next_tier: nextTier,
        leaderboard_position: position,
        today_day: todayDay,
        freezes_available: freezeStatus.available,
        freezes_earned: freezeStatus.earned,
        freezes_used: freezeStatus.used,
        points_balance: points.balance,
        points_lifetime: points.lifetime,
        points_this_week: points.this_week,
        point_milestone: pointMilestone
      },
      activity,
      leaderboard: leaderboard.map(r => ({
        id: r.id,
        name: r.name,
        total_raised: parseFloat(r.total_raised),
        days_completed: parseInt(r.days_completed),
        is_me: r.id === runner.id
      }))
    });
  } catch (error) {
    console.error('Runner data error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
