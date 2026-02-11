-- Coaching Days Content Seed
-- 24 action days from Feb 15 - Mar 14 (skipping Saturdays)
-- Calendar: Feb 15(Sun), 16(Mon), 17(Tue), 18(Wed), 19(Thu), 20(Fri), [21 Shabbat],
--   22(Sun), 23(Mon), 24(Tue), 25(Wed), 26(Thu), 27(Fri), [28 Shabbat],
--   Mar 1(Sun), 2(Mon), 3(Tue), 4(Wed), 5(Thu), 6(Fri), [7 Shabbat],
--   8(Sun), 9(Mon), 10(Tue), 11(Wed), 12(Thu), 13(Fri), [14 Shabbat = race eve]

-- PHASE 1: FOUNDATION (Days 1-6) - Close circle, easy wins

INSERT INTO coaching_days (day_number, calendar_date, title, sms_text, lesson, action_prompt, templates, easy_mode_prompt, easy_mode_templates, phase) VALUES

(1, '2026-02-15', 'Sponsor Your First Mile', 'Make your first donation and lead by example',
'Here''s the truth about fundraising: nobody wants to be the first donor. That''s why YOU go first.

When you make your own donation, two things happen. First, you prove to yourself that you believe in what you''re doing. Second, every person who visits your page sees that someone already gave. That changes everything.

The psychology is simple. When a page shows $0 raised, people hesitate. When it shows $36 raised with a real name, they think "someone believes in this person." That''s all you need.

$36 sponsors one mile. That''s the price of lunch. And it makes every ask you send for the next 24 days feel genuine, because you put your own money where your mouth is.',

'Go to your fundraising page and make a $36 donation to yourself. This sponsors your first mile and shows future donors that you believe in your own cause.',

NULL,

'Donate any amount you''re comfortable with to your own page. Even $18 counts.',
NULL,
'foundation'),

(2, '2026-02-16', 'Make Your Page Personal', 'Write 3 sentences that make people care',
'Your fundraising page is doing a job while you sleep. Every time someone clicks your link, they spend about 8 seconds deciding whether to keep reading or leave. That''s it. 8 seconds.

Generic pages get generic results. "I''m running a marathon to raise money for charity" tells people nothing. But "I''m running 13.1 miles because my neighbor''s son Jacob lights up every time his teen buddy walks through the door" tells a story.

You need three sentences. First: why you''re running (personal connection). Second: who benefits (specific, real). Third: what you''re asking (clear number). That''s it. Don''t overthink it.',

'Update your fundraising page with a personal message. Use this template and fill in the details that are true for you:',

'I''m running the NYC Half Marathon with Team Friendship because [your personal reason, e.g., "my cousin has special needs and I''ve seen how Friendship Circle changed her life"].

Every dollar I raise supports programs that pair teen volunteers with children and adults with special needs, creating real friendships that change both their lives. [Add a specific detail about what you''ve seen or experienced.]

My goal is to raise $[amount]. Will you sponsor a mile for $36?',

'Update your page with one sentence about why you''re running.',
'I''m running the NYC Half Marathon with Team Friendship because [your personal reason]. My goal is to raise $[amount]. Will you help?',
'foundation'),

(3, '2026-02-17', 'Text Your 3 Closest People', 'Send a personal text to 3 people who love you',
'Fundraising isn''t about reaching thousands. It''s about reaching the right people, one at a time. Your first 3 asks should go to the people who would do anything for you. Your mom, your best friend, your sibling, your spouse.

Why text? Because it''s personal. An email feels like a mass blast. A text feels like a conversation. And these 3 people don''t need a pitch. They just need to know you care about this.

The biggest mistake is waiting for the "right time" to ask. There is no right time. Right now, while you have momentum from the last two days, is the time. Send 3 texts. It takes 90 seconds.',

'Open your phone. Send the template below to 3 people who are closest to you. Personalize each one.',

'Hey [name]! I signed up for something pretty cool. I''m running the NYC Half Marathon in March with Team Friendship, raising money for kids and teens with special needs.

Would you be willing to sponsor a mile for $36? It would mean a lot to me. Here''s my page: [your fundraising URL]',

'Send a text to 1 person who you know will say yes.',
'Hey [name], I''m running the NYC Half Marathon for Friendship Circle. Would you sponsor a mile? [URL]',
'foundation'),

