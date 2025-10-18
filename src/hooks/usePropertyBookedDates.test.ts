import type { Booking } from "@store/booking/types";
import { act, renderHook } from "@testing-library/react";
import type { DateRange } from "react-day-picker";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePropertyBookedDates } from "./usePropertyBookedDates";

type RootStateMock = {
  booking: {
    bookings: Booking[];
  };
};

let mockState: RootStateMock = {
  booking: { bookings: [] },
};

vi.mock("@hooks/useAppSelector", () => ({
  useAppSelector: (selector: (state: RootStateMock) => unknown) => selector(mockState),
}));

const iso = (date: Date | undefined) => (date ? date.toISOString().slice(0, 10) : "");

describe("usePropertyBookedDates", () => {
  beforeEach(() => {
    mockState = {
      booking: {
        bookings: [
          {
            id: "b1",
            guestName: "Alice",
            property: "House Beach",
            startDate: "2025-10-01",
            endDate: "2025-10-05",
          },
          {
            id: "b2",
            guestName: "Bob",
            property: "Mountain Cabin",
            startDate: "2025-10-10",
            endDate: "2025-10-12",
          },
          {
            id: "b3",
            guestName: "Cara",
            property: "House Beach",
            startDate: "2025-11-01",
            endDate: "2025-11-03",
          },
        ],
      },
    };
  });

  it("should return empty result when property is empty", () => {
    const { result } = renderHook(({ property }) => usePropertyBookedDates(property), {
      initialProps: { property: "" },
    });
    expect(result.current.propertyBookedDates).toEqual([]);
    expect(result.current.maxSelectableEndDate).toBeUndefined();
  });

  it("should return no ranges when no bookings match the property", () => {
    const { result } = renderHook(({ property }) => usePropertyBookedDates(property), {
      initialProps: { property: "Unknown Place" },
    });
    expect(result.current.propertyBookedDates).toEqual([]);
    expect(result.current.maxSelectableEndDate).toBeUndefined();
  });

  it("should return ranges with end date exclusive (minus one day)", () => {
    const { result } = renderHook(({ property }) => usePropertyBookedDates(property), {
      initialProps: { property: "House Beach" },
    });

    const ranges: DateRange[] = result.current.propertyBookedDates;
    expect(ranges).toHaveLength(2);

    expect(iso(ranges[0].from)).toBe("2025-10-01");
    expect(iso(ranges[0].to)).toBe("2025-10-04");

    expect(iso(ranges[1].from)).toBe("2025-11-01");
    expect(iso(ranges[1].to)).toBe("2025-11-02");
  });

  it("should compute maxSelectableEndDate from the next booked start after selected from", () => {
    const selectedFrom = new Date(2025, 9, 15);
    const { result } = renderHook(
      ({ property, from }) => usePropertyBookedDates(property, undefined, from),
      { initialProps: { property: "House Beach", from: selectedFrom } },
    );

    expect(result.current.propertyBookedDates).toHaveLength(2);
    expect(iso(result.current.maxSelectableEndDate)).toBe("2025-10-31");
  });

  it("should respect ignoreBookingId and drop that booking from disabled ranges", () => {
    const { result } = renderHook(
      ({ property, ignoreId }) => usePropertyBookedDates(property, ignoreId),
      { initialProps: { property: "Mountain Cabin", ignoreId: "b2" } },
    );

    expect(result.current.propertyBookedDates).toHaveLength(0);
    expect(result.current.maxSelectableEndDate).toBeUndefined();
  });

  it("should recompute when property changes", () => {
    const { result, rerender } = renderHook(
      ({ property }) => usePropertyBookedDates(property),
      { initialProps: { property: "House Beach" } },
    );

    expect(result.current.propertyBookedDates).toHaveLength(2);

    rerender({ property: "Mountain Cabin" });
    expect(result.current.propertyBookedDates).toHaveLength(1);

    const onlyRange = result.current.propertyBookedDates[0];
    expect(iso(onlyRange.from)).toBe("2025-10-10");
    expect(iso(onlyRange.to)).toBe("2025-10-11");
  });

  it("should update when the booking list changes", () => {
    const { result, rerender } = renderHook(
      ({ property }) => usePropertyBookedDates(property),
      { initialProps: { property: "House Beach" } },
    );
    expect(result.current.propertyBookedDates).toHaveLength(2);

    act(() => {
      mockState.booking.bookings = [
        ...mockState.booking.bookings,
        {
          id: "b4",
          guestName: "Dora",
          property: "House Beach",
          startDate: "2025-12-24",
          endDate: "2025-12-26",
        },
      ];
    });

    rerender({ property: "House Beach" });
    expect(result.current.propertyBookedDates).toHaveLength(3);

    const last = result.current.propertyBookedDates[2];
    expect(iso(last.from)).toBe("2025-12-24");
    expect(iso(last.to)).toBe("2025-12-25");
  });
});
