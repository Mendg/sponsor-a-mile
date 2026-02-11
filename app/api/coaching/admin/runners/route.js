import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { normalizePhone, generateToken } from '@/lib/utils';

// POST /api/coaching/admin/runners
// Enroll a runner in coaching
// Body: { runner_id?, name?, phone, neon_fundraise_url? }
export async function POST(request) {
  try {
    const webhookSecret = request.headers.get('x-webhook-secret');
    if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { runner_id, name, phone, neon_fundraise_url } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    const db = getDb();
    const token = generateToken();

    if (runner_id) {
      // Update existing runner
      const result = await db`
        UPDATE runners SET
          phone = ${normalizedPhone},
          coaching_token = ${token},
          coaching_active = true,
          neon_fundraise_url = ${neon_fundraise_url || null},
          updated_at = NOW()
        WHERE id = ${runner_id}
        RETURNING *
      `;

      if (result.length === 0) {
        return NextResponse.json({ error: 'Runner not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        runner: result[0],
        coaching_url: `${process.env.BASE_URL}/dashboard/${token}`
      });
    }

    // Create new runner
    if (!name) {
      return NextResponse.json({ error: 'Name is required for new runners' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const result = await db`
      INSERT INTO runners (name, slug, phone, coaching_token, coaching_active, neon_fundraise_url, event_name, event_date, total_miles, mile_increment)
      VALUES (${name}, ${slug + '-' + Date.now().toString(36)}, ${normalizedPhone}, ${token}, true, ${neon_fundraise_url || null}, 'NYC Half Marathon', '2026-03-15', 13.1, 1)
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      runner: result[0],
      coaching_url: `${process.env.BASE_URL}/dashboard/${token}`
    }, { status: 201 });
  } catch (error) {
    console.error('Enroll runner error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