(4, '2026-02-18', 'Share on Instagram Stories', 'Post a story that gets people asking questions',
'Social media isn''t where most donations come from. But it does something critical: it plants a seed. When people see you training and fundraising, they start thinking about you differently. Then when you text them a link, they already know what it''s about.

Instagram Stories work best because they''re casual, they disappear, and they create FOMO. Don''t write a novel. Post a photo of your running shoes, the course map, or you at the gym. Keep the text short.

The key phrase: "DM me if you want to know more." That''s it. Make people come to you. The people who DM are 10x more likely to donate than people who scroll past a link.',

'Post an Instagram Story about your training and fundraising. Use the template below as your caption, and add your fundraising link sticker.',

'Training for the NYC Half Marathon with Team Friendship 🏃

Every mile I run, I''m raising money for kids and teens with special needs through Friendship Circle.

DM me if you want to sponsor a mile. Or swipe up to check out my page!',

'Post a selfie or training photo with the text "Running for a cause" and your link.',
NULL,
'foundation'),

(5, '2026-02-19', 'Email Your Family', 'Send a heartfelt email to your extended family',
'Family is your secret weapon. Aunts, uncles, grandparents, cousins. These are people who care about you and are often looking for meaningful ways to support you. Most of them check email regularly.

The subject line matters more than anything. "Running a marathon!" gets opened. "Donation request" does not. Lead with excitement, not the ask.

One email to your family list can move the needle more than a week of social media posts. Because family gives. They give because they love you, and because they want to be part of something you care about. Don''t overthink it. Send it tonight.',

'Send an email to your extended family. Use BCC so it feels personal. Copy the template below and customize the opening.',

'Subject: I''m doing something a little crazy (in the best way)

Hi everyone,

I wanted to share some exciting news. In March, I''m running the NYC Half Marathon with Team Friendship, raising money for Friendship Circle, an incredible organization that creates friendships between teen volunteers and individuals with special needs.

I signed up because [your personal reason]. The experience so far has been amazing, and I''m training hard!

I have a fundraising goal of $[amount], and I''d love your support. You can sponsor a mile for $36 on my page:

[Your fundraising URL]

Any amount helps, and it means the world to me knowing my family is behind me on this.

Love,
[Your name]',

'Forward the template to just your parents or siblings.',
NULL,
'foundation'),

(6, '2026-02-20', 'Erev Shabbat Family Share', 'Share in your family WhatsApp group before Shabbat',
'It''s Friday. Family WhatsApp groups come alive on Erev Shabbat. People are winding down, checking messages, feeling connected. This is a golden moment.

Sharing in a group is different from a direct message. It creates social proof. When your cousin sees your aunt respond "amazing, kein ayin hara!" others notice. They might not donate right then, but they''ll remember when you follow up.

Keep it warm and brief. This isn''t a pitch. It''s sharing something you''re proud of with the people who matter most. End with "Good Shabbos" and let the message do its work over the weekend.',

'Post a message in your family WhatsApp group. Keep it warm and short.',

'Hi family! Quick update before Shabbos. I''m training for the NYC Half Marathon with Team Friendship, raising money for Friendship Circle. It''s been an amazing experience so far.

If anyone wants to sponsor a mile ($36), here''s my page: [URL]

Good Shabbos! 🕯️',

'Send a quick Shabbat update to one family group chat.',
'Good Shabbos everyone! Quick update: I''m running the NYC Half for Team Friendship. Would love your support: [URL] 🕯️',
'foundation');

-- PHASE 2: EXPAND (Days 7-12) - Wider circles

INSERT INTO coaching_days (day_number, calendar_date, title, sms_text, lesson, action_prompt, templates, easy_mode_prompt, easy_mode_templates, phase) VALUES

