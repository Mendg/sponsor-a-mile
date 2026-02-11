import twilio from 'twilio';
import { getDb } from './db';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const BASE_URL = process.env.BASE_URL || 'https://sponsor-a-mile.vercel.app';

// Send an SMS and log it
export async function sendSMS({ to, body, runnerId, messageType }) {
  const db = getDb();

  try {
    const message = await client.messages.create({
      body,
      from: FROM_NUMBER,
      to
    });

    await db`
      INSERT INTO coaching_sms_log (runner_id, message_type, to_phone, body, twilio_sid, status)
      VALUES (${runnerId}, ${messageType}, ${to}, ${body}, ${message.sid}, 'sent')
    `;

    return { success: true, sid: message.sid };
  } catch (error) {
    console.error(`SMS send failed for ${to}:`, error.message);

    await db`
      INSERT INTO coaching_sms_log (runner_id, message_type, to_phone, body, twilio_sid, status)
      VALUES (${runnerId}, ${messageType}, ${to}, ${body}, ${null}, 'failed')
    `;

    return { success: false, error: error.message };
  }
}

// Build the daily morning SMS
export function buildDailySMS({ runner, dayNumber, streak, title, briefDescription }) {
  const link = `${BASE_URL}/day/${runner.coaching_token}?d=${dayNumber}`;

  return [
    `Day ${dayNumber} of 24 | Streak: ${streak} day${streak === 1 ? '' : 's'}`,
    '',
    `${title}: ${briefDescription}`,
    '',
    `Tap to start: ${link}`,
    '',
    'Team Friendship NYC Half'
  ].join('\n');
}

// Build evening reminder SMS
export function buildReminderSMS({ runner, streak }) {
  const firstName = runner.name.split(' ')[0];
  const link = `${BASE_URL}/dashboard/${runner.coaching_token}`;

  return [
    `Hey ${firstName}, today's action takes 2 min.`,
    `Don't break your ${streak}-day streak!`,
    link
  ].join('\n');
}

// Build donation notification SMS
export function buildDonationSMS({ donorName, amount, totalRaised }) {
  return [
    `${donorName} just donated $${amount}!`,
    `You're at $${totalRaised} total.`
  ].join('\n');
}

// Build milestone celebration SMS
export function buildMilestoneSMS({ runner, milestone, value }) {
  const firstName = runner.name.split(' ')[0];
  const link = `${BASE_URL}/dashboard/${runner.coaching_token}`;

  const messages = {
    'streak_7': `${firstName}, 7-day streak! You're on fire. Keep it going: ${link}`,
    'streak_14': `${firstName}, 14 days straight! You're a fundraising machine: ${link}`,
    'streak_21': `${firstName}, 21-day streak! Legend status incoming: ${link}`,
    'raised_500': `${firstName}, you just passed $500 raised! See your progress: ${link}`,
    'raised_1000': `${firstName}, $1,000 raised! Champion tier unlocked: ${link}`,
    'raised_1500': `${firstName}, $1,500! You're incredible. Check it out: ${link}`,
    'raised_2500': `${firstName}, $2,500+! Legend tier. The team is in awe: ${link}`,
  };

  return messages[milestone] || `${firstName}, amazing milestone! ${link}`;
}
