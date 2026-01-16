import { NextResponse } from 'next/server';
import { getRunnerBySlug, getRunnerStats } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    const runner = await getRunnerBySlug(slug);

    if (!runner) {
      return NextResponse.json(
        { error: 'Runner not found' },
        { status: 404 }
      );
    }

    const stats = await getRunnerStats(runner.id);

    return NextResponse.json({
      runner: {
        id: runner.id,
        name: runner.name,
        event_name: runner.event_name,
        event_date: runner.event_date,
        photo_url: runner.photo_url,
        goal_amount: parseFloat(runner.goal_amount),
        price_per_mile: parseFloat(runner.price_per_mile),
        total_miles: parseFloat(runner.total_miles),
        slug: runner.slug
      },
      sponsorships: runner.sponsorships.map(s => ({
        id: s.id,
        mile_number: parseFloat(s.mile_number),
        sponsor_name: s.sponsor_name,
        dedication: s.dedication,
        amount: parseFloat(s.amount),
        is_anonymous: s.is_anonymous,
        created_at: s.created_at
      })),
      stats: {
        sponsored_count: stats.sponsoredCount,
        total_raised: stats.totalRaised,
        total_miles: parseFloat(runner.total_miles),
        goal_amount: parseFloat(runner.goal_amount),
        progress_percent: Math.min(100, (stats.totalRaised / parseFloat(runner.goal_amount)) * 100)
      }
    });
  } catch (error) {
    console.error('Error fetching runner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
