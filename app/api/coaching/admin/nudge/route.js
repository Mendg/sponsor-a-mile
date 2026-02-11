import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendSMS } from '@/lib/sms';

// POST /api/coaching/admin/nudge
// Send a manual SMS nudge to a runner
// Body: { runner_id, message }
export async function POST(request) {
  try {
    const webhookSecret = request.headers.get('x-webhook-secret');
    if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { runner_id, message } = await request.json();

    if (!runner_id || !message) {
      return NextResponse.json({ error: 'Missing runner_id or message' }, { status: 400 });
    }

    const db = getDb();
    const runners = await db`
      SELECT * FROM runners WHERE id = ${runner_id} AND phone IS NOT NULL
    `;

    if (runners.length === 0) {
      return NextResponse.json({ error: 'Runner not found or no phone number' }, { status: 404 });
    }

    const runner = runners[0];
    const result = await sendSMS({
      to: runner.phone,
      body: message,
      runnerId: runner.id,
      messageType: 'nudge'
    });

    return NextResponse.json({
      success: result.success,
      runner: runner.name,
      error: result.error || null
    });
  } catch (error) {
    console.error('Nudge error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
