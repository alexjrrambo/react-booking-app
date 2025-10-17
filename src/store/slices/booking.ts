import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Booking, BookingFilters, BookingState } from "./types";

const initialState: BookingState = {
  bookings: [
    {
      id: "bkg_001",
      guestName: "Alex Junior Rambo",
      property: "Mountain Cabin",
      startDate: "2025-07-10",
      endDate: "2025-07-17",
    },
    {
      id: "bkg_002",
      guestName: "Maria Oliveira",
      property: "Mountain Cabin",
      startDate: "2025-07-12",
      endDate: "2025-07-15",
    },
    {
      id: "bkg_003",
      guestName: "João Santos",
      property: "Mountain Cabin",
      startDate: "2025-07-18",
      endDate: "2025-07-22",
    },
    {
      id: "bkg_004",
      guestName: "Ana Beatriz",
      property: "Mountain Cabin",
      startDate: "2025-07-20",
      endDate: "2025-07-25",
    },
    {
      id: "bkg_005",
      guestName: "Carlos Souza",
      property: "Mountain Cabin",
      startDate: "2025-07-28",
      endDate: "2025-08-02",
    },
  ],
  filters: {
    property: "",
    startDate: "",
    endDate: "",
  },
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    createBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const existingBooking = state.bookings.find(
        (booking) => booking.id === action.payload.id,
      );

      if (existingBooking) {
        Object.assign(existingBooking, action.payload);
      }
    },
    deleteBooking: (state, action: PayloadAction<{ id: string }>) => {
      state.bookings = state.bookings.filter(
        (booking) => booking.id !== action.payload.id,
      );
    },
    setBookingFilters: (state, action: PayloadAction<BookingFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearBookingFilters: (state) => {
      state.filters = { property: "", startDate: "", endDate: "" };
    },
  },
});

export const bookingReducer = bookingSlice.reducer;
export const {
  createBooking,
  updateBooking,
  deleteBooking,
  setBookingFilters,
  clearBookingFilters,
} = bookingSlice.actions;
