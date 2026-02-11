export const metadata = {
  title: 'SMS Consent - Team Friendship Coaching',
  description: 'SMS messaging terms and consent for Team Friendship fundraising coaching program',
};

export default function SMSConsentPage() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 16px', fontFamily: 'Montserrat, sans-serif', color: '#1b365d', lineHeight: 1.7 }}>
      <div style={{ fontSize: '0.75rem', opacity: 0.5, textAlign: 'right' }}>B"H</div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Team Friendship SMS Coaching</h1>
      <h2 style={{ fontSize: '1rem', fontWeight: 400, color: '#6b7280', marginBottom: '32px' }}>SMS Messaging Terms & Consent</h2>

      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Program Description</h3>
        <p>Team Friendship operates a 24-day SMS-based fundraising coaching program for participants of Team Friendship endurance events (half marathons, marathons, cycling, and hiking events). The program sends daily coaching messages with fundraising tips, action items, and progress updates to help participants reach their fundraising goals.</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>How You Opt In</h3>
        <p>Participants opt in to SMS coaching when they are enrolled by a Team Friendship administrator after registering for an event. Enrollment requires the participant to provide their phone number and verbally or in writing consent to receive coaching messages. Participants may also be enrolled via the Team Friendship admin portal at sponsor-a-mile.vercel.app/admin/coaching.</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Message Frequency</h3>
        <p>You will receive up to 3 messages per day:</p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li>1 daily coaching message (morning)</li>
          <li>1 optional reminder (evening, only if you haven't completed the day's action)</li>
          <li>Occasional donation notification messages (when someone donates to your fundraiser)</li>
        </ul>
        <p style={{ marginTop: '8px' }}>Messages are sent Sunday through Friday. No messages are sent on Saturdays (Shabbat). The program runs for approximately 4 weeks leading up to your event date.</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Message & Data Rates</h3>
        <p>Message and data rates may apply. Check with your mobile carrier for details about your messaging plan.</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>How to Opt Out</h3>
        <p>You can opt out at any time by replying <strong>STOP</strong> to any message. You will receive a confirmation message and no further messages will be sent. You can also contact us at info@friendshipcircle.com to be removed from the program.</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Help</h3>
        <p>Reply <strong>HELP</strong> to any message for assistance, or contact us at info@friendshipcircle.com.</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Privacy</h3>
        <p>Your phone number and personal information will not be shared with third parties for marketing purposes. Data is used solely for the Team Friendship coaching program. For more information, visit <a href="https://www.friendshipcircle.com/privacy-policy" style={{ color: '#36bbae' }}>friendshipcircle.com/privacy-policy</a>.</p>
      </section>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginTop: '32px', fontSize: '0.85rem', color: '#6b7280' }}>
        <p>Friendship Circle International<br />
        info@friendshipcircle.com<br />
        <a href="https://www.friendshipcircle.com" style={{ color: '#36bbae' }}>www.friendshipcircle.com</a></p>
      </div>
    </div>
  );
}
