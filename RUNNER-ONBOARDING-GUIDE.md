B"H

# Runner Onboarding & Engagement Guide
## Sponsor-a-Mile Coaching Engine, NYC Half 2026

This is the internal playbook for getting runners into the coaching engine and keeping them engaged for all 24 days. The program runs **Feb 11 - Mar 10, 2026** (skipping Shabbat).

---

## How the System Works (30-Second Overview)

Every runner gets a unique coaching token and two links:
- **Daily page**: `/day/{token}?d={dayNumber}` - one focused action per day
- **Dashboard**: `/dashboard/{token}` - streaks, leaderboard, donations, progress

They get an **8am SMS** with the day's action and link. If they haven't completed it by **6pm**, they get a reminder. When they tap "I Did It!", they get confetti, streak updates, and milestone celebrations.

The 24 days are split into 4 phases:
1. **Foundation (Days 1-6)**: Easy wins. Text 3 friends, personalize your page, share on Instagram.
2. **Expand (Days 7-12)**: Push wider. Email coworkers, ask for matches, post training photos.
3. **Push (Days 13-18)**: Get creative. Video asks, DM social lurkers, local business asks.
4. **Close (Days 19-24)**: Final sprint. Re-target openers, power hours, the big ask.

---

## Step 1: Enrolling a Runner

### What You Need
- Runner's **full name**
- Runner's **phone number** (for SMS)
- Runner's **Neon Fundraise URL** (their personal fundraising page)

### How to Enroll

**Option A: Existing runner in the database** (they already have a sponsor-a-mile page)

```
POST /api/coaching/admin/runners
Header: x-webhook-secret: {WEBHOOK_SECRET}
Body: {
  "runner_id": 4,
  "phone": "+15551234567",
  "neon_fundraise_url": "https://fundraise.friendshipcircle.com/runner-name"
}
```

**Option B: New runner**

```
POST /api/coaching/admin/runners
Header: x-webhook-secret: {WEBHOOK_SECRET}
Body: {
  "name": "Sarah Cohen",
  "phone": "+15551234567",
  "neon_fundraise_url": "https://fundraise.friendshipcircle.com/sarah-cohen"
}
```

Both return the runner's coaching URL:
```json
{
  "success": true,
  "coaching_url": "https://sponsor-a-mile.vercel.app/dashboard/sarah-preview-abc123"
}
```

### The Welcome Experience

