import { useState } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Modal } from "../../../components/Modal";
import { BookingForm } from "./styles";
import { useDispatch } from "react-redux";
import { createBooking } from "../../../store/slices/booking";

export function CreateBookingButton() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleOpenCreateBooking = () => {
    setOpen(true);
  };

  const handleCloseCreateBooking = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    dispatch(createBooking({ id: "bkg_005",
      guestName: "Carlos Souza",
      property: "Property 2",
      startDate: "2025-07-28",
      endDate: "2025-08-02" }));

    setOpen(false);
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
        open={open}
        onClose={handleCloseCreateBooking}
        title="Create booking"
        subtitle="Fill the fields below to create a new booking."
        maxWidth="sm"
        actions={(
          <>
            <Button onClick={handleCloseCreateBooking}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </>
        )}
      >
        <BookingForm>
          <TextField
            variant="standard"
            required
            label="Guest name"
            size="small"
            fullWidth
            helperText="Enter the guest's full name."
          />

          <TextField
            variant="standard"
            required
            label="Property"
            size="small"
            select
            fullWidth
            defaultValue="property-1"
          >
            <MenuItem value="property-1">Property 1</MenuItem>
            <MenuItem value="property-2">Property 2</MenuItem>
          </TextField>

          <TextField
            variant="standard"
            required
            label="Start date"
            size="small"
            fullWidth
            helperText="Check-in date."
          />

          <TextField
            variant="standard"
            required
            label="End date"
            size="small"
            fullWidth
            helperText="Check-out date (must be after start date)."
          />
        </BookingForm>
      </Modal>
    </>
  );
}
