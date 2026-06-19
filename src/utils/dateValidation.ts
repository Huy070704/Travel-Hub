/**
 * Helpers for validating user-selected dates.
 *
 * Rule: pages that let users pick a travel/booking date should only allow
 * dates in the future (from today onwards). Date-of-birth style inputs are the
 * exception and should use `todayISO()` as a `max` instead.
 */

/** Today's date as a YYYY-MM-DD string (local time), suitable for an input's min/max. */
export function todayISO(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().split("T")[0];
}

/** Local midnight today, for comparing against parsed date values. */
function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** True when `value` is a valid date that is today or later. */
export function isTodayOrFuture(value: string | null | undefined): boolean {
  if (!value) return false;
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) return false;
  const day = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  return day.getTime() >= startOfToday().getTime();
}

/** True when `value` is strictly after `other` (both YYYY-MM-DD / ISO). */
export function isAfter(value: string, other: string): boolean {
  const a = new Date(value);
  const b = new Date(other);
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return false;
  return a.getTime() > b.getTime();
}