The **first time** a runner opens their daily page, they see a welcome overlay:
1. "Welcome, Sarah!" with an explanation: 24 days, one action per day
2. A visual journey map: 🌱 3 → 🔥 7 → 💪 14 → 👑 21 → 🏆 24
3. "Where are you with fundraising?" (Haven't started / Making progress / Already hit my goal)
4. A motivational response based on their answer

This sets the tone: this is personal, progressive, and achievable.

---

## Step 2: The First Text Message

On the runner's first coaching day, they get an SMS at 8am:

```
Day 1 of 24 | Streak: 0 days

Sponsor Your First Mile: Before asking others, put your own name
on the board. Sponsor a mile for yourself or a loved one.

Tap to start: https://sponsor-a-mile.vercel.app/day/sarah-preview-abc123?d=1

Team Friendship NYC Half
```

**This first text is the most important moment in the entire program.** If they don't open Day 1, the rest doesn't matter.

### Tips for Day 1 Success
- **Text them personally** before the first automated SMS goes out. "Hey, you're about to start getting daily coaching texts from Team Friendship. Day 1 is easy, just sponsor your own mile. Look for the text at 8am!"
- **Set expectations**: "Each day takes about 2 minutes. Just follow the prompt."
- **Create social proof**: "All the runners are doing this together. You'll see each other on the leaderboard."

---

## Step 3: What Keeps Them Coming Back

### The Streak (Most Powerful Mechanic)

The streak counter is the heartbeat of the system. Every time a runner completes a day, their streak goes up. Miss a day, it resets to zero.

**Milestones that trigger celebrations:**
- **3 days**: "You're building a habit."
- **7 days**: "One week! Most people never get here." + shareable achievement graphic
- **14 days**: "Two weeks. You're unstoppable." + shareable achievement graphic
- **21 days**: "This is who you are now." + shareable achievement graphic

**Streak Freezes**: After 7 consecutive days, runners earn a streak freeze (🧊). If they miss a day, the freeze automatically protects their streak. This rewards consistency without punishing one bad day.

### The Evening Reminder (Loss Aversion)

If a runner hasn't completed by 6pm, they get a reminder SMS tuned to their streak level:

- **0 streak**: "Today's action takes 2 min. Start building your streak!"
- **1-2 streak**: "You're building something. Don't stop now."
- **3-6 streak**: "{Name}, 5-day streak! Don't let it end today."
- **7-13 streak**: "{Name}, 10 days straight. Most people never get here."
- **14+ streak**: "{Name}, 16-day streak. That's rare. Don't stop now."

The higher the streak, the more it hurts to lose it. That's by design.

### Tiers (Fundraising Progress)

Runners level up based on total raised:
- 🏃 **Runner**: $0+
- ⭐ **Fundraiser**: $250+
- 🏆 **Champion**: $1,000+
- 👑 **Legend**: $2,500+

The dashboard shows a progress bar to the next tier. Tier badges appear on the leaderboard.

### Points System

Runners earn points for everything:
- Complete daily action: **10 points**
- Complete within 1 hour of SMS: **+2 bonus**
- Share fundraising page: **5 points**
- Thank a donor: **3 points**
- Bonus action: **5 points**
- Perfect week (all 7 days): **50 bonus**
- 7-day streak milestone: **25 points**

Points show on the dashboard header (⭐) and drive the leaderboard.

### Donation Notifications

When someone donates, the runner gets an SMS:
```
Sarah Cohen just donated $72!
You're at $350 total.
```

On their dashboard, they see a thank-you card prompting them to text or WhatsApp the donor (with a pre-written message). They can also generate a branded thank-you graphic to share.

### Team Features
- **Leaderboard**: Runners see where they rank by total raised
- **Team Quests**: Time-limited group challenges ("Team completes 20 actions this week")
- **High-Fives**: Runners can send each other encouragement

---

## Step 4: Spotting and Saving Disengaged Runners

### Admin Dashboard

```
GET /api/coaching/admin
Header: x-webhook-secret: {WEBHOOK_SECRET}
```

Returns every runner with:
- Days completed
- Last completed day
- Total raised
- Whether they completed today
- **Stalling flag**: `true` if they're 3+ days behind

### Warning Signs

| Signal | What It Means | Action |
|--------|--------------|--------|
| Missed 1 day | Normal. Streak freeze may save them. | No action needed |
| Missed 2 days | Getting shaky. | Check if they have a freeze |
| Missed 3+ days (stalling) | At risk of quitting | Send a personal nudge |
| Never opened Day 1 | Didn't onboard | Call them directly |
| Completes but raises $0 | Doing actions but not converting | Check their fundraise URL, coach on asks |
| High streak, low dollars | Engaged but timid about asking | Encourage them, Day 11 (match ask) is key |

### The Manual Nudge

For runners who are stalling, send a personal SMS:

```
POST /api/coaching/admin/nudge
Header: x-webhook-secret: {WEBHOOK_SECRET}
Body: {
  "runner_id": 4,
  "message": "Hey Sarah, I noticed you've been quiet. Everything ok? Your page is doing great, people want to support you. Tap here to jump back in: {link}"
}
```

**Key principle**: Nudges should feel like a friend checking in, not a system nagging. Use their name, reference something specific (their streak, a recent donation), and make it easy to come back.

### Recovery Playbook

**Runner missed 3-5 days:**
- Send personal nudge (above)
- Acknowledge the gap: "No judgment, life happens"
- Point them to today's action specifically
- Mention their streak freeze if they had one

**Runner missed 6+ days:**
- Call them (don't just text)
- Ask what's getting in the way
- Offer to adjust expectations: "Even doing the easy mode version counts"
- Remind them why they signed up
- If they're overwhelmed by fundraising, refocus on the daily action: "Forget the money for now. Just do today's 2-minute action."

**Runner never started:**
- This is an onboarding failure, not an engagement failure
- Call them within 48 hours of program start
- Walk them through Day 1 on the phone if needed
- Make sure their phone number is correct (SMS might not be delivering)

---

## Step 5: Phase-Specific Coaching Tips

### Foundation Phase (Days 1-6)
**Goal**: Build the habit. Get easy wins on the board.

- Day 1 (Sponsor Your First Mile) is the lowest-friction ask possible. If a runner can't do this, something is wrong with their setup.
- Day 3 (Text Your 3 Closest People) usually generates the first donations. Celebrate these loudly.
- Day 6 (Erev Shabbat Family Share) is a natural conversation starter. Remind runners that Shabbat dinner is a perfect time to mention their fundraiser.

**What to watch for**: Runners who complete days but skip the actual action (just tapping "I Did It" without doing it). The easy mode toggle is there for this, it gives a lighter version so they at least do something.

### Expand Phase (Days 7-12)
**Goal**: Push beyond the inner circle. This is where real fundraising happens.

- Day 7 (Email Coworkers) is where many runners get uncomfortable. The coaching content specifically addresses this anxiety. Check in with runners who stall here.
- Day 11 (Ask Top Donor for a Match) is the highest-leverage day in the program. A single match can double their total. Coach runners through this personally if needed.
- Day 12 is the halfway celebration. Runners who make it here almost always finish.

**What to watch for**: Drop-off between days 6 and 8. The jump from "text your friends" to "email your coworkers" feels big. Normalize it.

### Push Phase (Days 13-18)
**Goal**: Get creative. Tap new audiences.

- Day 14 (Record a Video) has the highest skip rate. The easy mode version ("post a training photo instead") catches most people.
- Day 17 (Local Business Ask) is surprisingly effective for runners who try it. Share success stories from other runners.

**What to watch for**: "Action fatigue." Runners have been doing this for two weeks. The streak and milestone mechanics are designed to carry motivation here, but a personal "you're doing amazing" text from you goes a long way.

### Close Phase (Days 19-24)
**Goal**: Final push. Urgency is your friend.

- Day 20 (Power Hour Challenge) is a group event. Coordinate timing so runners are all fundraising at the same time.
- Day 22 (The Big Ask) is the single biggest fundraising action. This is the day to make a large, direct ask to someone who can give significantly.
- Day 24 is the gratitude day. Even if their total isn't where they wanted, end on a high note.

**What to watch for**: Burnout. Some runners will be tired. That's ok. Remind them: "3 more days. You've done 21. Finish strong."

---

## Quick Reference

### Key URLs
- Daily page: `sponsor-a-mile.vercel.app/day/{token}?d={day}`
- Dashboard: `sponsor-a-mile.vercel.app/dashboard/{token}`

### Automated SMS Schedule
- **8:00am ET** (Sun-Fri): Daily action text with link
- **6:00pm ET** (Sun-Fri): Reminder for runners who haven't completed
- **On donation**: Instant notification with amount and total
- **On milestone**: Celebration text with dashboard link

### Milestones That Trigger Shareable Graphics
- streak_7, streak_14, streak_21
- raised_500, raised_1000, raised_1500, raised_2500
- halfway (Day 12)
- perfect_week

### Tier Thresholds
- Runner: $0 | Fundraiser: $250 | Champion: $1,000 | Legend: $2,500

---

## The One Thing That Matters Most

Everything in this system, the streaks, the tiers, the confetti, the leaderboard, is designed to make one thing happen: **get runners to take one small action every day.**

Not "raise money." Not "hit your goal." Just: do today's thing.

The fundraising follows. Every runner who completes all 24 days will raise meaningful money. The system handles the what and when. Your job is to make sure they show up.
