import { Card } from "@components/Card";
import { TextWithIcon } from "@components/TextWithIcon";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { Button, Grid } from "@mui/material";
import { useAppSelector } from "@store/index";
import { deleteBooking } from "@store/slices/booking";
import { parseDateOnly } from "@utils/date";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { BookingDialogButton } from "../BookingDialogButton";
import {
  BookingItemActions,
  BookingListContainer,
  DateBadge,
  DateBadgeIcon,
  DateBadgeText,
} from "./styles";

export function BookingList() {
  const dispatch = useDispatch();
  const bookings = useAppSelector((store) => store.booking.bookingList);

  const handleDeleteBooking = (id: string) => {
    dispatch(deleteBooking({ id }));
  };

  return (
    <BookingListContainer>
      {bookings.map((bookingItem) => {
        return (
          <Card key={bookingItem.id}>
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
              <BookingDialogButton existingBooking={bookingItem} />
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
        );
      })}
    </BookingListContainer>
  );
}
