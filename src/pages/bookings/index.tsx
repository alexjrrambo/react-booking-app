import {
  Typography,
} from "@mui/material";
import { BookingDialogButton } from "./BookingDialogButton";
import { BookingList } from "./BookingList";
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
          <BookingDialogButton />
        </BookingActions>

        <BookingList />
      </BookingSection>
    </Container>
  );
}
