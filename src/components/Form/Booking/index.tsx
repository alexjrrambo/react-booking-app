import { DatePicker } from "@components/Modal/DatePicker";
import { useAppSelector } from "@hooks/useAppSelector";
import { useBookingForm } from "@hooks/useBookingForm";
import {
  Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField,
} from "@mui/material";
import { createBooking, updateBooking } from "@store/slices/booking";
import type { Booking } from "@store/slices/types";
import { formatDateISO, parseDateOnly } from "@utils/date";
import { executeBookingValidators } from "@utils/validation/booking";
import type { BookingFormData } from "@utils/validation/bookingSchema";
import { useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useDispatch } from "react-redux";
import { PROPERTY_OPTIONS } from "../../../constants/properties";
import { BookingFormActions, BookingFormContainer } from "./styles";

type BookingFormProps = {
  mode: "create" | "edit";
  defaultBookingValues?: Partial<Booking>;
  onSubmit: (bookingFormData: BookingFormData) => void;
  onCancel: () => void;
};

export function BookingForm({ mode, defaultBookingValues, onSubmit = () => {}, onCancel }: BookingFormProps) {
  const dispatch = useDispatch();
  const bookings = useAppSelector((state) => state.booking.bookings);
  const { control, handleSubmit, reset, setError } = useBookingForm();
  const selectedProperty = useWatch({ control, name: "bookingProperty" });

  useEffect(() => {
    const { startDate, endDate } = defaultBookingValues || {};
    let bookingDates = undefined;

    if (startDate && endDate) {
      bookingDates = {
        from: parseDateOnly(startDate!),
        to: parseDateOnly(endDate!),
      };
    }

    reset({
      bookingGuestName: defaultBookingValues?.guestName || "",
      bookingProperty: defaultBookingValues?.property || "",
      bookingDates,
    });
  }, [defaultBookingValues, reset]);

  const handleBookingSubmit = (bookingFormData: BookingFormData) => {
    const { bookingGuestName, bookingProperty, bookingDates } = bookingFormData;
    const { from: bookingStartDate, to: bookingEndDate } = bookingDates ?? {};
    const isEdit = mode === "edit";

    const bookingDatesValidationResult = executeBookingValidators({
      startDate: bookingStartDate,
      endDate: bookingEndDate,
      property: bookingProperty,
      existingBookings: bookings,
      ignoreBookingId: isEdit ? defaultBookingValues?.id : undefined,
      ignorePastBookings: true,
    });

    if (bookingDatesValidationResult.error) {
      setError("bookingDates", { message: bookingDatesValidationResult.message });
      return;
    }

    const bookingPayload: Booking = {
      id: defaultBookingValues?.id ?? `bkg_${Date.now()}`,
      guestName: bookingGuestName,
      property: bookingProperty,
      startDate: formatDateISO(bookingStartDate),
      endDate: formatDateISO(bookingEndDate),
    };

    dispatch(isEdit ? updateBooking(bookingPayload) : createBooking(bookingPayload));

    reset();
    onSubmit(bookingFormData);
  };

  return (
    <BookingFormContainer>
      <Controller
        name="bookingGuestName"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            variant="standard"
            required
            label="Guest name"
            size="small"
            fullWidth
            helperText={fieldState.error?.message || "Enter the guest's full name."}
            error={Boolean(fieldState.error)}
          />
        )}
      />

      <Controller
        name="bookingProperty"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl
            variant="standard"
            required
            error={Boolean(fieldState.error)}
          >
            <InputLabel id="property-select-label">Property</InputLabel>
            <Select
              {...field}
              labelId="property-select-label"
              size="small"
              fullWidth
            >
              {PROPERTY_OPTIONS.map((propertyData) => <MenuItem key={propertyData.value} value={propertyData.value}>{propertyData.label}</MenuItem>)}
            </Select>
            <FormHelperText>
              {fieldState.error?.message || "Select the property you want to book."}
            </FormHelperText>
          </FormControl>
        )}
      />

      <Controller
        name="bookingDates"
        control={control}
        render={({ field, fieldState }) => (
          <DatePicker
            error={Boolean(fieldState.error)}
            value={field.value}
            onChange={field.onChange}
            label="When?"
            helperText={fieldState.error?.message || "Select your check-in and check-out dates"}
            required
            disabledBefore
            property={selectedProperty}
          />
        )}
      />
      <BookingFormActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(handleBookingSubmit)}>
          {mode === "edit" ? "Save" : "Create"}
        </Button>
      </BookingFormActions>
    </BookingFormContainer>
  );
}
