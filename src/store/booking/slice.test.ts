import { describe, expect, it } from "vitest";
import {
  bookingReducer,
  createBooking,
  deleteBooking,
  setBookingFilters,
  updateBooking,
} from "./slice";
import type { Booking, BookingFilters } from "./types";

const getInitialState = () => bookingReducer(undefined, { type: "" });

describe("store: booking slice", () => {
  it("should create a booking", () => {
    const state = getInitialState();
    const newBooking: Booking = {
      id: "bkg_999",
      guestName: "John Doe",
      property: "Lake House",
      startDate: "2025-12-01",
      endDate: "2025-12-05",
    };
    const next = bookingReducer(state, createBooking(newBooking));
    expect(next.bookings.length).toBe(state.bookings.length + 1);
    expect(next.bookings.at(-1)).toEqual(newBooking);
  });

  it("should update an existing booking", () => {
    const state = getInitialState();
    const targetId = state.bookings[0].id;
    const updated: Booking = {
      ...state.bookings[0],
      id: targetId,
      guestName: "Alex Rambo Updated",
      endDate: "2025-10-14",
    };
    const next = bookingReducer(state, updateBooking(updated));
    const found = next.bookings.find((b) => b.id === targetId);
    expect(found?.guestName).toBe("Alex Rambo Updated");
    expect(found?.endDate).toBe("2025-10-14");
  });

  it("should keep state reference when updating a non-existent booking", () => {
    const state = getInitialState();
    const updated: Booking = {
      id: "does_not_exist",
      guestName: "Ghost",
      property: "Nowhere",
      startDate: "2025-01-01",
      endDate: "2025-01-02",
    };
    const next = bookingReducer(state, updateBooking(updated));
    expect(next).toBe(state);
  });

  it("should delete a booking by id", () => {
    const state = getInitialState();
    const targetId = state.bookings[1].id;
    const next = bookingReducer(state, deleteBooking({ id: targetId }));
    const exists = next.bookings.some((b) => b.id === targetId);
    expect(exists).toBe(false);
    expect(next.bookings.length).toBe(state.bookings.length - 1);
  });

  it("should set booking filters by merging payload", () => {
    const state = getInitialState();
    const firstUpdate: BookingFilters = { startDate: "2025-10-10", endDate: "", property: "" };
    const afterFirst = bookingReducer(state, setBookingFilters(firstUpdate));
    expect(afterFirst.filters).toEqual({ property: "", startDate: "2025-10-10", endDate: "" });

    const secondUpdate: BookingFilters = { property: "Mountain Cabin", startDate: "", endDate: "2025-10-12" };
    const afterSecond = bookingReducer(afterFirst, setBookingFilters(secondUpdate));
    expect(afterSecond.filters).toEqual({
      property: "Mountain Cabin",
      startDate: "",
      endDate: "2025-10-12",
    });
  });

  it("should change state reference when filters are updated", () => {
    const state = getInitialState();
    const next = bookingReducer(state, setBookingFilters({ property: "Beach House", startDate: "", endDate: "" }));
    expect(next).not.toBe(state);
  });
});
