import {
  Typography,
} from "@mui/material";
import { BookingList } from "./BookingList";
import { CreateBookingButton } from "./CreateBooking";
import { FilterHeader } from "./FilterHeader";
import { BookingActions, BookingSection, Container } from "./styles";

export function BookingsPage() {
  return (
    <Container>
      <FilterHeader />

      <BookingSection>
        <BookingActions>
          <Typography variant="h5">
            Bookings
          </Typography>
          <CreateBookingButton />
        </BookingActions>

        <BookingList />
      </BookingSection>
    </Container>
  );
}
