import { BookingActions, BookingSection, Container } from "./styles";
import {
  Button,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FilterHeader } from "./FilterHeader";
import { BookingList } from "./BookingList";

export function BookingsPage() {
  return (
    <Container>
      <FilterHeader />

      <BookingSection>
        <BookingActions>
          <Typography variant="h5">
            Bookings
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="medium"
          >
            Create booking
          </Button>
        </BookingActions>

        <BookingList />
      </BookingSection>
    </Container>
  );
}
