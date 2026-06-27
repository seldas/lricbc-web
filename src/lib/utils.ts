import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Content dates are plain "YYYY-MM-DD" strings. new Date(str) parses them as
// UTC midnight, which shifts to the previous day in negative-offset local
// timezones - parse the components directly instead.
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}
