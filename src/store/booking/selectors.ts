import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@store/index";
import { parseDateOnly } from "@utils/date";

const selectBookings = (state: RootState) => state.booking.bookings;
const selectBookingFilters = (state: RootState) => state.booking.filters;

function rangesIntersect(
  bookingStart: Date,
  bookingEnd: Date,
  filterStart: Date,
  filterEnd: Date,
): boolean {
  return bookingStart < filterEnd && filterStart < bookingEnd;
}

export const selectFilteredBookings = createSelector(
  [selectBookings, selectBookingFilters],
  (bookings, filters) => {
    const { property: filterProperty, startDate: filterStart, endDate: filterEnd } = filters;

    const filterStartDate = filterStart ? parseDateOnly(filterStart) : undefined;
    const filterEndDate = filterEnd ? parseDateOnly(filterEnd) : undefined;

    const filtered = bookings.filter((booking) => {
      if (filterProperty && booking.property !== filterProperty) {
        return false;
      }

      if (!filterStartDate && !filterEndDate) return true;

      const bookingStartDate = parseDateOnly(booking.startDate);
      const bookingEndDate = parseDateOnly(booking.endDate);

      if (filterStartDate && filterEndDate) {
        return rangesIntersect(bookingStartDate, bookingEndDate, filterStartDate, filterEndDate);
      }

      if (filterStartDate && !filterEndDate) {
        return bookingEndDate > filterStartDate;
      }

      if (!filterStartDate && filterEndDate) {
        return bookingStartDate < filterEndDate;
      }

      return true;
    });

    return [...filtered].sort((a, b) =>
      parseDateOnly(a.startDate).getTime() - parseDateOnly(b.startDate).getTime(),
    );
  },
);
