/**
 * Helper formatters for Pillar III: Rights & Entitlements Module
 * Standards: Indian Rupee formatting (Lakhs, Crores, thousands) with strict tabular-nums font discipline.
 */

export function formatINR(
  val: number,
  options?: { compact?: boolean; precision?: number }
): string {
  if (options?.compact) {
    const absVal = Math.abs(val);
    if (absVal >= 10000000) {
      return `₹${(val / 10000000).toFixed(options.precision ?? 2)} Cr`;
    }
    if (absVal >= 100000) {
      return `₹${(val / 100000).toFixed(options.precision ?? 2)} L`;
    }
    if (absVal >= 1000) {
      return `₹${(val / 1000).toFixed(options.precision ?? 1)} k`;
    }
  }
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
}

export function formatPercent(
  val: number,
  decimals: number = 1,
  showSign: boolean = false
): string {
  const sign = showSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(decimals)}%`;
}

export function formatCount(val: number): string {
  return Math.round(val).toLocaleString('en-IN');
}

export function getCategoryBadgeClass(category: string): string {
  switch (category) {
    case 'Health & Sanitation':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'Education':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    case 'Food Security':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'Civil ID & Banking':
      return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
    case 'Livelihoods':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    default:
      return 'bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20';
  }
}