(7, '2026-02-22', 'Email Your Coworkers', 'Tap into your work network with a friendly ask',
'Your coworkers see you every day. They know you''re a real person doing a real thing. That gives you an advantage over any random GoFundMe page.

Most people never ask at work because it feels awkward. But here''s what actually happens: people are impressed. They respect that you''re pushing yourself physically AND raising money for others. Many will give $36 without thinking twice.

The trick is to keep it casual. Don''t send an all-company blast (unless your boss offers). Send it to people you actually talk to. The subject line should make them curious, not defensive.',

'Send an email to 5-10 coworkers you have a good relationship with. BCC is fine.',

'Subject: Something I''m doing outside of work

Hi [name/team],

Wanted to share something I''m pretty excited about. I''m running the NYC Half Marathon in March with Team Friendship. Beyond the running, I''m raising money for Friendship Circle, which creates friendships between teen volunteers and people with special needs.

If you''d like to support, you can sponsor a mile for $36 here: [URL]

No pressure at all. Just wanted to share because it''s been a meaningful experience!

Best,
[Your name]',

'Send to just 2-3 close work friends.',
NULL,
'expand'),

(8, '2026-02-23', 'Voice Note Thank-Yous', 'Record a personal thank-you for every donor so far',
'This is the most underrated move in fundraising. When someone donates, they expect a generic receipt. What they don''t expect is a voice note from you, personally thanking them.

A 15-second voice note takes almost no effort. But the impact is huge. The donor feels seen. They feel like their $36 actually mattered. And here''s the magic: grateful donors give again. They forward your page. They tell friends about you.

Go through your donor list right now. For each person, record a quick voice note. "Hey Sarah, I just saw your donation come through. Thank you so much, it really means a lot. I''m going to crush this race thinking about your support." That''s it. 15 seconds. Do it for every single donor.',

'Open your donor list. Send a personal voice note (WhatsApp or iMessage) to every donor so far. No template needed. Just be genuine and say thank you.',

NULL,

'Send a text thank-you to each donor if voice notes feel awkward.',
'Hey [name], just wanted to say thank you so much for your donation. It really means a lot to me!',
'expand'),

(9, '2026-02-24', 'Text 5 More Friends', 'Expand your circle with 5 personal texts',
'You already asked your 3 closest people. Now it''s time to go one circle wider. Think about friends you see regularly, people from your community, old college friends, gym buddies.

These people care about you, but they need a slightly different approach than your mom. With close friends, you didn''t need to explain much. With this group, give a tiny bit more context about why.

The key: make it personal. Use their name. Reference something shared. "Hey Mike, remember when we talked about doing something meaningful this year? Well, I signed up for..."',

'Pick 5 friends and send each a personalized text. Don''t copy-paste the exact same thing. Mention something specific to each person.',

'Hey [name]! Hope you''re doing well. I wanted to reach out because I''m doing something that matters to me. I''m running the NYC Half Marathon with Team Friendship, raising money for Friendship Circle.

Would you consider sponsoring a mile for $36? Every bit helps me hit my goal. Here''s my page: [URL]

Thanks for even reading this!',

'Send to 2-3 friends instead of 5.',
NULL,
'expand'),

(10, '2026-02-25', 'Training Photo + Link', 'Share a training moment with your fundraising link',
'People connect with effort. When they see you sweating on a training run, something clicks. They think "this person is putting in real work, I want to be part of their journey."

Today''s action is simple: take a photo during or after a training run (or workout), and post it to your social media with your fundraising link. Not a polished studio shot. A real, slightly messy, mid-effort photo.

The caption should be short and honest. Share how training is going. What''s hard. What keeps you going. Then drop the link naturally. This isn''t a sales pitch. It''s an invitation into your journey.',

'Take a photo during or after a workout today. Post it on your social media (Instagram, Facebook, or wherever your network is) with the caption below. Customize it to be real.',

'Mile [X] done. Training for the NYC Half is no joke, but knowing I''m doing this for Friendship Circle keeps me going.

If you want to be part of this journey, you can sponsor a mile on my page: [URL]

26 miles. 26 chances to change a life. 💪',

'Post a simple training selfie with "Training for a cause" and your link.',
NULL,
'expand'),

(11, '2026-02-26', 'Ask Your Top Donor for a Match', 'Turn one donor into a multiplier',
'Matching challenges are fundraising dynamite. Here''s why: they create urgency and they make every donor feel like their gift doubled.

Your top donor already believes in you. They gave the most because they care the most. So ask them: "Would you match the next $200 in donations?" If they say yes, you now have a story to tell everyone else: "My friend is matching every donation up to $200. Your $36 becomes $72!"

Don''t overcomplicate it. A simple text to your biggest supporter can unlock a wave of new donations.',

'Text or call your largest donor so far. Ask them if they''d be willing to match donations up to a certain amount.',

'Hey [name], your donation was so generous and I''m so grateful. I have a favor to ask.

Would you be open to matching donations for the next 24 hours? Even matching up to $200 would be incredible. I''d announce it to my network and it could really drive donations.

No pressure at all. And thank you again for believing in me.',

'Ask any donor if they''d share your page with their friends.',
'Hey [name], thanks again for your donation! Would you mind sharing my fundraising page with a few friends? [URL]',
'expand'),

