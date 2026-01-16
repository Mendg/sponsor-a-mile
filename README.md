# Sponsor a Mile

Interactive mile sponsorship widget for Team Friendship marathon fundraising. Transform donation asks into personal mile dedications.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Neon database URL

# Run database migrations
# Connect to your Neon database and run schema.sql

# Start development server
npm run dev
```

Visit `http://localhost:3000/runner/alex-nyc-half` to see the demo.

## Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
WEBHOOK_SECRET=your-optional-webhook-secret
```

## Database Setup

1. Create a [Neon](https://neon.tech) database
2. Run the SQL in `schema.sql` to create tables and seed data
3. Add your connection string to `.env.local`

## API Endpoints

### GET /api/runners/[slug]
Returns runner profile with all sponsorships and stats.

**Response:**
```json
{
  "runner": {
    "id": 1,
    "name": "Alex Runner",
    "event_name": "NYC Half Marathon",
    "event_date": "2025-03-16",
    "goal_amount": 943.20,
    "price_per_mile": 36.00,
    "total_miles": 26.2
  },
  "sponsorships": [...],
  "stats": {
    "sponsored_count": 5,
    "total_raised": 180,
    "progress_percent": 19.08
  }
}
```

### GET /api/runners/[slug]/available-miles
Returns list of unsponsored miles.

### POST /api/webhooks/donation
Webhook endpoint for Make.com to create sponsorships.

---

## Make.com Webhook Integration

### Webhook Payload Format

```json
{
  "runner_id": 1,
  "mile_number": 13.1,
  "sponsor_name": "Sarah K.",
  "sponsor_email": "sarah@example.com",
  "dedication": "For my kids - Maya and Eli",
  "amount": 36.00,
  "transaction_id": "ch_abc123",
  "is_anonymous": false
}
```

### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| runner_id | number | Yes | Database ID of the runner |
| mile_number | number | Yes | Mile to sponsor (1-26.2) |
| sponsor_name | string | Yes | Display name for sponsor |
| sponsor_email | string | No | Email for thank you/receipts |
| dedication | string | No | Personal message (max 200 chars) |
| amount | number | Yes | Donation amount |
| transaction_id | string | No | Payment processor reference |
| is_anonymous | boolean | No | Hide sponsor name (default: false) |

### Setting Up Make.com Scenario

#### Step 1: Create Webhook Trigger

1. In Make.com, create a new scenario
2. Add **Webhooks > Custom webhook** as the trigger
3. Copy the webhook URL that Make generates
4. This will receive data from your donation form

#### Step 2: Connect to Your Donation Platform

**Option A: Stripe**
1. Add **Stripe > Watch Events** module
2. Set event type to `charge.succeeded` or `payment_intent.succeeded`
3. Extract customer info and payment details

**Option B: JustGiving/Classy/Other**
1. Add the appropriate app module
2. Configure to trigger on new donations
3. Map donation fields to your data structure

#### Step 3: Map Form Fields

Your donation form should collect:
- Mile number selection
- Dedication message
- Sponsor name (or anonymous checkbox)

Map these fields from the donation platform to variables.

#### Step 4: Call Sponsor a Mile API

1. Add **HTTP > Make a request** module
2. Configure:
   - URL: `https://your-domain.com/api/webhooks/donation`
   - Method: POST
   - Headers:
     ```
     Content-Type: application/json
     x-webhook-secret: your-secret (optional)
     ```
   - Body: Map fields from previous steps

**Example Body Mapping:**
```json
{
  "runner_id": {{1.runner_id}},
  "mile_number": {{1.metadata.mile_number}},
  "sponsor_name": {{1.customer_name}},
  "sponsor_email": {{1.customer_email}},
  "dedication": {{1.metadata.dedication}},
  "amount": {{1.amount / 100}},
  "transaction_id": {{1.id}},
  "is_anonymous": {{1.metadata.is_anonymous}}
}
```

#### Step 5: Handle Errors

Add a **Router** with two paths:

**Path 1: Success (HTTP status 201)**
- Continue normal flow
- Optional: Send confirmation email

**Path 2: Error (HTTP status 409 - Mile already taken)**
- Send notification to admin
- Trigger refund workflow
- Email donor about alternative miles

### Error Handling

| Status | Meaning | Action |
|--------|---------|--------|
| 201 | Success | Sponsorship created |
| 400 | Bad request | Check required fields |
| 401 | Unauthorized | Verify webhook secret |
| 409 | Conflict | Mile already sponsored |
| 500 | Server error | Retry or alert admin |

### Testing Your Integration

1. Use Make.com's **Run once** button
2. Test with your donation form in test/sandbox mode
3. Verify sponsorship appears on the runner page
4. Check error handling with duplicate mile attempts

---

## Component Overview

### MileTracker
Main interactive widget showing all miles. Click available miles to sponsor.

```jsx
<MileTracker
  totalMiles={26.2}
  sponsorships={[...]}
  pricePerMile={36}
  onSponsorClick={(mile) => openModal(mile)}
/>
```

### Leaderboard
Dashboard showing runner info, progress, and recent dedications.

```jsx
<Leaderboard
  runner={runner}
  sponsorships={sponsorships}
  stats={stats}
/>
```

### SponsorModal
Modal for selecting a mile and adding dedication before payment.

```jsx
<SponsorModal
  isOpen={true}
  onClose={handleClose}
  totalMiles={26.2}
  sponsorships={[...]}
  pricePerMile={36}
  donationUrl="/donate/runner-slug"
/>
```

### DedicationCard
Generate shareable graphics for sponsorships.

```jsx
<DedicationCardGenerator
  mileNumber={13.1}
  sponsorName="Sarah K."
  dedication="For my kids"
  eventName="NYC Half Marathon"
/>
```

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

### Netlify

```bash
npm run build
# Deploy .next folder
```

---

## Customization

### Adjusting Price Per Mile

Update the runner record in the database:

```sql
UPDATE runners SET price_per_mile = 54.00 WHERE slug = 'runner-slug';
```

### Adding New Events

Different race distances are supported by setting `total_miles`:
- Marathon: 26.2
- Half Marathon: 13.1
- 10K: 6.2
- Custom distance: Any value

```sql
INSERT INTO runners (name, event_name, total_miles, slug)
VALUES ('Runner Name', '10K for Friendship', 6.2, 'runner-10k');
```

### Brand Colors

Edit CSS variables in `styles/globals.css`:

```css
:root {
  --fc-navy: #1b365d;
  --fc-teal: #36bbae;
}
```

---

## Support

For issues with this widget, contact Friendship Circle development team.

For Make.com integration help, refer to [Make.com documentation](https://www.make.com/en/help).
