import { Card } from "@components/Card";
import { BookingModal } from "@components/Modal/Booking";
import { TextWithIcon } from "@components/TextWithIcon";
import { useAppSelector } from "@hooks/useAppSelector";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonIcon from "@mui/icons-material/Person";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import { Button, Grid, Typography } from "@mui/material";
import { selectFilteredBookings } from "@store/booking/selectors";
import { deleteBooking } from "@store/booking/slice";
import { parseDateOnly } from "@utils/date";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import {
  AnimatedWrapper,
  BookingItemActions,
  BookingListContainer,
  BookingListEmpty,
  DateBadge,
  DateBadgeIcon,
  DateBadgeText,
} from "./styles";

export function BookingList() {
  const dispatch = useDispatch();
  const bookings = useAppSelector(selectFilteredBookings);

  const handleDeleteBooking = (id: string) => {
    dispatch(deleteBooking({ id }));
  };

  if (bookings.length === 0) {
    return (
      <BookingListContainer>
        <BookingListEmpty>
          <SearchOffOutlinedIcon fontSize="large" />
          <Typography variant="h6">
            No bookings found
          </Typography>
          <Typography variant="body2" align="center">
            Try adjusting the filters or create a new booking.
          </Typography>
          <BookingModal />
        </BookingListEmpty>
      </BookingListContainer>
    );
  }

  return (
    <BookingListContainer>
      {bookings.map((bookingItem, index) => {
        return (
          <AnimatedWrapper
            key={bookingItem.id}
            $delayMs={index * 50}
            data-testid="booking-card"
          >
            <Card>
              <Grid
                container
                flexGrow={1}
                spacing={{ sm: 2, xs: 1 }}
                alignItems="center"
              >
                <Grid size={12}>
                  <DateBadge>
                    <DateBadgeIcon>
                      <CalendarMonthOutlinedIcon fontSize="small" />
                    </DateBadgeIcon>
                    <DateBadgeText>
                      <label>Dates</label>
                      <span>
                        {format(parseDateOnly(bookingItem.startDate), "MMM d")}
                        <ArrowForwardIosRoundedIcon />
                        {format(parseDateOnly(bookingItem.endDate), "MMM d, yyyy")}
                      </span>
                    </DateBadgeText>
                  </DateBadge>
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                  <TextWithIcon icon={<PersonIcon />}>{bookingItem.guestName}</TextWithIcon>
                </Grid>
                <Grid size={{ md: 6, xs: 12 }}>
                  <TextWithIcon icon={<HomeOutlinedIcon />}>{bookingItem.property}</TextWithIcon>
                </Grid>
              </Grid>

              <BookingItemActions>
                <BookingModal existingBooking={bookingItem} />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DeleteOutlineIcon />}
                  color="error"
                  onClick={() => handleDeleteBooking(bookingItem.id)}
                >
                  Delete
                </Button>
              </BookingItemActions>
            </Card>
          </AnimatedWrapper>
        );
      })}
    </BookingListContainer>
  );
}
