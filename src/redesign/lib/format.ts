/**
 * Number formatting for the redesigned FASAL dashboard.
 * Indian digit grouping throughout; crore / lakh short forms for large rupee values.
 */

const IN = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** 1535 -> "1,535" (Indian grouping). `digits` fixes the decimals. */
export function num(n: number, digits = 0): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

/** 95045999 -> "₹9,50,45,999" */
export function inr(n: number, digits = 0): string {
  const sign = n < 0 ? '−' : '';
  return `${sign}₹${num(Math.abs(n), digits)}`;
}

/** 95045999 -> "₹9.50 Cr" · 9838392 -> "₹98.4 L" · 53400 -> "₹53,400" */
export function inrShort(n: number): string {
  const sign = n < 0 ? '−' : '';
  const a = Math.abs(n);
  if (a >= 1e7) return `${sign}₹${(a / 1e7).toFixed(2)} Cr`;
  if (a >= 1e5) return `${sign}₹${(a / 1e5).toFixed(a >= 1e6 ? 1 : 2)} L`;
  return `${sign}₹${IN.format(a)}`;
}

/** Axis-friendly: 60000 -> "₹60k", 9500000 -> "₹95 L", 95045999 -> "₹9.5 Cr" */
export function inrAxis(n: number): string {
  const a = Math.abs(n);
  const sign = n < 0 ? '−' : '';
  if (a >= 1e7) return `${sign}₹${+(a / 1e7).toFixed(1)} Cr`;
  if (a >= 1e5) return `${sign}₹${+(a / 1e5).toFixed(0)} L`;
  if (a >= 1e3) return `${sign}₹${+(a / 1e3).toFixed(0)}k`;
  return `${sign}₹${a}`;
}

/** 84.97 -> "84.97%" */
export function pct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

/** 84.97 -> "+84.97%" · -3.2 -> "−3.20%" */
export function signedPct(n: number, digits = 1): string {
  const s = n > 0 ? '+' : n < 0 ? '−' : '';
  return `${s}${Math.abs(n).toFixed(digits)}%`;
}

/** 11.4 -> "+11.4 pts" */
export function points(n: number, digits = 1): string {
  const s = n > 0 ? '+' : n < 0 ? '−' : '';
  return `${s}${Math.abs(n).toFixed(digits)} pts`;
}

/** 2.4273 -> "2.43×" */
export function times(n: number, digits = 2): string {
  return `${n.toFixed(digits)}×`;
}
