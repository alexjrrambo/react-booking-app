import { ButtonResponsiveWithIcon } from "@components/Button";
import { BookingForm } from "@components/Form/Booking";
import { Modal } from "@components/Modal";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import type { Booking } from "@store/slices/types";
import { useState } from "react";

type BookingDialogButtonProps = {
  existingBooking?: Booking;
  defaultBookingValues?: Partial<Booking>;
  disableCreateBookingWithCalendar?: boolean;
  onSave?: () => void;
};

export function BookingModal({
  existingBooking,
  defaultBookingValues,
  disableCreateBookingWithCalendar,
  onSave = () => {},
}: BookingDialogButtonProps) {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const isEdit = Boolean(existingBooking);

  const disableTriggerModalButton = disableCreateBookingWithCalendar;

  const handleBookingModalOpen = () => {
    setBookingModalOpen(true);
  };

  const handleBookingModalClose = () => {
    onSave();
    setBookingModalOpen(false);
  };

  return (
    <>
      <ButtonResponsiveWithIcon
        variant="contained"
        startIcon={isEdit ? <EditIcon /> : <AddIcon />}
        size={isEdit ? "small" : "medium"}
        onClick={handleBookingModalOpen}
        disabled={disableTriggerModalButton}
      >
        <label>{isEdit ? "Edit" : "Create booking"}</label>
      </ButtonResponsiveWithIcon>

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
          onSubmit={() => handleBookingModalClose()}
          onCancel={handleBookingModalClose}
        />
      </Modal>
    </>
  );
}
