import type { Booking } from "@store/booking/types";
import { fireEvent, screen, within } from "@testing-library/react";
import { type PropsWithChildren, type ReactNode } from "react";
import * as ReactRedux from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithTheme } from "../../../test/renderWithTheme";
import { BookingList } from "./index";

let mockBookings: Booking[] = [];
const dispatchMock = vi.fn();

vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof ReactRedux>("react-redux");
  return {
    ...actual,
    useDispatch: vi.fn(() => dispatchMock),
  };
});

vi.mock("@hooks/useAppSelector", () => ({
  useAppSelector: (selector: (state: unknown) => unknown) => selector({}),
}));

vi.mock("@store/booking/selectors", () => ({
  selectFilteredBookings: () => mockBookings,
}));

vi.mock("@components/Modal/Booking", () => {
  type BookingModalProps = {
    existingBooking?: Booking;
  };
  const BookingModal = ({ existingBooking }: BookingModalProps) => {
    const label = existingBooking ? "Edit booking" : "Create booking";
    return <button aria-label={label}>{label}</button>;
  };
  return { BookingModal };
});

vi.mock("@components/Card", () => ({
  Card: ({ children }: PropsWithChildren) => <div data-testid="card">{children}</div>,
}));

vi.mock("@components/TextWithIcon", () => ({
  TextWithIcon: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

describe("Component: BookingList", () => {
  beforeEach(() => {
    mockBookings = [];
    dispatchMock.mockClear();
  });

  it("should render empty state with create CTA when there are no bookings", () => {
    mockBookings = [];
    renderWithTheme(<BookingList />);

    expect(screen.getByText("No bookings found")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting the filters or create a new booking.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create booking" })).toBeInTheDocument();
  });

  it("should render each booking dates", () => {
    mockBookings = [
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
        startDate: "2025-11-02",
        endDate: "2025-11-06",
      },
    ];

    renderWithTheme(<BookingList />);

    const cards = screen.getAllByTestId("card");
    expect(cards).toHaveLength(2);

    const [firstCard, secondCard] = cards;

    const firstDatesLabel = within(firstCard).getByText("Dates");
    const firstDatesText = firstDatesLabel.parentElement?.querySelector("span")?.textContent ?? "";
    expect(firstDatesText).toContain("Oct 1");
    expect(firstDatesText).toContain("Oct 5, 2025");

    const secondDatesLabel = within(secondCard).getByText("Dates");
    const secondDatesText = secondDatesLabel.parentElement?.querySelector("span")?.textContent ?? "";
    expect(secondDatesText).toContain("Nov 2");
    expect(secondDatesText).toContain("Nov 6, 2025");
  });

  it("should dispatch delete action when clicking Delete", () => {
    mockBookings = [
      {
        id: "b1",
        guestName: "Alice",
        property: "House Beach",
        startDate: "2025-10-01",
        endDate: "2025-10-05",
      },
    ];

    renderWithTheme(<BookingList />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(dispatchMock).toHaveBeenCalledWith({
      type: "booking/deleteBooking",
      payload: { id: "b1" },
    });
  });

  it("should show an edit modal trigger for each row", () => {
    mockBookings = [
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
        startDate: "2025-11-02",
        endDate: "2025-11-06",
      },
    ];

    renderWithTheme(<BookingList />);

    const editButtons = screen.getAllByRole("button", { name: "Edit booking" });
    expect(editButtons).toHaveLength(2);
  });
});
