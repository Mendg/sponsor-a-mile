// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format mile number for display
export function formatMile(mile) {
  const num = parseFloat(mile);
  return num % 1 === 0 ? num.toString() : num.toFixed(1);
}

// Get relative time string
export function getRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Generate all mile numbers for a race
export function generateMileNumbers(totalMiles) {
  const miles = [];
  const total = parseFloat(totalMiles);

  for (let i = 1; i <= Math.floor(total); i++) {
    miles.push(i);
  }

  // Add decimal mile if exists (like 26.2 or 13.1)
  if (total % 1 !== 0) {
    miles.push(total);
  }

  return miles;
}

// Check if a mile is a "featured" mile
export function isFeaturedMile(mile, totalMiles) {
  const num = parseFloat(mile);
  const total = parseFloat(totalMiles);

  // Start mile
  if (num === 1) return { featured: true, label: 'Start' };

  // Halfway point
  const halfway = total / 2;
  if (Math.abs(num - halfway) < 0.1) return { featured: true, label: 'Halfway' };

  // Finish line
  if (Math.abs(num - total) < 0.1) return { featured: true, label: 'Finish' };

  return { featured: false, label: null };
}

// Truncate text with ellipsis
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