(12, '2026-02-27', 'Erev Shabbat Story Share', 'Share a Friendship Circle story before Shabbat',
'It''s Friday again. This week, share something different. Not your fundraising page, but a story about why Friendship Circle matters.

Stories move people in ways that statistics never will. "1 in 5 children has a disability" is a fact. But "When Jacob''s teen buddy showed up at his bar mitzvah, Jacob cried happy tears for the first time in months" is a moment that changes hearts.

Find a story on the Friendship Circle website, or better yet, share something you''ve witnessed. Then gently close with your link.',

'Share a Friendship Circle story in a social media post or group chat. Focus on the human moment, not the ask.',

'Something I''ve been thinking about as I train for this race...

Friendship Circle pairs teen volunteers with kids who have special needs. Not as tutors or helpers, but as friends. Real friends. The kind who show up, who remember your birthday, who make you feel like you belong.

[Share a specific story or moment you know about]

That''s why I run. That''s why I fundraise. If this moves you too, here''s my page: [URL]

Good Shabbos 🕯️',

'Share a link to a Friendship Circle video or story with one comment of your own.',
NULL,
'expand');

-- PHASE 3: PUSH (Days 13-18) - Creative + competitive

INSERT INTO coaching_days (day_number, calendar_date, title, sms_text, lesson, action_prompt, templates, easy_mode_prompt, easy_mode_templates, phase) VALUES

(13, '2026-03-01', 'Competitive Nudge', 'Check the leaderboard and make a power move',
'Two weeks in. Time for some friendly competition.

Check the team leaderboard on your dashboard. Where do you rank? If you''re in the top 3, you have a target on your back, and that''s great. If you''re in the middle or bottom, you have something to prove.

Competition isn''t about ego. It''s about motivation. When you see someone ahead of you, it sparks something. "If they can raise $800, I can too." Use that energy today.

Your power move: reach out to 3 people who haven''t donated yet and tell them where you stand. "I''m ranked #7 out of 20 runners and trying to move up. Your $36 gets me closer."',

'Check your rank on the leaderboard. Then text 3 people who haven''t donated yet, telling them where you stand and asking for help moving up.',

'Hey [name]! Quick update on my fundraising for the NYC Half Marathon. I''m currently ranked #[X] out of [Y] runners on my team, and I''m trying to move up!

Would you consider sponsoring a mile for $36? It would literally help me climb the leaderboard. Here''s my page: [URL]',

'Check the leaderboard and text 1 person.',
NULL,
'push'),

(14, '2026-03-02', 'Record a 30-Second Video', 'A short video ask is 3x more effective than text',
'Video is the most powerful fundraising tool you have. A 30-second video where people see your face, hear your voice, and feel your energy converts at 3x the rate of text alone.

It doesn''t need to be polished. Film it on your phone. Look at the camera. Smile. Talk like you''re talking to a friend. That''s it.

Script it loosely: "Hey, it''s [name]. I''m two weeks into training for the NYC Half Marathon with Team Friendship. I''m raising money for Friendship Circle, which creates friendships for kids with special needs. I''d love your support. There''s a link in my bio / I''ll send you the link. Thank you!"',

'Record a 30-second selfie video and post it to your Instagram Stories, send it to friends via WhatsApp, or text it directly to 5 people.',

'[Video script]

"Hey! It''s [your name]. I''m running the NYC Half Marathon in two weeks with Team Friendship. I''m raising money for Friendship Circle, an amazing organization that creates real friendships for people with special needs.

I''d love your support. Even $36 sponsors a mile and makes a huge difference. I''ll drop the link. Thank you!"',

'Record a quick voice note instead and send it to 3 friends.',
NULL,
'push'),

