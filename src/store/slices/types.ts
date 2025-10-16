export interface Booking {
  id: string;
  guestName: string;
  property: string;
  startDate: string;
  endDate: string;
}

export interface BookingFilters {
  property: string;
  startDate: string;
  endDate: string;
}

export interface BookingState {
  bookingList: Booking[];
  filters: BookingFilters;
  currentBookingId: string;
}
