import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Get all runners
export async function GET() {
  try {
    const sql = getDb();
    const runners = await sql`
      SELECT
        r.*,
        COUNT(ms.id) as sponsored_count,
        COALESCE(SUM(ms.amount), 0) as total_raised
      FROM runners r
      LEFT JOIN mile_sponsorships ms ON r.id = ms.runner_id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `;

    return NextResponse.json({ runners });
  } catch (error) {
    console.error('Error fetching runners:', error);
    return NextResponse.json({ error: 'Failed to fetch runners' }, { status: 500 });
  }
}

// Create a new runner
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      event_name,
      event_date,
      donation_url,
      photo_url,
      total_miles = 26.2,
      mile_increment = 1,
      price_per_mile = 36,
      goal_amount
    } = body;

    // Validate required fields
    if (!name || !event_name) {
      return NextResponse.json(
        { error: 'Name and event name are required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const sql = getDb();

    // Check if slug exists and make unique if needed
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await sql`SELECT id FROM runners WHERE slug = ${slug}`;
      if (existing.length === 0) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Calculate number of sponsorship slots and goal
    const numSlots = Math.ceil(parseFloat(total_miles) / parseFloat(mile_increment));
    const calculatedGoal = goal_amount || (numSlots * parseFloat(price_per_mile));

    const result = await sql`
      INSERT INTO runners (name, event_name, event_date, donation_url, photo_url, total_miles, mile_increment, price_per_mile, goal_amount, slug)
      VALUES (${name}, ${event_name}, ${event_date || null}, ${donation_url || null}, ${photo_url || null}, ${total_miles}, ${mile_increment}, ${price_per_mile}, ${calculatedGoal}, ${slug})
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      runner: result[0],
      page_url: `/runner/${slug}`
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating runner:', error);
    return NextResponse.json({ error: 'Failed to create runner' }, { status: 500 });
  }
}

// Update a runner
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, event_name, event_date, donation_url, photo_url, total_miles, mile_increment, price_per_mile, goal_amount } = body;

    if (!id) {
      return NextResponse.json({ error: 'Runner ID is required' }, { status: 400 });
    }

    const sql = getDb();

    const result = await sql`
      UPDATE runners SET
        name = COALESCE(${name}, name),
        event_name = COALESCE(${event_name}, event_name),
        event_date = COALESCE(${event_date}, event_date),
        donation_url = COALESCE(${donation_url}, donation_url),
        photo_url = COALESCE(${photo_url}, photo_url),
        total_miles = COALESCE(${total_miles}, total_miles),
        mile_increment = COALESCE(${mile_increment}, mile_increment),
        price_per_mile = COALESCE(${price_per_mile}, price_per_mile),
        goal_amount = COALESCE(${goal_amount}, goal_amount),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Runner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, runner: result[0] });

  } catch (error) {
    console.error('Error updating runner:', error);
    return NextResponse.json({ error: 'Failed to update runner' }, { status: 500 });
  }
}

// Delete a runner
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Runner ID is required' }, { status: 400 });
    }

    const sql = getDb();
    await sql`DELETE FROM runners WHERE id = ${id}`;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting runner:', error);
    return NextResponse.json({ error: 'Failed to delete runner' }, { status: 500 });
  }
}
