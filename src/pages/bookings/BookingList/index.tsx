import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import { TextWithIcon } from "../../../components/TextWithIcon";
import { Card } from "../../../components/Card";
import { BookingItemActions, BookingListContainer, StyledActionButton } from "./styles";
import { Grid } from "@mui/material";

const MOCK_BOOKINGS = [
  {
    id: "bkg_001",
    guestName: "Alex Junior Rambo",
    property: "Property 1",
    startDate: "2025-07-10",
    endDate: "2025-07-17",
  },
  {
    id: "bkg_002",
    guestName: "Maria Oliveira",
    property: "Property 2",
    startDate: "2025-07-12",
    endDate: "2025-07-15",
  },
  {
    id: "bkg_003",
    guestName: "João Santos",
    property: "Property 3",
    startDate: "2025-07-18",
    endDate: "2025-07-22",
  },
  {
    id: "bkg_004",
    guestName: "Ana Beatriz",
    property: "Property 1",
    startDate: "2025-07-20",
    endDate: "2025-07-25",
  },
  {
    id: "bkg_005",
    guestName: "Carlos Souza",
    property: "Property 2",
    startDate: "2025-07-28",
    endDate: "2025-08-02",
  },
  {
    id: "bkg_006",
    guestName: "Fernanda Lima",
    property: "Property 3",
    startDate: "2025-08-05",
    endDate: "2025-08-10",
  },
];

export function BookingList() {
  return (
    <BookingListContainer>
      {MOCK_BOOKINGS.map((bookingItem) => (
        <Card key={bookingItem.id}>

          <Grid container sx={{ flexGrow: 1 }} spacing={2}>
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
            >
              Delete
            </StyledActionButton>
          </BookingItemActions>
        </Card>
      ))}
    </BookingListContainer>
  );
}
