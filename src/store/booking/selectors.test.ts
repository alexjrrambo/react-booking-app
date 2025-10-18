import type { RootState } from "@store/index";
import { describe, expect, it } from "vitest";
import { selectFilteredBookings } from "./selectors";
import type { Booking, BookingFilters } from "./types";

const bookings: Booking[] = [
  { id: "b1", guestName: "Alice", property: "Beach House", startDate: "2025-10-10", endDate: "2025-10-13" },
  { id: "b2", guestName: "Bob", property: "Mountain Cabin", startDate: "2025-10-17", endDate: "2025-10-19" },
  { id: "b3", guestName: "Carol", property: "Beach House", startDate: "2025-10-22", endDate: "2025-10-26" },
  { id: "b4", guestName: "Dan", property: "Mountain Cabin", startDate: "2025-11-02", endDate: "2025-11-06" },
];

const emptyFilters: BookingFilters = { property: "", startDate: "", endDate: "" };

const makeState = (filters: BookingFilters): RootState =>
  ({ booking: { bookings, filters } } as unknown as RootState);

describe("selector: selectFilteredBookings", () => {
  it("should return all bookings when no filters are set", () => {
    const state = makeState(emptyFilters);
    const result = selectFilteredBookings(state);
    expect(result.length).toBe(4);
    expect(result.map((b) => b.id)).toEqual(["b1", "b2", "b3", "b4"]);
  });

  it("should filter by property only", () => {
    const state = makeState({ property: "Beach House", startDate: "", endDate: "" });
    const result = selectFilteredBookings(state);
    expect(result.map((b) => b.id)).toEqual(["b1", "b3"]);
  });

  it("should filter by full date range intersection", () => {
    const state = makeState({ property: "", startDate: "2025-10-18", endDate: "2025-10-23" });
    const result = selectFilteredBookings(state);
    expect(result.map((b) => b.id)).toEqual(["b2", "b3"]);
  });

  it("should exclude back-to-back ranges", () => {
    const state = makeState({ property: "", startDate: "2025-10-13", endDate: "2025-10-17" });
    const result = selectFilteredBookings(state);
    expect(result.map((b) => b.id)).toEqual([]);
  });

  it("should include when only startDate is set and booking ends after startDate", () => {
    const state = makeState({ property: "", startDate: "2025-10-18", endDate: "" });
    const result = selectFilteredBookings(state);
    expect(result.map((b) => b.id)).toEqual(["b2", "b3", "b4"]);
  });

  it("should include when only endDate is set and booking starts before endDate", () => {
    const state = makeState({ property: "", startDate: "", endDate: "2025-10-20" });
    const result = selectFilteredBookings(state);
    expect(result.map((b) => b.id)).toEqual(["b1", "b2"]);
  });

  it("should compose property and date range filters together", () => {
    const state = makeState({ property: "Mountain Cabin", startDate: "2025-11-01", endDate: "2025-11-03" });
    const result = selectFilteredBookings(state);
    expect(result.map((b) => b.id)).toEqual(["b4"]);
  });

  it("should memoize and return the same array instance for identical inputs", () => {
    const state = makeState(emptyFilters);
    const first = selectFilteredBookings(state);
    const second = selectFilteredBookings(state);
    expect(second).toBe(first);
  });

  it("should return a different array instance when filters object identity changes", () => {
    const first = selectFilteredBookings(makeState(emptyFilters));
    const second = selectFilteredBookings(makeState({ ...emptyFilters }));
    expect(second).not.toBe(first);
    expect(second).toEqual(first);
  });
});
