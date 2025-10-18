import { ButtonResponsiveWithIcon } from "@components/Button";
import { BookingModal } from "@components/Modal/Booking";
import { DatePickerModal } from "@components/Modal/DatePicker";
import { useAppSelector } from "@hooks/useAppSelector";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import {
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
            <DatePickerModal
              modalTitle={`Check availability | ${filterProperty}`}
              modalSubtitle="Select check-in and check-out dates. Unavailable dates are disabled."
              property={filterProperty}
              enableCreateBooking
              trigger={({ open }) => (
                <Tooltip title={filterProperty ? "" : "Select a property first"}>
                  <span>
                    <ButtonResponsiveWithIcon
                      data-testid="availability-button"
                      onClick={open}
                      variant="outlined"
                      size="small"
                      startIcon={<EventAvailableOutlinedIcon />}
                      disabled={!filterProperty}
                    >
                      <label>Availability</label>
                    </ButtonResponsiveWithIcon>
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
