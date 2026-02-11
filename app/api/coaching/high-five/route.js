import { NextResponse } from 'next/server';
import { getRunnerByToken, sendHighFive } from '@/lib/coaching';
import { sendSMS } from '@/lib/sms';
import { getDb } from '@/lib/db';

// POST /api/coaching/high-five
// Send a high-five to another runner
// Body: { token, recipient_id }
export async function POST(request) {
  try {
    const { token, recipient_id } = await request.json();

    if (!token || !recipient_id) {
      return NextResponse.json({ error: 'Missing token or recipient_id' }, { status: 400 });
    }

    const sender = await getRunnerByToken(token);
    if (!sender) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Can't high-five yourself
    if (sender.id === recipient_id) {
      return NextResponse.json({ error: 'Cannot high-five yourself' }, { status: 400 });
    }

    // Send high-five
    const result = await sendHighFive({
      senderId: sender.id,
      recipientId: recipient_id
    });

    if (!result.success) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }

    // Get recipient info and send SMS notification
    const db = getDb();
    const recipient = await db`SELECT name, phone FROM runners WHERE id = ${recipient_id}`;

    if (recipient.length > 0 && recipient[0].phone) {
      await sendSMS({
        to: recipient[0].phone,
        body: `🙌 ${sender.name} just sent you a high-five! Keep up the great work!`,
        runnerId: recipient_id,
        messageType: 'high_five'
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('High-five error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