(15, '2026-03-03', 'DM Your Social Lurkers', 'Message people who liked posts but didn''t donate',
'There are people who liked your Instagram story, hearted your Facebook post, or left a fire emoji on your training photo. They engaged. They care. But they didn''t donate.

Why? Because there''s a gap between "I like this" and "I''ll pull out my credit card." Your job today is to bridge that gap with a direct, personal message.

Go through your recent post engagement. Find 5-10 people who reacted but didn''t donate. Send them a DM. Not a public comment. A private, personal message. "Hey, I saw you liked my post about the half marathon. Would you consider sponsoring a mile?"',

'Go through your recent social media posts. Find people who liked/reacted but haven''t donated. DM 5 of them.',

'Hey [name]! I noticed you liked my post about the NYC Half Marathon. Thanks for the support!

Would you be open to sponsoring a mile for $36? It goes to Friendship Circle and would mean a lot. Here''s the link: [URL]',

'DM 2-3 people who engaged with your posts.',
NULL,
'push'),

(16, '2026-03-04', 'Community Sponsorship Ask', 'Ask your shul, school, or community org',
'Communities have budgets for exactly this kind of thing. Your shul, school, workplace social committee, or community organization may have a discretionary fund or a culture of supporting members'' causes.

This isn''t about begging. It''s about giving your community an opportunity to be part of something meaningful. Many organizations WANT to support their members but nobody ever asks.

The approach is different from personal asks. Be slightly more formal. Explain the organization. Mention the tax deductibility. And ask for a specific amount.',

'Reach out to one community organization (shul, school, workplace giving committee) and ask for a sponsorship.',

'Subject: Sponsorship request for Team Friendship Half Marathon

Dear [Rabbi/Director/Committee Chair],

I''m reaching out because I''m running the NYC Half Marathon on March 15 with Team Friendship, raising funds for Friendship Circle, a nonprofit that creates friendships between teen volunteers and individuals with special needs.

I''m writing to ask if [organization name] would consider a sponsorship of $180 (5 miles) or $360 (10 miles) to support this cause. All donations are tax-deductible.

I''d be happy to share more about Friendship Circle''s incredible work and what this means to our community.

Thank you for considering this,
[Your name]',

'Ask one community leader to share your page with their network.',
NULL,
'push'),

(17, '2026-03-05', 'Local Business Ask', 'Approach a business you frequent for a sponsorship',
'Local businesses get asked to donate all the time. Most requests go nowhere because they''re generic. But you have an advantage: you''re a customer. You have a relationship.

Think about the coffee shop you go to every morning, your gym, your barber, your dentist. These people know your face. They''re more likely to say yes than a random business.

Walk in (or call). Be brief. Be specific. "Hi, I''m [name]. I come here all the time and I wanted to tell you about something I''m doing..." Most will give $36-100 without hesitation.',

'Visit or call one local business you frequent and ask for a sponsorship. Use the script below.',

'Hi [business owner/manager name], I''m [your name]. I come in here [regularly/every week/etc.] and I wanted to share something I''m doing.

I''m running the NYC Half Marathon with Team Friendship, raising money for Friendship Circle, which pairs teen volunteers with kids who have special needs. It''s an amazing cause.

Would [business name] be interested in sponsoring a mile? It''s $36 per mile, or you could sponsor 5 miles for $180. I''d be happy to give you a shoutout on my social media too!

Here''s the link if you''d like to check it out: [URL]',

'Text or email a business owner you know personally.',
NULL,
'push'),

(18, '2026-03-06', 'Erev Shabbat Countdown Post', 'Two-week countdown social post with your link',
'The race is two weeks from Sunday. That''s real. That''s tangible. And urgency drives action like nothing else.

Today''s Friday post isn''t just a Shabbat share. It''s a countdown. "2 weeks until race day. Here''s where I am. Here''s what I still need." Concrete numbers create a sense of mission.

People procrastinate on donations just like everything else. A countdown gives them a reason to do it NOW instead of "later" (which usually means never).',

'Post a countdown update to social media or send to your contacts. Share your progress and what you still need.',

'2 weeks until I run the NYC Half Marathon for Team Friendship. 🏃

Here''s where I stand:
- Miles sponsored: [X] of 13
- Amount raised: $[amount] of $[goal]
- Days trained: [training detail]

I''m [almost there / need a push / just getting started] and would love your help getting to my goal before race day.

Sponsor a mile ($36): [URL]

Good Shabbos! 🕯️',

'Send a quick countdown text to 2-3 people.',
'Hey [name], 2 weeks until my half marathon! I''m at $[amount] of my $[goal] goal. Any chance you could sponsor a mile? [URL]',
'push');

