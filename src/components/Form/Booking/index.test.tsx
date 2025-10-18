import { renderWithTheme } from "@test/renderWithTheme";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { executeBookingValidators } from "@utils/validation/booking/validators";
import React from "react";
import type { DateRange } from "react-day-picker";
import * as ReactRedux from "react-redux";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { BookingForm } from "./index";

type BookingValidationResult = { error: boolean; message: string };

type MockDatePickerProps = {
  onChange?: (range: DateRange | undefined) => void;
  helperText?: string;
  error?: boolean;
};

vi.mock("@components/Modal/DatePicker", () => {
  const MockDatePicker: React.FC<MockDatePickerProps> = ({ onChange, error, helperText }) => (
    <div>
      <button
        type="button"
        data-testid="mock-date-picker"
        onClick={() =>
          onChange?.({
            from: new Date("2025-10-10"),
            to: new Date("2025-10-12"),
          })}
      >
        Pick dates
      </button>
      {error ? <p>{helperText}</p> : null}
    </div>
  );

  return {
    DatePickerModal: MockDatePicker,
  };
});

vi.mock("@utils/validation/booking/validators", () => ({
  executeBookingValidators: vi.fn(
    (): BookingValidationResult => ({ error: false, message: "" }),
  ),
}));

vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof ReactRedux>("react-redux");
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

describe("Component: BookingForm", () => {
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (ReactRedux.useDispatch as unknown as Mock).mockReturnValue(dispatchMock);
    (ReactRedux.useSelector as unknown as Mock).mockImplementation(
      (selectorFn: (state: unknown) => unknown) =>
        selectorFn({
          booking: {
            bookings: [
              {
                id: "b1",
                guestName: "Alice",
                property: "House Beach",
                startDate: "2025-10-01",
                endDate: "2025-10-05",
              },
            ],
          },
        }),
    );
  });

  it("should render empty defaults in create mode", () => {
    renderWithTheme(
      <BookingForm
        mode="create"
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByLabelText("Guest name", { exact: false })).toHaveValue("");
    expect(screen.getByText("Pick dates")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("should prefill fields in edit mode and dispatch update", async () => {
    renderWithTheme(
      <BookingForm
        mode="edit"
        defaultBookingValues={{
          id: "b2",
          guestName: "Bob",
          property: "Mountain Cabin",
          startDate: "2025-10-10",
          endDate: "2025-10-12",
        }}
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(screen.getByLabelText("Guest name", { exact: false })).toHaveValue("Bob");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: "booking/updateBooking" }),
      );
    });
  });

  it("should dispatch createBooking on valid submit", async () => {
    renderWithTheme(
      <BookingForm
        mode="create"
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    );
    fireEvent.change(screen.getByLabelText("Guest name", { exact: false }), {
      target: { value: "Charlie" },
    });

    fireEvent.mouseDown(screen.getByLabelText("Property", { exact: false }));
    const option = await screen.findByRole("option", {
      name: /House Beach|Mountain Cabin/i,
    });
    fireEvent.click(option);

    fireEvent.click(screen.getByTestId("mock-date-picker"));
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "booking/createBooking",
          payload: expect.objectContaining({
            guestName: "Charlie",
            property: expect.any(String),
            startDate: expect.any(String),
            endDate: expect.any(String),
          }),
        }),
      );
    });
  });

  it("should NOT dispatch when validators fail and should show error", async () => {
    (executeBookingValidators as unknown as Mock).mockReturnValueOnce({
      error: true,
      message: "Invalid range",
    } as BookingValidationResult);

    renderWithTheme(
      <BookingForm
        mode="create"
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    );

    fireEvent.change(screen.getByLabelText("Guest name", { exact: false }), {
      target: { value: "Dora" },
    });

    fireEvent.mouseDown(screen.getByLabelText("Property", { exact: false }));
    const option = await screen.findByRole("option", {
      name: /House Beach|Mountain Cabin/i,
    });
    fireEvent.click(option);

    fireEvent.click(screen.getByTestId("mock-date-picker"));
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(dispatchMock).not.toHaveBeenCalled();
    });

    expect(await screen.findByText("Invalid range")).toBeInTheDocument();
  });

  it("should call onCancel when Cancel is clicked", () => {
    const onCancel = vi.fn();
    renderWithTheme(
      <BookingForm
        mode="create"
        onSubmit={() => {}}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });
});
