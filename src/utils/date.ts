import { format, isSameMonth, isSameYear } from "date-fns";

const DATE_FULL = "MMM d, yyyy"; // Oct 16, 2025
const DATE_MONTH_DAY = "MMM d"; // Oct 16
const YEAR_FULL = "yyyy"; // 2025
const DATE_DAY_ONLY = "d"; // 16

export function formatBookingRange(start: Date, end: Date) {
  if (!start || !end) {
    return "";
  }

  if (isSameYear(start, end)) {
    if (isSameMonth(start, end)) {
      return `${format(start, DATE_MONTH_DAY)} - ${format(end, DATE_DAY_ONLY)}, ${format(start, YEAR_FULL)}`;
    }
    return `${format(start, DATE_MONTH_DAY)} - ${format(end, DATE_FULL)}`;
  }

  return `${format(start, DATE_FULL)} - ${format(end, DATE_FULL)}`;
}

export function formatBookingDate(date: Date) {
  return format(date, DATE_FULL);
}

export function formatDateISO(date: Date) {
  return date.toISOString().slice(0, 10);
}
