import { renderWithTheme } from "@test/renderWithTheme";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import React from "react";
import * as ReactRedux from "react-redux";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { BookingFilterHeader } from "./index";

type DateRange = { from?: Date; to?: Date };

type DatePickerModalProps = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  trigger: (args: { open: () => void; displayedValue: string }) => React.ReactNode;
};

vi.mock("@components/Modal/DatePicker", () => {
  const DatePickerModal = ({ value, onChange, trigger }: DatePickerModalProps) => {
    const displayedValue
      = value?.from && value?.to ? "Oct 10 – Oct 12, 2025" : "";
    const open = () =>
      onChange?.({
        from: new Date(2025, 9, 10),
        to: new Date(2025, 9, 12),
      });
    const Trigger = trigger({ open, displayedValue });
    return <div data-testid="mock-date-picker">{Trigger}</div>;
  };
  return { DatePickerModal };
});

vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof ReactRedux>("react-redux");
  return { ...actual, useDispatch: vi.fn() };
});

describe("Component: FilterHeader", () => {
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (ReactRedux.useDispatch as unknown as Mock).mockReturnValue(dispatchMock);
  });

  it("should render default labels", () => {
    renderWithTheme(<BookingFilterHeader />);
    expect(screen.getByText("All dates")).toBeInTheDocument();
    expect(screen.getByText("All properties")).toBeInTheDocument();
  });

  it("should select a property from the menu and update label", async () => {
    renderWithTheme(<BookingFilterHeader />);

    const propertyButton = screen.getByRole("button", { name: "Filter by property" });
    fireEvent.click(propertyButton);

    fireEvent.click(await screen.findByRole("menuitem", { name: "Mountain Cabin" }));

    await waitFor(() => {
      expect(within(propertyButton).getByText("Mountain Cabin")).toBeInTheDocument();
    });
  });

  it("should pick a date range and reflect it in the trigger", () => {
    renderWithTheme(<BookingFilterHeader />);
    fireEvent.click(screen.getByRole("button", { name: "Filter by dates" }));
    expect(screen.getByText("Oct 10 – Oct 12, 2025")).toBeInTheDocument();
  });

  it("should dispatch filters with empty values when nothing is selected", () => {
    renderWithTheme(<BookingFilterHeader />);
    fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "booking/setBookingFilters",
      payload: { property: "", startDate: "", endDate: "" },
    });
  });

  it("should dispatch filters with selected property and date range", async () => {
    renderWithTheme(<BookingFilterHeader />);

    const propertyButton = screen.getByRole("button", { name: "Filter by property" });
    fireEvent.click(propertyButton);
    fireEvent.click(await screen.findByRole("menuitem", { name: "Mountain Cabin" }));

    fireEvent.click(screen.getByRole("button", { name: "Filter by dates" }));
    fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));

    expect(dispatchMock).toHaveBeenCalledWith({
      type: "booking/setBookingFilters",
      payload: {
        property: "Mountain Cabin",
        startDate: "2025-10-10",
        endDate: "2025-10-12",
      },
    });
  });
});
