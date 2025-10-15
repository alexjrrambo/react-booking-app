import { Container, StyledCardContent } from "./styles";
import {
  Button,
  Card,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import AddIcon from "@mui/icons-material/Add";
import { TextWithIcon } from "../../components/TextWithIcon";

export function BookingsPage() {
  return (
    <Container>
      <Card>
        <StyledCardContent>
          <TextWithIcon icon={<HomeOutlinedIcon />}>
            Property 1
          </TextWithIcon>

          <TextWithIcon icon={<CalendarMonthOutlinedIcon />}>
            All dates
          </TextWithIcon>

          <Button
            variant="outlined"
            startIcon={<TuneOutlinedIcon />}
          >
            Change filters
          </Button>
        </StyledCardContent>
      </Card>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        size="medium"
      >
        Create booking
      </Button>
    </Container>
  );
}
