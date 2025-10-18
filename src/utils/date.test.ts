import {
  formatBookingDate,
  formatBookingRange,
  formatDateISO,
  parseDateOnly,
  todayDateOnly,
} from "@utils/date";
import { describe, expect, it } from "vitest";

describe("utils: date", () => {
  it("should format range within the same month and year", () => {
    const start = new Date(2025, 9, 10);
    const end = new Date(2025, 9, 12);
    const label = formatBookingRange(start, end);
    expect(label).toBe("Oct 10 - 12, 2025");
  });

  it("should format range across different months within the same year", () => {
    const start = new Date(2025, 9, 30);
    const end = new Date(2025, 10, 2);
    const label = formatBookingRange(start, end);
    expect(label).toBe("Oct 30 - Nov 2, 2025");
  });

  it("should format range across different years", () => {
    const start = new Date(2025, 11, 30);
    const end = new Date(2026, 0, 2);
    const label = formatBookingRange(start, end);
    expect(label).toBe("Dec 30, 2025 - Jan 2, 2026");
  });

  it("should return empty string when start or end is missing", () => {
    const missingStart = formatBookingRange(undefined as unknown as Date, new Date(2025, 9, 12));
    const missingEnd = formatBookingRange(new Date(2025, 9, 10), undefined as unknown as Date);
    expect(missingStart).toBe("");
    expect(missingEnd).toBe("");
  });

  it("should format a single booking date", () => {
    const date = new Date(2030, 0, 5);
    const label = formatBookingDate(date);
    expect(label).toBe("Jan 5, 2030");
  });

  it("should roundtrip ISO date using parseDateOnly and formatDateISO", () => {
    const original = "2025-10-12";
    const parsed = parseDateOnly(original);
    const roundtripped = formatDateISO(parsed);
    expect(roundtripped).toBe(original);
  });

  it("should have todayDateOnly equal to today's ISO date", () => {
    const isoFromUtil = formatDateISO(todayDateOnly);
    const isoFromNow = formatDateISO(new Date());
    expect(isoFromUtil).toBe(isoFromNow);
  });
});
