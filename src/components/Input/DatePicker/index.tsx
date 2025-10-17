import { Modal } from "@components/Modal";
import { Button, TextField } from "@mui/material";
import { formatBookingRange } from "@utils/date";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { DatePickerContainer, StyledDatePicker } from "./styles";

type DatePickerProps = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  disabledBefore?: boolean;
  error?: boolean;
};

export function DatePicker({
  value,
  onChange,
  label,
  helperText,
  required,
  disabled,
  disabledBefore,
  error,
}: DatePickerProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isBookingRangeConfirmed, setIsBookingRangeConfirmed] = useState(false);
  const [datePickerDates, setDatePickerDates] = useState<DateRange | undefined>();

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
    if (!disabled) setIsDatePickerOpen(true);
  };

  const handleCloseDatePicker = () => {
    setIsDatePickerOpen(false);
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
      setIsDatePickerOpen(false);
      setIsBookingRangeConfirmed(true);

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
    : undefined;

  return (
    <>
      <TextField
        value={displayedDate || ""}
        variant="standard"
        required={required}
        disabled={disabled}
        label={label}
        size="small"
        fullWidth
        helperText={helperText}
        error={error}
        slotProps={{ input: { readOnly: true } }}
        focused={false}
        onClick={handleOpenDatePicker}
      />

      <Modal
        open={isDatePickerOpen}
        onClose={handleCloseDatePicker}
        title="Select booking dates"
        subtitle="Choose the start and end dates for the booking."
        maxWidth="md"
        fullWidth={false}
        actions={(
          <>
            <Button
              variant="text"
              onClick={handleClearDatePicker}
            >
              Clear dates
            </Button>
            <Button variant="outlined" onClick={handleCloseDatePicker}>Close</Button>
          </>
        )}
      >
        <DatePickerContainer>
          <StyledDatePicker
            disabled={disabledMatchers}
            numberOfMonths={2}
            onDayMouseEnter={handleDatePickerPreview}
            selected={datePickerDates}
            onSelect={handleDatePickerSelect}
            startMonth={isBookingRangeConfirmed ? datePickerDates?.from : undefined}
            mode="range"
          />
        </DatePickerContainer>
      </Modal>
    </>
  );
}