-- PHASE 4: CLOSE (Days 19-24) - Urgency + final push

INSERT INTO coaching_days (day_number, calendar_date, title, sms_text, lesson, action_prompt, templates, easy_mode_prompt, easy_mode_templates, phase) VALUES

(19, '2026-03-08', 'Re-Target Email Openers', 'Follow up with people who opened but didn''t give',
'You sent emails. Some people opened them. Some clicked. But they didn''t donate. That doesn''t mean no. It means "not yet."

These warm leads are your best shot this week. They already showed interest. They just need one more nudge. A personal follow-up that says "I saw you checked out my page" (without being creepy) can tip them over.

The follow-up email should be shorter than the original. No re-explaining. Just: "Hey, following up on my fundraising email. Race is next Sunday. Any amount helps. Here''s the link again."',

'Send a short follow-up email to anyone who received your earlier emails but hasn''t donated yet. Keep it brief and friendly.',

'Subject: Quick follow-up - race is next Sunday!

Hi [name],

Just following up on my earlier email about the NYC Half Marathon. Race day is March 15 and I''m in the final push to reach my fundraising goal.

I''m currently at $[amount] and hoping to hit $[goal]. Would you be able to help with any amount?

[Your fundraising URL]

Thank you!
[Your name]',

'Text 3 people who you emailed before but who haven''t responded.',
'Hey [name], just following up on my fundraising email. Race is next Sunday! Any amount helps: [URL]',
'close'),

(20, '2026-03-09', 'Power Hour Challenge', 'Set a timer and go all out for 60 minutes',
'Power Hour is simple. Set a timer for 60 minutes and do nothing but fundraise. Text, call, DM, email. Rapid fire.

The rules: No checking Instagram. No taking breaks. No "I''ll do it in a minute." Pure, focused outreach for one hour.

Why does this work? Because fundraising is a volume game. Most people need multiple touches before they donate. And in one Power Hour, you can reach 20-30 people. Even if only 5 give, that''s $180 in an hour.

Bonus: share on the team chat that you''re doing a Power Hour. Challenge others to join. Watch the leaderboard move.',

'Set a timer for 60 minutes. During that time, reach out to as many people as possible through text, WhatsApp, and DM. Use every template you''ve saved from the past 19 days.',

'[No single template - use all previous templates rapid fire]

Quick reference for Power Hour:
1. Text friends who haven''t given: "Hey [name], race is Sunday! Can you sponsor a mile for $36? [URL]"
2. DM social media contacts: "Hey! Running the half marathon this Sunday. Any support means the world. [URL]"
3. Forward original email to new contacts
4. Post stories: "Power Hour! Trying to raise $X in the next hour. Who''s in?"',

'Do a 30-minute version instead of 60 minutes.',
NULL,
'close'),

(21, '2026-03-10', 'Public Thank-You Post', 'Thank every donor publicly and inspire more to give',
'Public gratitude is the secret weapon most fundraisers never use. When you thank donors by name (with their permission), three things happen.

First, the donors feel amazing. They didn''t just give money into a void. They got recognized.

Second, non-donors see the list and think "everyone is giving, maybe I should too." Social proof in action.

Third, it''s a natural, non-pushy way to remind everyone that you''re still fundraising.',

'Post a public thank-you on social media tagging or mentioning every donor. Add your link at the bottom for anyone who wants to join the list.',

'I want to take a moment to thank every person who has supported my NYC Half Marathon fundraising so far. You are all amazing. 🙏

[List donors by first name, or tag them]

Because of you, I''ve raised $[amount] for Friendship Circle. Race day is THIS Sunday, and there''s still time to join this incredible list.

Sponsor a mile: [URL]

Thank you, thank you, thank you.',

'Send a private thank-you to your top 3 donors.',
'Hey [name], I just wanted to say how grateful I am for your donation. You''re making a real difference. Thank you!',
'close'),

