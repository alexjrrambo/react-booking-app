import { DatePicker } from "@components/DatePicker";
import { BookingModal } from "@components/Modal/Booking";
import { useAppSelector } from "@hooks/useAppSelector";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import {
  Button,
  Tooltip,
  Typography,
} from "@mui/material";
import { BookingList } from "./BookingList";
import { FilterHeader } from "./FilterHeader";
import { BookingActions, BookingSection, Container, RightActions } from "./styles";

export function BookingsPage() {
  const filterProperty = useAppSelector((state) => state.booking.filters.property);

  return (
    <Container>
      <FilterHeader />

      <BookingSection>
        <BookingActions>
          <Typography variant="h5">Bookings</Typography>

          <RightActions>
            <DatePicker
              disabledBefore
              modalTitle={`Check availability | ${filterProperty}`}
              modalSubtitle="Select check-in and check-out dates. Unavailable dates are disabled."
              property={filterProperty}
              enableCreateBooking
              trigger={({ open }) => (
                <Tooltip title={filterProperty ? "" : "Select a property first"}>
                  <span>
                    <Button
                      onClick={open}
                      variant="outlined"
                      size="small"
                      startIcon={<EventAvailableOutlinedIcon />}
                      disabled={!filterProperty}
                    >
                      Availability
                    </Button>
                  </span>
                </Tooltip>
              )}
            />

            <BookingModal defaultBookingValues={{ property: filterProperty }} />
          </RightActions>
        </BookingActions>

        <BookingList />
      </BookingSection>
    </Container>
  );
}
