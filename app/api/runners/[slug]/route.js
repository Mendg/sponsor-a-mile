import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const sql = neon(process.env.DATABASE_URL);

    // Get runner
    const runners = await sql`SELECT * FROM runners WHERE slug = ${slug}`;
    if (runners.length === 0) {
      return NextResponse.json(
        { error: 'Runner not found' },
        { status: 404 }
      );
    }
    const runner = runners[0];
    const runnerId = parseInt(runner.id);

    // Get sponsorships directly
    const sponsorships = await sql`
      SELECT * FROM mile_sponsorships
      WHERE runner_id = ${runnerId}
      ORDER BY mile_number ASC
    `;

    // Get stats
    const statsResult = await sql`
      SELECT
        COUNT(*) as sponsored_count,
        COALESCE(SUM(amount), 0) as total_raised
      FROM mile_sponsorships
      WHERE runner_id = ${runnerId}
    `;
    const stats = {
      sponsoredCount: parseInt(statsResult[0].sponsored_count),
      totalRaised: parseFloat(statsResult[0].total_raised)
    };

    const response = NextResponse.json({
      runner: {
        id: runner.id,
        name: runner.name,
        event_name: runner.event_name,
        event_date: runner.event_date,
        photo_url: runner.photo_url,
        goal_amount: parseFloat(runner.goal_amount),
        price_per_mile: parseFloat(runner.price_per_mile),
        total_miles: parseFloat(runner.total_miles),
        mile_increment: parseFloat(runner.mile_increment) || 1,
        slug: runner.slug,
        donation_url: runner.donation_url
      },
      sponsorships: sponsorships.map(s => ({
        id: s.id,
        mile_number: parseFloat(s.mile_number),
        sponsor_name: s.is_anonymous ? 'Anonymous' : s.sponsor_name,
        dedication: s.dedication,
        amount: parseFloat(s.amount),
        is_anonymous: s.is_anonymous,
        created_at: s.created_at
      })),
      stats: {
        sponsored_count: stats.sponsoredCount,
        total_raised: stats.totalRaised,
        total_miles: parseFloat(runner.total_miles),
        goal_amount: parseFloat(runner.goal_amount) || (Math.ceil(parseFloat(runner.total_miles) / (parseFloat(runner.mile_increment) || 1)) * parseFloat(runner.price_per_mile)),
        progress_percent: Math.min(100, (stats.totalRaised / (parseFloat(runner.goal_amount) || (Math.ceil(parseFloat(runner.total_miles) / (parseFloat(runner.mile_increment) || 1)) * parseFloat(runner.price_per_mile)))) * 100)
      }
    });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    return response;
  } catch (error) {
    console.error('Error fetching runner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

