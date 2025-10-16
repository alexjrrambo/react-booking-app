import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import { TextWithIcon } from "../../../components/TextWithIcon";
import { Card } from "../../../components/Card";
import { BookingItemActions, BookingListContainer, StyledActionButton } from "./styles";
import { Grid } from "@mui/material";
import { useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import { deleteBooking } from "../../../store/slices/booking";

export function BookingList() {
  const dispatch = useDispatch();
  const bookings = useAppSelector((store) => store.booking.bookingList);

  const handleDeleteBooking = (id: string) => {
    dispatch(deleteBooking({ id }));
  };
  return (
    <BookingListContainer>
      {bookings.map((bookingItem) => (
        <Card key={bookingItem.id}>

          <Grid container flexGrow={1} spacing={2}>
            <Grid size={12}>
              <TextWithIcon icon={<CalendarMonthOutlinedIcon />}>
                {`From ${bookingItem.startDate} to ${bookingItem.endDate}`}
              </TextWithIcon>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <TextWithIcon icon={<PersonIcon />}>
                {bookingItem.guestName}
              </TextWithIcon>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <TextWithIcon icon={<HomeOutlinedIcon />}>
                {bookingItem.property}
              </TextWithIcon>
            </Grid>
          </Grid>

          <BookingItemActions>
            <StyledActionButton
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
            >
              Edit
            </StyledActionButton>

            <StyledActionButton
              variant="outlined"
              size="small"
              startIcon={<DeleteOutlineIcon />}
              color="error"
              onClick={() => handleDeleteBooking(bookingItem.id)}
            >
              Delete
            </StyledActionButton>
          </BookingItemActions>
        </Card>
      ))}
    </BookingListContainer>
  );
}
