import { Card } from "@components/Card";
import { TextWithIcon } from "@components/TextWithIcon";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import {
  Button,
} from "@mui/material";

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
