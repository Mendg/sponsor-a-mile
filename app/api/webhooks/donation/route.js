import { NextResponse } from 'next/server';
import { createSponsorship } from '@/lib/db';

// Webhook endpoint for Make.com to create mile sponsorships
// Expected payload:
// {
//   "runner_id": 1,
//   "mile_number": 13.1,
//   "sponsor_name": "Sarah K.",
//   "sponsor_email": "sarah@example.com",
//   "dedication": "For my kids - Maya and Eli",
//   "amount": 36.00,
//   "transaction_id": "ch_abc123",
//   "is_anonymous": false
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

    // Validate required fields
    const requiredFields = ['runner_id', 'mile_number', 'sponsor_name', 'amount'];
    const missingFields = requiredFields.filter(field => !body[field] && body[field] !== 0);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate mile_number is a positive number
    const mileNumber = parseFloat(body.mile_number);
    if (isNaN(mileNumber) || mileNumber <= 0 || mileNumber > 100) {
      return NextResponse.json(
        { error: 'Invalid mile_number. Must be a positive number between 0 and 100.' },
        { status: 400 }
      );
    }

    // Create the sponsorship
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
      return NextResponse.json(
        { error: result.error },
        { status: 409 } // Conflict - mile already taken
      );
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

// Health check for the webhook endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'donation-webhook',
    expected_payload: {
      runner_id: 'number (required)',
      mile_number: 'number (required)',
      sponsor_name: 'string (required)',
      sponsor_email: 'string (optional)',
      dedication: 'string (optional)',
      amount: 'number (required)',
      transaction_id: 'string (optional)',
      is_anonymous: 'boolean (optional, default: false)'
    }
  });
}
