import { neon } from '@neondatabase/serverless';

// Create a fresh connection for each request to avoid stale data in serverless
export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
}

// For backwards compatibility with existing imports
export default { getDb };

// Helper to get a runner by slug with all sponsorships
export async function getRunnerBySlug(slug) {
  const db = getDb();
  const runners = await db`
    SELECT * FROM runners WHERE slug = ${slug}
  `;

  if (runners.length === 0) return null;

  const runner = runners[0];

  const sponsorships = await db`
    SELECT * FROM mile_sponsorships
    WHERE runner_id = ${runner.id}
    ORDER BY mile_number ASC
  `;

  return {
    ...runner,
    sponsorships: sponsorships.map(s => ({
      ...s,
      sponsor_name: s.is_anonymous ? 'Anonymous' : s.sponsor_name
    }))
  };
}

// Get available (unsponsored) miles for a runner
export async function getAvailableMiles(runnerId, totalMiles = 26.2) {
  const db = getDb();
  const sponsoredMiles = await db`
    SELECT mile_number FROM mile_sponsorships
    WHERE runner_id = ${runnerId}
  `;

  const sponsored = new Set(sponsoredMiles.map(s => parseFloat(s.mile_number)));
  const available = [];

  for (let i = 1; i <= Math.floor(totalMiles); i++) {
    if (!sponsored.has(i)) {
      available.push(i);
    }
  }

  const finalMile = parseFloat(totalMiles);
  if (finalMile % 1 !== 0 && !sponsored.has(finalMile)) {
    available.push(finalMile);
  }

  return available.sort((a, b) => a - b);
}

// Create a new mile sponsorship
export async function createSponsorship(data) {
  const db = getDb();
  const {
    runner_id,
    mile_number,
    sponsor_name,
    sponsor_email,
    dedication,
    amount,
    transaction_id,
    is_anonymous = false
  } = data;

  try {
    const result = await db`
      INSERT INTO mile_sponsorships
        (runner_id, mile_number, sponsor_name, sponsor_email, dedication, amount, transaction_id, is_anonymous)
      VALUES
        (${runner_id}, ${mile_number}, ${sponsor_name}, ${sponsor_email}, ${dedication}, ${amount}, ${transaction_id}, ${is_anonymous})
      RETURNING *
    `;
    return { success: true, sponsorship: result[0] };
  } catch (error) {
    if (error.code === '23505') {
      return { success: false, error: 'This mile has already been sponsored' };
    }
    throw error;
  }
}

// Get runner stats
export async function getRunnerStats(runnerId) {
  const db = getDb();
  const stats = await db`
    SELECT
      COUNT(*) as sponsored_count,
      COALESCE(SUM(amount), 0) as total_raised
    FROM mile_sponsorships
    WHERE runner_id = ${runnerId}
  `;

  return {
    sponsoredCount: parseInt(stats[0].sponsored_count),
    totalRaised: parseFloat(stats[0].total_raised)
  };
}
