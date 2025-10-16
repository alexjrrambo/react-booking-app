import { BookingActions, BookingSection, Container } from "./styles";
import {
  Typography,
} from "@mui/material";
import { FilterHeader } from "./FilterHeader";
import { BookingList } from "./BookingList";
import { CreateBookingButton } from "./CreateBooking";

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
