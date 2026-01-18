import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Save a pending sponsorship (before payment)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      runner_id,
      mile_number,
      sponsor_name,
      sponsor_email,
      dedication,
      amount,
      is_anonymous = false
    } = body;

    // Validate required fields
    if (!runner_id || !mile_number || !sponsor_email) {
      return NextResponse.json(
        { error: 'Missing required fields: runner_id, mile_number, sponsor_email' },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Check if mile is already sponsored
    const existing = await sql`
      SELECT id FROM mile_sponsorships
      WHERE runner_id = ${runner_id} AND mile_number = ${mile_number}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'This mile has already been sponsored' },
        { status: 409 }
      );
    }

    // Remove any existing pending for this email + runner (they changed their mind)
    await sql`
      DELETE FROM pending_sponsorships
      WHERE sponsor_email = ${sponsor_email} AND runner_id = ${runner_id}
    `;

    // Create pending sponsorship
    const result = await sql`
      INSERT INTO pending_sponsorships
        (runner_id, mile_number, sponsor_name, sponsor_email, dedication, amount, is_anonymous)
      VALUES
        (${runner_id}, ${mile_number}, ${sponsor_name || 'Anonymous'}, ${sponsor_email}, ${dedication || null}, ${amount}, ${is_anonymous})
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      pending: result[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating pending sponsorship:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get pending sponsorship by email (for debugging/admin)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter required' },
      { status: 400 }
    );
  }

  try {
    const sql = getDb();
    const pending = await sql`
      SELECT * FROM pending_sponsorships
      WHERE sponsor_email = ${email}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ pending });
  } catch (error) {
    console.error('Error fetching pending:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
