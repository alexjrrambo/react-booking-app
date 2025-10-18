import { Modal } from "@components/Modal";
import { BookingModal } from "@components/Modal/Booking";
import { usePropertyBookedDates } from "@hooks/usePropertyBookedDates";
import { Button, TextField } from "@mui/material";
import { formatBookingRange, formatDateISO } from "@utils/date";
import { useEffect, useState, type ReactNode } from "react";
import type { DateRange } from "react-day-picker";
import { DatePickerContainer, DatePickerModalActions, StyledDatePicker } from "./styles";

type DatePickerProps = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabledBefore?: boolean;
  error?: boolean;
  modalTitle?: string;
  modalSubtitle?: string;
  property?: string;
  enableCreateBooking?: boolean;
  trigger?: (args: {
    open: () => void;
    displayedValue: string;
  }) => ReactNode;
};

export function DatePicker({
  value,
  onChange = () => {},
  label,
  helperText,
  required,
  disabledBefore,
  error,
  modalTitle = "Select booking dates",
  modalSubtitle = "Choose the check-in and check-out dates for the booking.",
  property = "",
  enableCreateBooking,
  trigger,
}: DatePickerProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isBookingDatesConfirmed, setIsbookingDatesConfirmed] = useState(false);
  const [datePickerDates, setDatePickerDates] = useState<DateRange | undefined>();
  const propertyBookedDates = usePropertyBookedDates(property);

  useEffect(() => {
    if (value) {
      setDatePickerDates(value);
      setIsbookingDatesConfirmed(Boolean(value.from && value.to));
    }
    else {
      setDatePickerDates(undefined);
      setIsbookingDatesConfirmed(false);
    }
  }, [value]);

  const handleOpenDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const handleCloseDatePicker = () => {
    if (!isBookingDatesConfirmed || enableCreateBooking) {
      setIsbookingDatesConfirmed(false);
      setDatePickerDates(undefined);
      onChange(undefined);
    }

    setIsDatePickerOpen(false);
  };

  const handleClearDatePicker = () => {
    setDatePickerDates(undefined);
    setIsbookingDatesConfirmed(false);

    onChange(undefined);
  };

  const handleDatePickerSelect = (selectedDates: DateRange | undefined) => {
    if (isBookingDatesConfirmed) {
      setDatePickerDates(undefined);
      setIsbookingDatesConfirmed(false);
      onChange(undefined);

      return;
    }

    if (!datePickerDates?.from) {
      setDatePickerDates({ from: selectedDates?.from, to: undefined });
    }
    else {
      const confirmedDates = { from: datePickerDates?.from, to: selectedDates?.to };
      setDatePickerDates(confirmedDates);
      setIsbookingDatesConfirmed(true);

      if (!enableCreateBooking) {
        setIsDatePickerOpen(false);
      }

      onChange(confirmedDates);
    }
  };

  const handleDatePickerPreview = (currentHoverDate: Date) => {
    if (!isBookingDatesConfirmed && datePickerDates?.from) {
      const previewSelectedDates: DateRange = { from: datePickerDates?.from, to: currentHoverDate };
      setDatePickerDates(previewSelectedDates);
    }
  };

  const displayedDate = datePickerDates?.from && datePickerDates?.to
    ? formatBookingRange(datePickerDates.from, datePickerDates.to)
    : "";

  const disabledMatchers = disabledBefore && datePickerDates?.from && !isBookingDatesConfirmed
    ? [{ before: datePickerDates.from }]
    : [];

  const startMonth = isBookingDatesConfirmed && !enableCreateBooking
    ? datePickerDates?.from
    : undefined;

  const bookingStartDateISO = datePickerDates?.from
    ? formatDateISO(datePickerDates.from)
    : "";
  const bookingEndDateISO = datePickerDates?.to
    ? formatDateISO(datePickerDates.to)
    : "";

  return (
    <>
      {trigger
        ? (
            trigger({
              open: handleOpenDatePicker,
              displayedValue: displayedDate || "",
            })
          )
        : (
            <TextField
              value={displayedDate || ""}
              variant="standard"
              required={required}
              label={label}
              size="small"
              fullWidth
              helperText={helperText}
              error={error}
              slotProps={{ input: { readOnly: true } }}
              focused={false}
              onClick={handleOpenDatePicker}
            />
          )}

      <Modal
        open={isDatePickerOpen}
        onClose={handleCloseDatePicker}
        title={modalTitle}
        subtitle={modalSubtitle}
        maxWidth="md"
        fullWidth={false}
        actions={(
          <DatePickerModalActions>
            <Button
              variant="text"
              id="date-picker-clear-dates-button"
              onClick={handleClearDatePicker}
            >
              Clear dates
            </Button>
            <div>
              <Button variant="text" onClick={handleCloseDatePicker}>Close</Button>
              {enableCreateBooking && (
                <BookingModal
                  defaultBookingValues={{
                    property,
                    startDate: bookingStartDateISO,
                    endDate: bookingEndDateISO,
                  }}
                  disableCreateBookingWithCalendar={!isBookingDatesConfirmed}
                  onSave={handleCloseDatePicker}
                />
              )}
            </div>
          </DatePickerModalActions>
        )}
      >
        <DatePickerContainer>
          <StyledDatePicker
            disabled={[...disabledMatchers, ...propertyBookedDates]}
            numberOfMonths={2}
            onDayMouseEnter={handleDatePickerPreview}
            selected={datePickerDates}
            onSelect={handleDatePickerSelect}
            startMonth={startMonth}
            mode="range"
            modifiers={{ booked: propertyBookedDates }}
            modifiersClassNames={{ booked: "my-booked-class" }}
          />
        </DatePickerContainer>
      </Modal>
    </>
  );
}