(22, '2026-03-11', 'The Big Ask', 'Make one bold ask to someone who can make a real impact',
'You have one big ask left. One person in your network who could give more than anyone else. Maybe it''s a successful uncle, a business-owner friend, or someone who has always been generous.

You''ve been building up to this. You''ve shown commitment (21 days of showing up). You have social proof (donors, posts, a visible campaign). Now make the ask that could change your entire campaign.

Don''t hide behind text. Call them. Or meet them. Look them in the eye (or hear their voice) and tell them what this means to you. Then ask for a specific amount. "Would you consider sponsoring 5 miles for $180?" or "Could you sponsor the finish line for $360?"',

'Identify your biggest potential donor. Call them or schedule a quick meeting. Make a personal, specific ask.',

'[Phone/in-person script]

"Hi [name], I hope you have a minute. I wanted to tell you about something that''s become really meaningful to me. I''m running the NYC Half Marathon this Sunday with Team Friendship, and I''ve been fundraising for Friendship Circle for the past three weeks.

I''ve raised $[amount] so far and I''m trying to reach $[goal]. I know you care about [community/kids/Jewish causes], and I thought you might want to be part of this.

Would you consider sponsoring [5 miles for $180 / the finish line for $360 / a specific amount]? It would put me over [my goal / a major milestone] and it goes to an incredible cause."',

'Send a heartfelt text to one person asking for a larger gift.',
'Hey [name], I have something important to ask. Would you consider a $100+ donation to my half marathon fundraiser? I''m at $[amount] and trying to reach $[goal] before Sunday. This cause means everything to me. [URL]',
'close'),

(23, '2026-03-12', 'Final Push Email Blast', 'One last email to everyone with a deadline',
'This is your last mass outreach. Sunday is race day. The deadline is real and everyone knows deadlines drive action.

Send one final email to your entire contact list. Don''t worry about emailing people twice. Most people need 3-7 touches before they take action. Your first email was an introduction. This one is the closing.

The tone should be excited, grateful, and urgent. Not desperate. "I run in 3 days. I''m so close to my goal. One last push."',

'Send a final fundraising email to your full contact list. This is your closing argument.',

'Subject: 3 days until I run 13.1 miles for Friendship Circle

Hi everyone,

This Sunday, I''m running the NYC Half Marathon with Team Friendship. I''ve been training hard and fundraising even harder for the past three weeks.

Here''s where I am:
- Raised: $[amount]
- Goal: $[goal]
- Gap: $[remaining]

I''m so close, and I need your help to close the gap. Every $36 sponsors a mile.

This is my last ask before race day. If you''ve been meaning to donate, now is the time.

[Your fundraising URL]

Thank you to everyone who has already given. You''re the reason I''ll cross that finish line with pride.

With gratitude,
[Your name]',

'Send a short text to 5 people: "Race is in 3 days, last chance to sponsor a mile!"',
NULL,
'close'),

(24, '2026-03-13', 'Erev Shabbat Gratitude Post', 'Pre-race gratitude and one final link drop',
'Tomorrow is Shabbat. Sunday is race day. This is the moment to step back and express genuine gratitude.

Whether you hit your goal or not, you showed up for 24 days. You pushed yourself outside your comfort zone. You asked people for money, which is one of the hardest things to do. And you did it because you believe in something bigger than yourself.

Your final post should drip with sincerity. Thank your supporters. Thank your team. Share what this journey has meant to you. And yes, one last link, because there are always last-minute givers who come through in the final hours.',

'Write your final pre-race post. This is your most heartfelt message of the entire campaign. Post it everywhere.',

'This is it. Tomorrow is Shabbat. Sunday, I run 13.1 miles for Team Friendship.

24 days ago, I started this fundraising journey not knowing what to expect. Here''s what happened:
- [X] incredible people donated
- $[amount] raised for Friendship Circle
- A whole lot of humility, gratitude, and growth

To everyone who gave, shared, liked, sent encouraging messages, and believed in me: THANK YOU. You made this possible.

To anyone who''s been meaning to give, this is the last chance before race day: [URL]

I''m running every mile for the kids, teens, and families whose lives are changed by Friendship Circle. See you at the finish line.

Good Shabbos. 🕯️ 🏃',

'Send a personal gratitude text to your top 5 supporters.',
'Hey [name], race is Sunday and I just want to say thank you. Your support through this whole journey has meant everything. I''ll be thinking of you at mile [X].',
'close');
