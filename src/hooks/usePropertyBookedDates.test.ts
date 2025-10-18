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

const d = (date: Date | undefined) => (date ? date.toISOString().slice(0, 10) : "");

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

  it("should return empty array when property is empty", () => {
    const { result } = renderHook(({ property }) => usePropertyBookedDates(property), {
      initialProps: { property: "" },
    });
    expect(result.current).toEqual([]);
  });

  it("should return empty array when no bookings match the property", () => {
    const { result } = renderHook(({ property }) => usePropertyBookedDates(property), {
      initialProps: { property: "Unknown Place" },
    });
    expect(result.current).toEqual([]);
  });

  it("should return ranges for a property with end date exclusive minus one day", () => {
    const { result } = renderHook(({ property }) => usePropertyBookedDates(property), {
      initialProps: { property: "House Beach" },
    });

    const ranges: DateRange[] = result.current;
    expect(ranges).toHaveLength(2);

    expect(d(ranges[0].from)).toBe("2025-10-01");
    expect(d(ranges[0].to)).toBe("2025-10-04");

    expect(d(ranges[1].from)).toBe("2025-11-01");
    expect(d(ranges[1].to)).toBe("2025-11-02");
  });

  it("should recompute when property changes", () => {
    const { result, rerender } = renderHook(({ property }) => usePropertyBookedDates(property), {
      initialProps: { property: "House Beach" },
    });
    expect(result.current).toHaveLength(2);

    rerender({ property: "Mountain Cabin" });
    expect(result.current).toHaveLength(1);

    const range = result.current[0];
    expect(d(range.from)).toBe("2025-10-10");
    expect(d(range.to)).toBe("2025-10-11");
  });

  it("should update when booking list changes", () => {
    const { result, rerender } = renderHook(({ property }) => usePropertyBookedDates(property), {
      initialProps: { property: "House Beach" },
    });
    expect(result.current).toHaveLength(2);

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
    expect(result.current).toHaveLength(3);

    const last = result.current[2];
    expect(d(last.from)).toBe("2025-12-24");
    expect(d(last.to)).toBe("2025-12-25");
  });
});
