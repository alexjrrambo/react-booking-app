import type { Booking } from "@store/slices/types";
import { parseDateOnly, todayDateOnly } from "@utils/date";

export type BookingValidationResult = {
  error: boolean;
  message?: string;
};

export type BookingValidator = () => BookingValidationResult;

export function runValidatorsInOrder(...validators: BookingValidator[]): BookingValidationResult {
  for (const validate of validators) {
    const result = validate();
    if (result.error) {
      return result;
    }
  }
  return { error: false };
}

export function ensureDateRangePresent(
  startDate?: Date,
  endDate?: Date,
): BookingValidationResult {
  if (!startDate || !endDate) {
    return {
      error: true,
      message: "Please select both a check-in and a check-out date.",
    };
  }
  return { error: false };
}

export function ensureChronologicalOrder(
  startDate: Date,
  endDate: Date,
): BookingValidationResult {
  if (!(startDate < endDate)) {
    return {
      error: true,
      message: "Check-out must be after start date.",
    };
  }
  return { error: false };
}

export function ensureStartDateNotInPast(
  startDate: Date,
): BookingValidationResult {
  if (startDate < todayDateOnly) {
    return {
      error: true,
      message: "Check-in cannot be in the past.",
    };
  }
  return { error: false };
}

type EnsureNoOverlapParams = {
  startDate: Date;
  endDate: Date;
  property: string;
  existingBookings: Booking[];
  ignoreBookingId?: string;
  ignorePastBookings?: boolean;
};

export function ensureNoOverlapForProperty({
  startDate,
  endDate,
  property,
  existingBookings,
  ignoreBookingId,
  ignorePastBookings,
}: EnsureNoOverlapParams): BookingValidationResult {
  const existOverlaps = existingBookings.some((bookedItem) => {
    if (ignoreBookingId && bookedItem.id === ignoreBookingId) {
      return false;
    }
    if (bookedItem.property !== property) {
      return false;
    }

    if (ignorePastBookings) {
      const bookedEndDateCheck = parseDateOnly(bookedItem.endDate);

      if (bookedEndDateCheck < todayDateOnly) {
        return false;
      }
    }

    const bookedStartDate = parseDateOnly(bookedItem.startDate);
    const bookedEndDate = parseDateOnly(bookedItem.endDate);

    const intervalsOverlap = startDate < bookedEndDate && bookedStartDate < endDate;
    return intervalsOverlap;
  });

  if (existOverlaps) {
    return {
      error: true,
      message: "These dates overlap an existing booking for this property.",
    };
  }
  return { error: false };
}
