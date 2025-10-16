import {
  Button,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { TextWithIcon } from "../../../components/TextWithIcon";
import { Card } from "../../../components/Card";

export function FilterHeader() {
  return (
    <Card>
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
    </Card>
  );
}
