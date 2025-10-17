import { useAppSelector } from "@hooks/useAppSelector";
import { parseDateOnly } from "@utils/date";
import { addDays } from "date-fns";
import { useMemo } from "react";
import type { DateRange } from "react-day-picker";

export function usePropertyBookedDates(property: string): DateRange[] {
  const bookingList = useAppSelector((state) => state.booking.bookings);

  return useMemo(() => {
    if (!property) {
      return [];
    };

    return bookingList
      .filter((booking) => booking.property === property)
      .map(({ startDate, endDate }) => ({
        from: parseDateOnly(startDate),
        to: addDays(parseDateOnly(endDate), -1),
      }));
  }, [bookingList, property]);
}
