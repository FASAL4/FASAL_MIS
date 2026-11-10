/**
 * Helper formatters for Pillar I: Income Security Module
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

export function formatINRWithDecimals(val: number, decimals: number = 2): string {
  const parts = val.toFixed(decimals).split('.');
  const intPart = parseInt(parts[0], 10).toLocaleString('en-IN');
  return `₹${intPart}.${parts[1]}`;
}

export function formatPercent(val: number, decimals: number = 1, showSign: boolean = true): string {
  const sign = showSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(decimals)}%`;
}

export function formatNumber(val: number, decimals: number = 0): string {
  if (decimals === 0) {
    return Math.round(val).toLocaleString('en-IN');
  }
  return val.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

