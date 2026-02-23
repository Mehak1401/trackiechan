import { Subscription } from "./mockData";

/**
 * Check if a subscription is active on a given date.
 * - Must be on or after startDate
 * - If endDate exists, must be on or before endDate
 */
export function isActiveOnDate(sub: Subscription, date: Date): boolean {
  if (sub.startDate) {
    const start = new Date(sub.startDate);
    if (date < new Date(start.getFullYear(), start.getMonth(), start.getDate())) {
      return false;
    }
  }
  if (sub.endDate) {
    const end = new Date(sub.endDate);
    if (date > new Date(end.getFullYear(), end.getMonth(), end.getDate())) {
      return false;
    }
  }
  return true;
}

/**
 * Check if a subscription should appear on a specific day of a given month/year.
 */
export function isVisibleOnDay(sub: Subscription, year: number, month: number, day: number): boolean {
  const date = new Date(year, month, day);
  return sub.dueDay === day && isActiveOnDate(sub, date);
}

/**
 * Check if a subscription is canceled (has an endDate in the past).
 */
export function isCanceled(sub: Subscription): boolean {
  if (!sub.endDate) return false;
  const end = new Date(sub.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return end < today;
}

/**
 * Check if subscription is currently active (no endDate or endDate is in the future).
 */
export function isCurrentlyActive(sub: Subscription): boolean {
  return !isCanceled(sub);
}

/**
 * Get subscriptions active during a specific month.
 */
export function getActiveSubsForMonth(subs: Subscription[], year: number, month: number): Subscription[] {
  // A sub is relevant if it was active at any point during this month
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  return subs.filter((sub) => {
    if (sub.startDate) {
      const start = new Date(sub.startDate);
      if (start > monthEnd) return false;
    }
    if (sub.endDate) {
      const end = new Date(sub.endDate);
      if (end < monthStart) return false;
    }
    return true;
  });
}
