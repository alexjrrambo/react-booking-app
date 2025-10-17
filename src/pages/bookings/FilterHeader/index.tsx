import { Card } from "@components/Card";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import { FilterButton, FilterLabel, FilterValue, SearchButton, VerticalDivider } from "./styles";

export function FilterHeader() {
  return (
    <Card>
      <FilterButton>
        <CalendarMonthOutlinedIcon fontSize="small" />
        <div>
          <FilterLabel>Dates</FilterLabel>
          <FilterValue>All dates</FilterValue>
        </div>
      </FilterButton>

      <VerticalDivider />

      <FilterButton>
        <HomeOutlinedIcon fontSize="small" />
        <div>
          <FilterLabel>Property</FilterLabel>
          <FilterValue>Beach house</FilterValue>
        </div>
      </FilterButton>

      <SearchButton>
        <IconButton
          size="medium"
        >
          <SearchIcon />
        </IconButton>
      </SearchButton>
    </Card>
  );
}
