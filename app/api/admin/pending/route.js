import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Get all pending sponsorships
export async function GET() {
  try {
    const sql = getDb();
    const pending = await sql`
      SELECT
        ps.*,
        r.name as runner_name,
        r.slug as runner_slug
      FROM pending_sponsorships ps
      LEFT JOIN runners r ON ps.runner_id = r.id
      WHERE ps.expires_at > NOW()
      ORDER BY ps.created_at DESC
    `;

    return NextResponse.json({ pending });
  } catch (error) {
    console.error('Error fetching pending:', error);
    return NextResponse.json({ error: 'Failed to fetch pending sponsorships' }, { status: 500 });
  }
}

// Confirm a pending sponsorship (move to mile_sponsorships)
export async function POST(request) {
  try {
    const { pending_id } = await request.json();

    if (!pending_id) {
      return NextResponse.json({ error: 'Pending ID is required' }, { status: 400 });
    }

    const sql = getDb();

    // Get the pending sponsorship
    const pending = await sql`
      SELECT * FROM pending_sponsorships WHERE id = ${pending_id}
    `;

    if (pending.length === 0) {
      return NextResponse.json({ error: 'Pending sponsorship not found' }, { status: 404 });
    }

    const p = pending[0];

    // Check if mile is already sponsored
    const existing = await sql`
      SELECT id FROM mile_sponsorships
      WHERE runner_id = ${p.runner_id} AND mile_number = ${p.mile_number}
    `;

    if (existing.length > 0) {
      // Delete the pending since mile is taken
      await sql`DELETE FROM pending_sponsorships WHERE id = ${pending_id}`;
      return NextResponse.json({ error: 'This mile has already been sponsored' }, { status: 409 });
    }

    // Create the confirmed sponsorship
    await sql`
      INSERT INTO mile_sponsorships (runner_id, mile_number, sponsor_name, sponsor_email, dedication, amount, is_anonymous)
      VALUES (${p.runner_id}, ${p.mile_number}, ${p.sponsor_name}, ${p.sponsor_email}, ${p.dedication}, ${p.amount}, ${p.is_anonymous})
    `;

    // Delete the pending sponsorship
    await sql`DELETE FROM pending_sponsorships WHERE id = ${pending_id}`;

    return NextResponse.json({
      success: true,
      message: `Mile ${p.mile_number} confirmed for ${p.sponsor_name}`
    });

  } catch (error) {
    console.error('Error confirming sponsorship:', error);
    return NextResponse.json({ error: 'Failed to confirm sponsorship' }, { status: 500 });
  }
}

// Delete a pending sponsorship
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Pending ID is required' }, { status: 400 });
    }

    const sql = getDb();
    await sql`DELETE FROM pending_sponsorships WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pending:', error);
    return NextResponse.json({ error: 'Failed to delete pending sponsorship' }, { status: 500 });
  }
}
