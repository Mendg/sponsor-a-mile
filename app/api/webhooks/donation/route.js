import { NextResponse } from 'next/server';
import { getDb, createSponsorship } from '@/lib/db';

// Webhook endpoint for Make.com to confirm mile sponsorships
//
// Option 1: Full payload (manual/direct sponsorship)
// {
//   "runner_id": 1,
//   "mile_number": 13.1,
//   "sponsor_name": "Sarah K.",
//   "sponsor_email": "sarah@example.com",
//   "dedication": "For my kids",
//   "amount": 36.00,
//   "transaction_id": "ch_abc123"
// }
//
// Option 2: Email-based matching (from Neon Fundraise via pending selection)
// {
//   "sponsor_email": "sarah@example.com",
//   "amount": 36.00,
//   "transaction_id": "ch_abc123",
//   "runner_id": 1  // optional, helps if user has multiple pending
// }

export async function POST(request) {
  try {
    // Optional: Verify webhook secret
    const webhookSecret = request.headers.get('x-webhook-secret');
    if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const sql = getDb();

    // Check if this is email-based matching (from pending selection)
    if (body.sponsor_email && !body.mile_number) {
      // Look up pending sponsorship by email
      let pendingQuery;
      if (body.runner_id) {
        pendingQuery = await sql`
          SELECT * FROM pending_sponsorships
          WHERE sponsor_email = ${body.sponsor_email}
            AND runner_id = ${body.runner_id}
            AND expires_at > NOW()
          ORDER BY created_at DESC
          LIMIT 1
        `;
      } else {
        pendingQuery = await sql`
          SELECT * FROM pending_sponsorships
          WHERE sponsor_email = ${body.sponsor_email}
            AND expires_at > NOW()
          ORDER BY created_at DESC
          LIMIT 1
        `;
      }

      if (pendingQuery.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'No pending sponsorship found for this email',
          email: body.sponsor_email
        }, { status: 404 });
      }

      const pending = pendingQuery[0];

      // Check if mile is still available
      const existingMile = await sql`
        SELECT id FROM mile_sponsorships
        WHERE runner_id = ${pending.runner_id} AND mile_number = ${pending.mile_number}
      `;

      if (existingMile.length > 0) {
        // Mile was taken while they were paying - delete pending and return error
        await sql`DELETE FROM pending_sponsorships WHERE id = ${pending.id}`;
        return NextResponse.json({
          success: false,
          error: 'Sorry, this mile was sponsored by someone else while you were completing payment',
          mile_number: parseFloat(pending.mile_number)
        }, { status: 409 });
      }

      // Create the confirmed sponsorship
      const result = await createSponsorship({
        runner_id: pending.runner_id,
        mile_number: parseFloat(pending.mile_number),
        sponsor_name: pending.sponsor_name,
        sponsor_email: pending.sponsor_email,
        dedication: pending.dedication,
        amount: parseFloat(body.amount) || parseFloat(pending.amount),
        transaction_id: body.transaction_id || null,
        is_anonymous: pending.is_anonymous
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 409 });
      }

      // Delete the pending record
      await sql`DELETE FROM pending_sponsorships WHERE id = ${pending.id}`;

      return NextResponse.json({
        success: true,
        message: 'Mile sponsorship confirmed from pending selection',
        sponsorship: {
          id: result.sponsorship.id,
          mile_number: parseFloat(result.sponsorship.mile_number),
          sponsor_name: result.sponsorship.is_anonymous ? 'Anonymous' : result.sponsorship.sponsor_name,
          dedication: result.sponsorship.dedication,
          amount: parseFloat(result.sponsorship.amount)
        }
      }, { status: 201 });
    }

    // Full payload - direct sponsorship (original behavior)
    const requiredFields = ['runner_id', 'mile_number', 'sponsor_name', 'amount'];
    const missingFields = requiredFields.filter(field => !body[field] && body[field] !== 0);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const mileNumber = parseFloat(body.mile_number);
    if (isNaN(mileNumber) || mileNumber <= 0 || mileNumber > 100) {
      return NextResponse.json(
        { error: 'Invalid mile_number. Must be a positive number between 0 and 100.' },
        { status: 400 }
      );
    }

    const result = await createSponsorship({
      runner_id: parseInt(body.runner_id),
      mile_number: mileNumber,
      sponsor_name: body.sponsor_name,
      sponsor_email: body.sponsor_email || null,
      dedication: body.dedication || null,
      amount: parseFloat(body.amount),
      transaction_id: body.transaction_id || null,
      is_anonymous: body.is_anonymous === true
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      message: 'Mile sponsorship created successfully',
      sponsorship: {
        id: result.sponsorship.id,
        mile_number: parseFloat(result.sponsorship.mile_number),
        sponsor_name: result.sponsorship.is_anonymous ? 'Anonymous' : result.sponsorship.sponsor_name,
        dedication: result.sponsorship.dedication,
        amount: parseFloat(result.sponsorship.amount)
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'donation-webhook',
    modes: {
      'email-matching': {
        description: 'Match payment to pending mile selection by email',
        payload: {
          sponsor_email: 'string (required)',
          amount: 'number (required)',
          transaction_id: 'string (optional)',
          runner_id: 'number (optional, helps with multiple pending)'
        }
      },
      'direct': {
        description: 'Create sponsorship directly with all details',
        payload: {
          runner_id: 'number (required)',
          mile_number: 'number (required)',
          sponsor_name: 'string (required)',
          sponsor_email: 'string (optional)',
          dedication: 'string (optional)',
          amount: 'number (required)',
          transaction_id: 'string (optional)',
          is_anonymous: 'boolean (optional)'
        }
      }
    }
  });
}
