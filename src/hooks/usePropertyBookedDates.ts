import { useAppSelector } from "@hooks/useAppSelector";
import { parseDateOnly } from "@utils/date";
import { addDays } from "date-fns";
import { useMemo } from "react";
import type { DateRange } from "react-day-picker";

type UsePropertyBookedDatesResult = {
  propertyBookedDates: DateRange[];
  maxSelectableEndDate?: Date;
};

export function usePropertyBookedDates(
  property: string,
  ignoreBookingId?: string,
  datePickerDatesFrom?: Date,
): UsePropertyBookedDatesResult {
  const bookingList = useAppSelector((state) => state.booking.bookings);

  return useMemo(() => {
    if (!property) return { propertyBookedDates: [] };

    const propertyBookedDates: DateRange[] = bookingList
      .filter((b) => b.property === property && b.id !== ignoreBookingId)
      .map(({ startDate, endDate }) => ({
        from: parseDateOnly(startDate),
        to: addDays(parseDateOnly(endDate), -1),
      }));

    let nextBookedStartAfterSelectedFrom: Date | undefined;
    if (datePickerDatesFrom) {
      for (const range of propertyBookedDates) {
        const start = range?.from;
        if (!start || start <= datePickerDatesFrom) continue;
        if (!nextBookedStartAfterSelectedFrom || start < nextBookedStartAfterSelectedFrom) {
          nextBookedStartAfterSelectedFrom = start;
        }
      }
    }

    const maxSelectableEndDate = nextBookedStartAfterSelectedFrom
      ? addDays(nextBookedStartAfterSelectedFrom, -1)
      : undefined;

    return { propertyBookedDates, maxSelectableEndDate };
  }, [bookingList, property, ignoreBookingId, datePickerDatesFrom]);
}
