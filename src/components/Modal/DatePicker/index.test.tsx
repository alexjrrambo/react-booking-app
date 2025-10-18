import { renderWithTheme } from "@test/renderWithTheme";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { formatBookingRange } from "@utils/date";
import React from "react";
import type { DateRange } from "react-day-picker";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DatePickerModal } from "./index";

type StyledDatePickerProps = {
  disabled?: unknown[];
  numberOfMonths?: number;
  onDayMouseEnter?: (date: Date) => void;
  selected?: DateRange | undefined;
  onSelect?: (range: DateRange | undefined) => void;
  startMonth?: Date | undefined;
  mode?: "range";
  modifiers?: Record<string, unknown>;
  modifiersClassNames?: Record<string, string>;
};

vi.mock("@hooks/usePropertyBookedDates", () => ({
  usePropertyBookedDates: () => [] as Date[],
}));

vi.mock("@components/Modal", () => {
  const Modal: React.FC<{
    open: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
    maxWidth?: string;
    fullWidth?: boolean;
    children?: React.ReactNode;
  }> = ({ open, title, subtitle, actions, children }) => {
    if (!open) {
      return null;
    }
    return (
      <div role="dialog" aria-label={title ?? "Dialog"}>
        {title ? <h2>{title}</h2> : null}
        {subtitle ? <p>{subtitle}</p> : null}
        <div data-testid="modal-content">{children}</div>
        <div data-testid="modal-actions">{actions}</div>
      </div>
    );
  };
  return { Modal };
});

vi.mock("@components/Modal/Booking", () => {
  const BookingModal: React.FC<{
    defaultBookingValues?: { property?: string; startDate?: string; endDate?: string };
    disableCreateBookingWithCalendar?: boolean;
    onSave?: () => void;
  }> = ({ disableCreateBookingWithCalendar, onSave }) => {
    return (
      <button
        type="button"
        data-testid="booking-modal"
        disabled={Boolean(disableCreateBookingWithCalendar)}
        onClick={() => onSave?.()}
      >
        Book
      </button>
    );
  };
  return { BookingModal };
});

vi.mock("./styles", () => {
  const DatePickerContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div data-testid="date-picker-container">{children}</div>
  );

  const DatePickerModalActions: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div data-testid="date-picker-actions">{children}</div>
  );

  const StyledDatePicker: React.FC<StyledDatePickerProps> = ({ onSelect, onDayMouseEnter }) => {
    const first = new Date("2025-10-10");
    const second = new Date("2025-10-12");

    return (
      <div data-testid="styled-daypicker">
        <button
          type="button"
          data-testid="select-first"
          onClick={() => onSelect?.({ from: first, to: undefined })}
        >
          Select first
        </button>
        <button
          type="button"
          data-testid="select-second"
          onClick={() => onSelect?.({ from: first, to: second })}
        >
          Select second
        </button>
        <button
          type="button"
          data-testid="hover-second"
          onMouseEnter={() => onDayMouseEnter?.(second)}
        >
          Hover second
        </button>
        <button
          type="button"
          data-testid="reselect"
          onClick={() => onSelect?.({ from: new Date("2025-10-15"), to: undefined })}
        >
          Reselect
        </button>
      </div>
    );
  };

  return { DatePickerContainer, DatePickerModalActions, StyledDatePicker };
});

describe("Component: DatePickerModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render TextField trigger and open the modal on click", () => {
    renderWithTheme(<DatePickerModal label="When?" />);
    const trigger = screen.getByRole("textbox");
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Select booking dates" })).toBeInTheDocument();
    expect(screen.getByTestId("styled-daypicker")).toBeInTheDocument();
  });

  it("should allow custom trigger and show displayed value", () => {
    const range: DateRange = { from: new Date("2025-10-10"), to: new Date("2025-10-12") };
    const formatted = formatBookingRange(range.from!, range.to!);

    renderWithTheme(
      <DatePickerModal
        value={range}
        trigger={({ open, displayedValue }) => (
          <button
            type="button"
            onClick={open}
            aria-label="Open calendar"
          >
            <span data-testid="displayed">{displayedValue}</span>
          </button>
        )}
      />,
    );

    expect(screen.getByTestId("displayed")).toHaveTextContent(formatted);
    fireEvent.click(screen.getByLabelText("Open calendar"));
    expect(screen.getByRole("dialog", { name: "Select booking dates" })).toBeInTheDocument();
  });

  it("should select range (two clicks) and call onChange with confirmed dates, closing the modal", async () => {
    const onChange = vi.fn();
    renderWithTheme(<DatePickerModal onChange={onChange} />);

    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByTestId("select-first"));
    fireEvent.click(screen.getByTestId("select-second"));

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        from: new Date("2025-10-10"),
        to: new Date("2025-10-12"),
      });
    });

    expect(screen.queryByRole("dialog", { name: "Select booking dates" })).not.toBeInTheDocument();
  });

  it("should keep modal open after confirming when enableCreateBooking is true", async () => {
    const onChange = vi.fn();
    renderWithTheme(<DatePickerModal onChange={onChange} enableCreateBooking />);

    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByTestId("select-first"));
    fireEvent.click(screen.getByTestId("select-second"));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });

    expect(screen.getByRole("dialog", { name: "Select booking dates" })).toBeInTheDocument();
  });

  it("should clear dates via Clear dates button and call onChange(undefined)", async () => {
    const onChange = vi.fn();
    renderWithTheme(<DatePickerModal onChange={onChange} />);

    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByTestId("select-first"));
    fireEvent.click(screen.getByTestId("select-second"));

    await waitFor(() => expect(onChange).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("textbox"));

    fireEvent.click(screen.getByRole("button", { name: "Clear dates" }));
    expect(onChange).toHaveBeenLastCalledWith(undefined);
  });

  it("should show BookingModal action when enableCreateBooking and disable it until range confirmed", () => {
    renderWithTheme(<DatePickerModal enableCreateBooking property="House Beach" />);

    fireEvent.click(screen.getByRole("textbox"));

    const bookingBtnDisabled = screen.getByTestId("booking-modal");
    expect(bookingBtnDisabled).toBeDisabled();

    fireEvent.click(screen.getByTestId("select-first"));
    fireEvent.click(screen.getByTestId("select-second"));

    const bookingBtnEnabled = screen.getByTestId("booking-modal");
    expect(bookingBtnEnabled).not.toBeDisabled();
  });

  it("should reset selection when user reselects after confirmation", () => {
    renderWithTheme(<DatePickerModal />);

    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByTestId("select-first"));
    fireEvent.click(screen.getByTestId("select-second"));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).not.toBe("");

    fireEvent.click(input);

    fireEvent.click(screen.getByTestId("reselect"));
    expect(input.value).toBe("");
  });

  it("should show formatted value in the field once range is confirmed (controlled)", () => {
    const controlled: DateRange = {
      from: new Date("2025-10-10"),
      to: new Date("2025-10-12"),
    };
    const expected = formatBookingRange(controlled.from!, controlled.to!);

    renderWithTheme(<DatePickerModal value={controlled} label="When?" />);
    const input = screen.getByLabelText("When?", { exact: false }) as HTMLInputElement;
    expect(input.value).toBe(expected);
  });
});
