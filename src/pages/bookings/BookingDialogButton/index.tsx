import { DatePicker } from "@components/Input/DatePicker";
import { Modal } from "@components/Modal";
import { useAppSelector } from "@hooks/useAppSelector";
import { useBookingForm } from "@hooks/useBookingForm";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField,
} from "@mui/material";
import { createBooking, updateBooking } from "@store/slices/booking";
import type { Booking } from "@store/slices/types";
import { formatDateISO, parseDateOnly } from "@utils/date";
import { ensureChronologicalOrder, ensureDateRangePresent, ensureNoOverlapForProperty, ensureStartDateNotInPast, runValidatorsInOrder } from "@utils/validation/booking";
import type { BookingFormData } from "@utils/validation/bookingSchema";
import { useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useDispatch } from "react-redux";
import { PROPERTY_OPTIONS } from "../../../constants/properties";
import { BookingForm } from "./styles";

type BookingDialogButtonProps = {
  existingBooking?: Booking;
  defaultBookigValues?: Partial<Booking>;
  enableCreateBooking?: boolean;
};

export function BookingDialogButton({ existingBooking, defaultBookigValues, enableCreateBooking }: BookingDialogButtonProps) {
  const dispatch = useDispatch();
  const bookings = useAppSelector((state) => state.booking.bookings);
  const filterBookingProperty = useAppSelector((state) => state.booking.filters.property);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const { control, handleSubmit, reset, setError } = useBookingForm();
  const selectedProperty = useWatch({ control, name: "bookingProperty" });

  const isEdit = Boolean(existingBooking);

  const handleOpenCreateBooking = () => {
    setBookingModalOpen(true);

    if (isEdit) {
      reset({
        bookingGuestName: existingBooking?.guestName,
        bookingProperty: existingBooking?.property,
        bookingDates: {
          from: parseDateOnly(existingBooking!.startDate),
          to: parseDateOnly(existingBooking!.endDate),
        },
      });
    }
    else {
      const { startDate, endDate } = defaultBookigValues || {};
      let bookingDates = undefined;

      if (enableCreateBooking) {
        bookingDates = {
          from: parseDateOnly(startDate!),
          to: parseDateOnly(endDate!),
        };
      }
      console.log(bookingDates);
      reset({
        bookingGuestName: "",
        bookingProperty: filterBookingProperty || "",
        bookingDates,
      });
    }
  };

  const handleCloseCreateBooking = () => {
    setBookingModalOpen(false);
  };

  const handleCreateBooking = (bookigFormData: BookingFormData) => {
    const { bookingGuestName, bookingProperty, bookingDates } = bookigFormData;

    const bookingStartDate = bookingDates?.from;
    const bookingEndDate = bookingDates?.to;

    const bookingDatesValidationResult = runValidatorsInOrder(
      () => ensureDateRangePresent(bookingStartDate, bookingEndDate),
      () => ensureChronologicalOrder(bookingStartDate, bookingEndDate),
      () => ensureStartDateNotInPast(bookingStartDate),
      () => ensureNoOverlapForProperty({
        startDate: bookingStartDate!,
        endDate: bookingEndDate!,
        property: bookingProperty,
        existingBookings: bookings,
        ignoreBookingId: isEdit ? existingBooking?.id : undefined,
        ignorePastBookings: true,
      }),
    );

    if (bookingDatesValidationResult.error) {
      setError("bookingDates", { message: bookingDatesValidationResult.message });
      return;
    }

    const bookingPayload: Booking = {
      id: isEdit ? existingBooking!.id : `bkg_${Date.now()}`,
      guestName: bookingGuestName,
      property: bookingProperty,
      startDate: formatDateISO(bookingStartDate),
      endDate: formatDateISO(bookingEndDate),
    };

    if (isEdit)
      dispatch(updateBooking(bookingPayload));
    else
      dispatch(createBooking(bookingPayload));

    reset();
    setBookingModalOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={isEdit ? <EditIcon /> : <AddIcon />}
        size={isEdit ? "small" : "medium"}
        onClick={handleOpenCreateBooking}
        disabled={enableCreateBooking && (!defaultBookigValues?.startDate || !defaultBookigValues?.startDate)}
      >
        {isEdit ? "Edit" : "Create booking"}
      </Button>

      <Modal
        open={bookingModalOpen}
        onClose={handleCloseCreateBooking}
        title={isEdit ? "Update booking" : "Create booking"}
        subtitle={isEdit
          ? "Adjust the fields below to update this booking."
          : "Fill the fields below to create a new booking."}
        maxWidth="xs"
        actions={(
          <>
            <Button onClick={handleCloseCreateBooking}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit(handleCreateBooking)}>
              {isEdit ? "Save" : "Create"}
            </Button>
          </>
        )}
      >
        <BookingForm>
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
        </BookingForm>
      </Modal>
    </>
  );
}
