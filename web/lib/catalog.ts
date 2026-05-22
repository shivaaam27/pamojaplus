// Shared constants used by the apply form, the seller profile editor,
// the seller listing editor, and the marketplace category filter.
// Keep these in sync; mismatches break the public filter.

export const CATEGORIES = [
  "Food & Beverages",
  "Wellness & Health",
  "Beauty & Personal Care",
  "Fashion",
  "Home Essentials",
  "Local Services"
] as const;

export type Category = typeof CATEGORIES[number];

// Loose TZ-friendly check. Accepts +255700000000, 0700000000, 255 700 000 000, etc.
// Normalises by stripping non-digits — caller can use this to canonicalise.
export function normalizeTzPhone(raw: string): string {
  const digits = (raw || "").replace(/[^\d]/g, "");
  if (!digits) return "";
  // 0700000000 → 255700000000
  if (digits.startsWith("0") && digits.length === 10) return `255${digits.slice(1)}`;
  // 700000000 → 255700000000
  if (digits.length === 9 && /^[67]/.test(digits)) return `255${digits}`;
  return digits;
}

export function isValidTzPhone(raw: string): boolean {
  const n = normalizeTzPhone(raw);
  // TZ mobile: country code 255, then 9-digit subscriber starting with 6 or 7
  return /^255[67]\d{8}$/.test(n);
}
