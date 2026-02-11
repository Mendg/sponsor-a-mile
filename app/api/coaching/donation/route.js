import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logActivity, checkMilestones, getTotalRaised } from '@/lib/coaching';
import { sendSMS, buildDonationSMS, buildMilestoneSMS } from '@/lib/sms';

// POST /api/coaching/donation
// Neon Fundraise webhook via Make.com
// Body: { runner_id, donor_name, donor_email, amount, transaction_id }
export async function POST(request) {
  try {
    const webhookSecret = request.headers.get('x-webhook-secret');
    if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { runner_id, donor_name, donor_email, amount, transaction_id } = await request.json();

    if (!runner_id || !amount) {
      return NextResponse.json({ error: 'Missing runner_id or amount' }, { status: 400 });
    }

    const db = getDb();

    // Check for duplicate transaction
    if (transaction_id) {
      const existing = await db`
        SELECT id FROM coaching_donations WHERE transaction_id = ${transaction_id}
      `;
      if (existing.length > 0) {
        return NextResponse.json({ success: true, message: 'Duplicate transaction, already processed' });
      }
    }

    // Record donation
    await db`
      INSERT INTO coaching_donations (runner_id, donor_name, donor_email, amount, transaction_id)
      VALUES (${runner_id}, ${donor_name || 'Anonymous'}, ${donor_email || null}, ${amount}, ${transaction_id || null})
    `;

    const totalRaised = await getTotalRaised(runner_id);

    // Log activity
    await logActivity({
      runnerId: runner_id,
      eventType: 'donation',
      title: `${donor_name || 'Anonymous'} donated`,
      detail: null,
      amount: parseFloat(amount)
    });

    // Get runner for SMS notification
    const runners = await db`SELECT * FROM runners WHERE id = ${runner_id} AND coaching_active = true`;
    if (runners.length > 0 && runners[0].phone) {
      const runner = runners[0];

      // Send donation notification SMS
      const smsBody = buildDonationSMS({
        donorName: donor_name || 'Someone',
        amount: parseFloat(amount).toFixed(0),
        totalRaised: totalRaised.toFixed(0)
      });

      await sendSMS({
        to: runner.phone,
        body: smsBody,
        runnerId: runner.id,
        messageType: 'donation'
      });

      // Check milestones
      const milestones = await checkMilestones(runner.id);
      for (const milestone of milestones) {
        await logActivity({
          runnerId: runner.id,
          eventType: 'milestone',
          title: milestone.type,
          detail: `Value: ${milestone.value}`
        });

        const milestoneSMS = buildMilestoneSMS({
          runner,
          milestone: milestone.type,
          value: milestone.value
        });

        await sendSMS({
          to: runner.phone,
          body: milestoneSMS,
          runnerId: runner.id,
          messageType: 'milestone'
        });
      }
    }

    return NextResponse.json({
      success: true,
      total_raised: totalRaised,
      runner_id
    });
  } catch (error) {
    console.error('Donation webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
