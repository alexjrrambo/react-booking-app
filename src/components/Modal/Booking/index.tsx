import { BookingForm } from "@components/Form/Booking";
import { Modal } from "@components/Modal";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import type { Booking } from "@store/slices/types";
import { useMemo, useState } from "react";

type BookingDialogButtonProps = {
  existingBooking?: Booking;
  defaultBookingValues?: Partial<Booking>;
  enableCreateBooking?: boolean;
};

export function BookingModal({
  existingBooking,
  defaultBookingValues,
  enableCreateBooking,
}: BookingDialogButtonProps) {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const isEdit = Boolean(existingBooking);

  const disableCreate = useMemo(() => {
    return enableCreateBooking && (!defaultBookingValues?.startDate || !defaultBookingValues?.endDate);
  }, [enableCreateBooking, defaultBookingValues]);

  const handleBookingModalOpen = () => {
    setBookingModalOpen(true);
  };

  const handleBookingModalClose = () => {
    setBookingModalOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={isEdit ? <EditIcon /> : <AddIcon />}
        size={isEdit ? "small" : "medium"}
        onClick={handleBookingModalOpen}
        disabled={isEdit ? false : disableCreate}
      >
        {isEdit ? "Edit" : "Create booking"}
      </Button>

      <Modal
        open={bookingModalOpen}
        onClose={handleBookingModalClose}
        title={isEdit ? "Update booking" : "Create booking"}
        subtitle={
          isEdit
            ? "Adjust the fields below to update this booking."
            : "Fill the fields below to create a new booking."
        }
        maxWidth="xs"
      >
        <BookingForm
          mode={isEdit ? "edit" : "create"}
          defaultBookingValues={isEdit ? existingBooking : defaultBookingValues}
          enableCreateBooking={enableCreateBooking}
          onSubmit={() => handleBookingModalClose()}
          onCancel={handleBookingModalClose}
        />
      </Modal>
    </>
  );
}
