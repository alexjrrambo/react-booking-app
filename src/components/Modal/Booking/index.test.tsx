import type { Booking } from "@store/booking/types";
import { renderWithTheme } from "@test/renderWithTheme";
import { fireEvent, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BookingModal } from "./index";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
};

type BookingFormProps = {
  mode: "create" | "edit";
  defaultBookingValues?: Partial<Booking>;
  onSubmit?: (payload: unknown) => void;
  onCancel?: () => void;
};

vi.mock("@components/Modal", () => {
  const Modal = ({ open, onClose, title, subtitle, children }: ModalProps) =>
    open
      ? (
          <div aria-label="booking-modal">
            {title ? <h2>{title}</h2> : null}
            {subtitle ? <p>{subtitle}</p> : null}
            <button onClick={onClose}>close</button>
            {children}
          </div>
        )
      : null;

  return { Modal };
});

vi.mock("@components/Form/Booking", () => {
  const BookingForm = ({
    mode,
    defaultBookingValues,
    onSubmit,
    onCancel,
  }: BookingFormProps) => (
    <div data-testid="booking-form">
      <pre data-testid="booking-form-defaults">
        {JSON.stringify(defaultBookingValues ?? {})}
      </pre>
      <button onClick={() => onSubmit?.({})}>mock-submit</button>
      <button onClick={() => onCancel?.()}>mock-cancel</button>
      <div data-testid="booking-form-mode">{mode}</div>
    </div>
  );

  return { BookingForm };
});

describe("Component: BookingModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render Create trigger and open modal on click", () => {
    renderWithTheme(<BookingModal onSave={() => {}} />);
    const trigger = screen.getByRole("button", { name: "Create booking" });
    fireEvent.click(trigger);
    const modal = screen.getByLabelText("booking-modal");
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText("Fill the fields below to create a new booking.")).toBeInTheDocument();
  });

  it("should render Edit trigger when existingBooking is provided", () => {
    const existingBooking: Booking = {
      id: "b1",
      guestName: "Alice",
      property: "House Beach",
      startDate: "2025-10-01",
      endDate: "2025-10-05",
    };
    renderWithTheme(<BookingModal existingBooking={existingBooking} onSave={() => {}} />);
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("should pass defaultBookingValues to BookingForm in create mode", () => {
    const defaults: Partial<Booking> = {
      property: "Mountain Cabin",
      startDate: "2025-10-10",
      endDate: "2025-10-12",
    };
    renderWithTheme(<BookingModal defaultBookingValues={defaults} onSave={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Create booking" }));
    const json = screen.getByTestId("booking-form-defaults").textContent;
    expect(json).toBe(JSON.stringify(defaults));
    expect(screen.getByTestId("booking-form-mode").textContent).toBe("create");
  });

  it("should disable trigger when disableCreateBookingWithCalendar is true", () => {
    renderWithTheme(<BookingModal disableCreateBookingWithCalendar onSave={() => {}} />);
    const trigger = screen.getByRole("button", { name: "Create booking" });
    expect(trigger).toBeDisabled();
  });

  it("should call onSave and close modal after form submit", () => {
    const onSave = vi.fn();
    renderWithTheme(<BookingModal onSave={onSave} />);
    fireEvent.click(screen.getByRole("button", { name: "Create booking" }));
    fireEvent.click(screen.getByText("mock-submit"));
    expect(onSave).toHaveBeenCalled();
    expect(screen.queryByLabelText("booking-modal")).not.toBeInTheDocument();
  });

  it("should call onSave and close modal after form cancel", () => {
    const onSave = vi.fn();
    renderWithTheme(<BookingModal onSave={onSave} />);
    fireEvent.click(screen.getByRole("button", { name: "Create booking" }));
    fireEvent.click(screen.getByText("mock-cancel"));
    expect(onSave).toHaveBeenCalled();
    expect(screen.queryByLabelText("booking-modal")).not.toBeInTheDocument();
  });

  it("should render edit title and subtitle when editing", () => {
    const existingBooking: Booking = {
      id: "b1",
      guestName: "Alice",
      property: "House Beach",
      startDate: "2025-10-01",
      endDate: "2025-10-05",
    };
    renderWithTheme(<BookingModal existingBooking={existingBooking} onSave={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    const modal = screen.getByLabelText("booking-modal");
    expect(within(modal).getByText("Update booking")).toBeInTheDocument();
    expect(within(modal).getByText("Adjust the fields below to update this booking.")).toBeInTheDocument();
  });

  it("should render create title and subtitle when creating", () => {
    renderWithTheme(<BookingModal onSave={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Create booking" }));
    const modal = screen.getByLabelText("booking-modal");
    expect(within(modal).getByText("Create booking")).toBeInTheDocument();
    expect(within(modal).getByText("Fill the fields below to create a new booking.")).toBeInTheDocument();
  });
});
