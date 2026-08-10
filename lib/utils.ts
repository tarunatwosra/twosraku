import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Get local date string in YYYY-MM-DD format (WIB/Indonesia timezone)
 *
 * IMPORTANT: This function correctly handles timezone conversion.
 * Using toISOString() directly causes date shift because it converts to UTC.
 * For example, if local time is August 7, 2026 at 23:00 WIB (UTC+7),
 * toISOString() returns August 7, 16:00 UTC - same date.
 * BUT if local time is August 8, 2026 at 01:00 WIB, toISOString() returns
 * August 7, 18:00 UTC - causing a 1 day shift!
 *
 * @param date - Optional Date object, defaults to current date
 * @returns Date string in YYYY-MM-DD format in local timezone
 */
export function formatLocalDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Create a Date object from YYYY-MM-DD string in local timezone
 * This avoids timezone issues when parsing date strings
 *
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Date object set to midnight in local timezone
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}
