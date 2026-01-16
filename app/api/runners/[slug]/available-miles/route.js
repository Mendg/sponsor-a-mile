import { NextResponse } from 'next/server';
import { getDb, getAvailableMiles } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const sql = getDb();

    // Get runner by slug
    const runners = await sql`
      SELECT id, total_miles FROM runners WHERE slug = ${slug}
    `;

    if (runners.length === 0) {
      return NextResponse.json(
        { error: 'Runner not found' },
        { status: 404 }
      );
    }

    const runner = runners[0];
    const availableMiles = await getAvailableMiles(
      runner.id,
      parseFloat(runner.total_miles)
    );

    return NextResponse.json({
      runner_id: runner.id,
      total_miles: parseFloat(runner.total_miles),
      available_miles: availableMiles,
      available_count: availableMiles.length
    });
  } catch (error) {
    console.error('Error fetching available miles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
