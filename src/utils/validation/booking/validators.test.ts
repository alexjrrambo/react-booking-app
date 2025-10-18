import type { Booking } from "@store/booking/types";
import { formatDateISO, todayDateOnly } from "@utils/date";
import { describe, expect, it } from "vitest";
import {
  ensureChronologicalOrder,
  ensureDateRangePresent,
  ensureNoOverlapForProperty,
  ensureStartDateNotInPast,
  executeBookingValidators,
  runValidatorsInOrder,
} from "./validators";

const year = todayDateOnly.getFullYear();
const month = todayDateOnly.getMonth();
const day = todayDateOnly.getDate();

const makeBooking = (id: string, property: string, start: Date, end: Date): Booking => ({
  id,
  guestName: "Guest",
  property,
  startDate: formatDateISO(start),
  endDate: formatDateISO(end),
});

describe("utils: validators", () => {
  it("runValidatorsInOrder should return first error and stop", () => {
    const firstValidator = () => ({ error: false as const });
    const secondValidator = () => ({ error: true as const, message: "E2" });
    const thirdValidator = () => ({ error: true as const, message: "E3" });
    const result = runValidatorsInOrder(firstValidator, secondValidator, thirdValidator);
    expect(result.error).toBe(true);
    expect(result.message).toBe("E2");
  });

  it("ensureDateRangePresent should require both dates", () => {
    const missingBoth = ensureDateRangePresent(undefined, undefined);
    const missingEnd = ensureDateRangePresent(new Date(year, month, day), undefined);
    const missingStart = ensureDateRangePresent(undefined, new Date(year, month, day + 1));
    const bothPresent = ensureDateRangePresent(new Date(year, month, day), new Date(year, month, day + 1));
    expect(missingBoth.error).toBe(true);
    expect(missingBoth.message).toBe("Please select both a check-in and a check-out date.");
    expect(missingEnd.error).toBe(true);
    expect(missingStart.error).toBe(true);
    expect(bothPresent.error).toBe(false);
  });

  it("ensureChronologicalOrder should fail when end is not after start", () => {
    const startDate = new Date(year, month, day);
    const sameAsStart = new Date(year, month, day);
    const laterDate = new Date(year, month, day + 2);
    const equalDatesResult = ensureChronologicalOrder(startDate, sameAsStart);
    const reversedOrderResult = ensureChronologicalOrder(laterDate, startDate);
    const correctOrderResult = ensureChronologicalOrder(startDate, laterDate);
    expect(equalDatesResult.error).toBe(true);
    expect(equalDatesResult.message).toBe("Check-out must be after start date.");
    expect(reversedOrderResult.error).toBe(true);
    expect(correctOrderResult.error).toBe(false);
  });

  it("ensureStartDateNotInPast should fail only when start is before today", () => {
    const yesterday = new Date(year, month, day - 1);
    const today = new Date(year, month, day);
    const tomorrow = new Date(year, month, day + 1);
    const pastResult = ensureStartDateNotInPast(yesterday);
    const todayResult = ensureStartDateNotInPast(today);
    const futureResult = ensureStartDateNotInPast(tomorrow);
    expect(pastResult.error).toBe(true);
    expect(pastResult.message).toBe("Check-in cannot be in the past.");
    expect(todayResult.error).toBe(false);
    expect(futureResult.error).toBe(false);
  });

  it("ensureNoOverlapForProperty should fail on overlap for same property", () => {
    const existingBookings: Booking[] = [
      makeBooking("a1", "Cabin", new Date(year, month, day + 3), new Date(year, month, day + 6)),
      makeBooking("a2", "Lake", new Date(year, month, day + 1), new Date(year, month, day + 2)),
    ];
    const overlappingForCabin = ensureNoOverlapForProperty({
      startDate: new Date(year, month, day + 4),
      endDate: new Date(year, month, day + 7),
      property: "Cabin",
      existingBookings,
    });
    const nonOverlappingForLake = ensureNoOverlapForProperty({
      startDate: new Date(year, month, day + 4),
      endDate: new Date(year, month, day + 7),
      property: "Lake",
      existingBookings,
    });
    expect(overlappingForCabin.error).toBe(true);
    expect(overlappingForCabin.message).toBe("These dates overlap an existing booking for this property.");
    expect(nonOverlappingForLake.error).toBe(false);
  });

  it("ensureNoOverlapForProperty should allow back-to-back ranges", () => {
    const existingBookings: Booking[] = [
      makeBooking("b1", "Cabin", new Date(year, month, day + 3), new Date(year, month, day + 5)),
    ];
    const touchingAtStart = ensureNoOverlapForProperty({
      startDate: new Date(year, month, day + 1),
      endDate: new Date(year, month, day + 3),
      property: "Cabin",
      existingBookings,
    });
    const touchingAtEnd = ensureNoOverlapForProperty({
      startDate: new Date(year, month, day + 5),
      endDate: new Date(year, month, day + 7),
      property: "Cabin",
      existingBookings,
    });
    expect(touchingAtStart.error).toBe(false);
    expect(touchingAtEnd.error).toBe(false);
  });

  it("ensureNoOverlapForProperty should ignore a booking by id", () => {
    const existingBookings: Booking[] = [
      makeBooking("x1", "Cabin", new Date(year, month, day + 3), new Date(year, month, day + 6)),
    ];
    const ignoringById = ensureNoOverlapForProperty({
      startDate: new Date(year, month, day + 4),
      endDate: new Date(year, month, day + 5),
      property: "Cabin",
      existingBookings,
      ignoreBookingId: "x1",
    });
    expect(ignoringById.error).toBe(false);
  });

  it("ensureNoOverlapForProperty should ignore past bookings when flag is set", () => {
    const existingBookings: Booking[] = [
      makeBooking("p1", "Cabin", new Date(year, month, day - 5), new Date(year, month, day - 3)),
    ];
    const ignoringPast = ensureNoOverlapForProperty({
      startDate: new Date(year, month, day + 1),
      endDate: new Date(year, month, day + 2),
      property: "Cabin",
      existingBookings,
      ignorePastBookings: true,
    });
    expect(ignoringPast.error).toBe(false);
  });

  it("executeBookingValidators should pass on valid input", () => {
    const existingBookings: Booking[] = [
      makeBooking("a1", "Cabin", new Date(year, month, day + 10), new Date(year, month, day + 12)),
    ];
    const result = executeBookingValidators({
      startDate: new Date(year, month, day + 2),
      endDate: new Date(year, month, day + 4),
      property: "Cabin",
      existingBookings,
    });
    expect(result.error).toBe(false);
  });

  it("executeBookingValidators should return the overlap message when overlapping", () => {
    const existingBookings: Booking[] = [
      makeBooking("a1", "Cabin", new Date(year, month, day + 3), new Date(year, month, day + 6)),
    ];
    const result = executeBookingValidators({
      startDate: new Date(year, month, day + 4),
      endDate: new Date(year, month, day + 7),
      property: "Cabin",
      existingBookings,
    });
    expect(result.error).toBe(true);
    expect(result.message).toBe("These dates overlap an existing booking for this property.");
  });
});
