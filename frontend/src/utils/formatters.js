/**
 * Format compensation and salary ranges with appropriate currency symbol and units (such as LPA for INR).
 */
export function formatSalary(minOrJob, max, currency = 'INR', rawSalary = null) {
  let min = minOrJob;
  let curr = currency;
  let raw = rawSalary;

  if (minOrJob && typeof minOrJob === 'object') {
    min = minOrJob.salaryMin;
    max = minOrJob.salaryMax;
    curr = minOrJob.salaryCurrency || 'INR';
    raw = minOrJob.salary;
  }

  if (raw && typeof raw === 'string' && (raw.toLowerCase().includes('lpa') || raw.toLowerCase().includes('month') || raw.toLowerCase().includes('year'))) {
    return raw;
  }

  if (!min && !max) return raw || 'Competitive compensation';

  const isINR = !curr || curr.toUpperCase() === 'INR';
  const sym = isINR ? '₹' : curr.toUpperCase() === 'EUR' ? '€' : '$';
  const suffix = isINR ? ' LPA' : '';

  if (min && max) return `${sym}${min.toLocaleString()} - ${sym}${max.toLocaleString()}${suffix}`;
  if (min) return `From ${sym}${min.toLocaleString()}${suffix}`;
  return `Up to ${sym}${max.toLocaleString()}${suffix}`;
}
