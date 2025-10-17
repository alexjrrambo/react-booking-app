import { Card } from "@components/Card";
import { TextWithIcon } from "@components/TextWithIcon";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import {
  Button,
  Grid,
} from "@mui/material";

export function FilterHeader() {
  return (
    <Card>
      <Grid
        container
        flexGrow={1}
        spacing={2}
        alignItems="center"
      >
        <Grid size={{ md: 4, xs: 12 }}>
          <TextWithIcon icon={<CalendarMonthOutlinedIcon />}>
            All dates
          </TextWithIcon>
        </Grid>

        <Grid size={{ md: 4, xs: 12 }}>
          <TextWithIcon icon={<HomeOutlinedIcon />}>
            Property 1
          </TextWithIcon>

        </Grid>
      </Grid>
      <Button
        variant="outlined"
        startIcon={<TuneOutlinedIcon />}
        sx={{
          whiteSpace: "nowrap", // não quebra
          minWidth: { xs: "auto", sm: 120 }, // evita crescer no xs
        }}
      >
        Change filters
      </Button>
    </Card>
  );
}
