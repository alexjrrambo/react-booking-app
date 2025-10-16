import { DatePicker } from "@components/Input/DatePicker";
import { Modal } from "@components/Modal";
import { useBookingForm } from "@hooks/useBookingForm";
import AddIcon from "@mui/icons-material/Add";
import {
  Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField,
} from "@mui/material";
import { createBooking } from "@store/slices/booking";
import { formatDateISO } from "@utils/date";
import type { BookingFormData } from "@utils/validation/bookingSchema";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { BookingForm } from "./styles";

export function CreateBookingButton() {
  const dispatch = useDispatch();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const { control, handleSubmit, reset } = useBookingForm();

  const handleOpenCreateBooking = () => {
    setBookingModalOpen(true);
  };

  const handleCloseCreateBooking = () => {
    setBookingModalOpen(false);
  };

  const handleCreateBooking = (formData: BookingFormData) => {
    const { bookingGuestName, bookingProperty, bookingDates } = formData;

    dispatch(
      createBooking({
        id: `bkg_${Date.now()}`,
        guestName: bookingGuestName,
        property: bookingProperty,
        startDate: formatDateISO(bookingDates.from),
        endDate: formatDateISO(bookingDates.to),
      }),
    );

    reset();
    setBookingModalOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        size="medium"
        onClick={handleOpenCreateBooking}
      >
        Create booking
      </Button>

      <Modal
        open={bookingModalOpen}
        onClose={handleCloseCreateBooking}
        title="Create booking"
        subtitle="Fill the fields below to create a new booking."
        maxWidth="xs"
        actions={(
          <>
            <Button onClick={handleCloseCreateBooking}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit(handleCreateBooking)}>
              Save
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
                error={!!fieldState.error}
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
                error={!!fieldState.error}
              >
                <InputLabel id="property-select-label">Property</InputLabel>
                <Select
                  {...field}
                  labelId="property-select-label"
                  size="small"
                  fullWidth
                >
                  <MenuItem value="property-1">Property 1</MenuItem>
                  <MenuItem value="property-2">Property 2</MenuItem>
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
                value={field.value}
                onChange={field.onChange}
                label="When?"
                helperText={fieldState.error?.message || "Select your check-in and check-out dates"}
                required
                disabledBefore
              />
            )}
          />
        </BookingForm>
      </Modal>
    </>
  );
}
