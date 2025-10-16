import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookingList: [
      {
        id: "bkg_001",
        guestName: "Alex Junior Rambo",
        property: "Property 1",
        startDate: "2025-07-10",
        endDate: "2025-07-17",
      },
      {
        id: "bkg_002",
        guestName: "Maria Oliveira",
        property: "Property 2",
        startDate: "2025-07-12",
        endDate: "2025-07-15",
      },
      {
        id: "bkg_003",
        guestName: "João Santos",
        property: "Property 3",
        startDate: "2025-07-18",
        endDate: "2025-07-22",
      },
      {
        id: "bkg_004",
        guestName: "Ana Beatriz",
        property: "Property 1",
        startDate: "2025-07-20",
        endDate: "2025-07-25",
      },
      {
        id: "bkg_005",
        guestName: "Carlos Souza",
        property: "Property 2",
        startDate: "2025-07-28",
        endDate: "2025-08-02",
      },
    ],
    filters: {
      property: "",
      startDate: "",
      endDate: "",
    },
    currentBookingId: "",
  },
  reducers: {
    createBooking: (state, action) => {
      state.bookingList.push(action.payload);
    },
    deleteBooking: (state, action) => {
      state.bookingList = state.bookingList.filter(
        (booking) => booking.id !== action.payload.id,
      );
    },
  },
});

export const booking = bookingSlice.reducer;
export const { createBooking, deleteBooking } = bookingSlice.actions;
