import { Modal } from "@components/Modal";
import { BookingModal } from "@components/Modal/Booking";
import { usePropertyBookedDates } from "@hooks/usePropertyBookedDates";
import { Button, TextField } from "@mui/material";
import { formatBookingRange, formatDateISO } from "@utils/date";
import { useEffect, useState, type ReactNode } from "react";
import type { DateRange } from "react-day-picker";
import { DatePickerContainer, StyledDatePicker } from "./styles";

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
  onChange,
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
  const [isBookingRangeConfirmed, setIsBookingRangeConfirmed] = useState(false);
  const [datePickerDates, setDatePickerDates] = useState<DateRange | undefined>();
  const propertyBookedDates = usePropertyBookedDates(property);

  useEffect(() => {
    if (value) {
      setDatePickerDates(value);
      setIsBookingRangeConfirmed(Boolean(value.from && value.to));
    }
    else {
      setDatePickerDates(undefined);
      setIsBookingRangeConfirmed(false);
    }
  }, [value]);

  const handleOpenDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const handleCloseDatePicker = () => {
    setIsDatePickerOpen(false);

    if (!isBookingRangeConfirmed || enableCreateBooking) {
      setDatePickerDates(undefined);

      if (onChange) {
        onChange(undefined);
      }
    }
  };

  const handleClearDatePicker = () => {
    setDatePickerDates(undefined);
    setIsBookingRangeConfirmed(false);

    if (onChange) {
      onChange(undefined);
    }
  };

  const handleDatePickerSelect = (selectedDates: DateRange | undefined) => {
    if (isBookingRangeConfirmed) {
      setDatePickerDates(undefined);
      setIsBookingRangeConfirmed(false);

      if (onChange) {
        onChange(undefined);
      }
      return;
    }

    if (!datePickerDates?.from) {
      setDatePickerDates({ from: selectedDates?.from, to: undefined });
    }
    else {
      const confirmedDates = { from: datePickerDates?.from, to: selectedDates?.to };
      setDatePickerDates(confirmedDates);
      setIsBookingRangeConfirmed(true);

      if (!enableCreateBooking) {
        setIsDatePickerOpen(false);
      }

      if (onChange) {
        onChange(confirmedDates);
      }
    }
  };

  const handleDatePickerPreview = (currentHoverDate: Date) => {
    if (!isBookingRangeConfirmed && datePickerDates?.from) {
      const previewSelectedDates: DateRange = { from: datePickerDates?.from, to: currentHoverDate };
      setDatePickerDates(previewSelectedDates);
    }
  };

  const displayedDate = (datePickerDates?.from && datePickerDates?.to)
    ? formatBookingRange(datePickerDates.from, datePickerDates.to)
    : null;

  const disabledMatchers = disabledBefore && datePickerDates?.from && !isBookingRangeConfirmed
    ? { before: datePickerDates.from }
    : [];

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
          <>
            <Button variant="text" onClick={handleClearDatePicker}>Clear dates</Button>
            <Button variant="outlined" onClick={handleCloseDatePicker}>Close</Button>
            {enableCreateBooking && (
              <BookingModal
                defaultBookingValues={{
                  property,
                  startDate: datePickerDates?.from
                    ? formatDateISO(datePickerDates.from)
                    : "",
                  endDate: datePickerDates?.to
                    ? formatDateISO(datePickerDates.to)
                    : "" }}
                enableCreateBooking
              />
            )}
          </>
        )}
      >
        <DatePickerContainer>
          <StyledDatePicker
            disabled={[
              ...([disabledMatchers]),
              ...propertyBookedDates,
            ]}
            numberOfMonths={2}
            onDayMouseEnter={handleDatePickerPreview}
            selected={datePickerDates}
            onSelect={handleDatePickerSelect}
            startMonth={(isBookingRangeConfirmed && !enableCreateBooking) ? datePickerDates?.from : undefined}
            mode="range"
            modifiers={{
              booked: propertyBookedDates,
            }}
            modifiersClassNames={{
              booked: "my-booked-class",
            }}
          />
        </DatePickerContainer>
      </Modal>
    </>
  );
}
