import { Card } from "@components/Card";
import { DatePicker } from "@components/DatePicker";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { setBookingFilters } from "@store/slices/booking";
import { formatDateISO } from "@utils/date";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { useDispatch } from "react-redux";
import { PROPERTIES } from "../../../constants/properties";
import { FilterButton, FilterLabel, FilterValue, SearchButton, VerticalDivider } from "./styles";

export function FilterHeader() {
  const dispatch = useDispatch();
  const [filterDates, setFilterDates] = useState<DateRange | undefined>();
  const [filterProperty, setFilterProperty] = useState<string>("");
  const [propertyAnchor, setPropertyAnchor] = useState<null | HTMLElement>(null);

  const isPropertyMenuOpen = Boolean(propertyAnchor);

  const openPropertyMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPropertyAnchor(e.currentTarget);
  };

  const closePropertyMenu = () => setPropertyAnchor(null);

  const handleSelectProperty = (property: string) => {
    setFilterProperty(property);

    closePropertyMenu();
  };

  const handleApplyFilters = () => {
    dispatch(setBookingFilters({
      property: filterProperty,
      startDate: filterDates?.from ? formatDateISO(filterDates.from) : "",
      endDate: filterDates?.to ? formatDateISO(filterDates.to) : "",
    }));
  };

  return (
    <Card>
      <DatePicker
        value={filterDates}
        onChange={setFilterDates}
        disabledBefore
        modalTitle="Filter by dates"
        modalSubtitle="Pick a date range to narrow results."
        trigger={({ open, displayedValue }) => (
          <FilterButton onClick={open} aria-label="Filter by dates">
            <CalendarMonthOutlinedIcon fontSize="small" />
            <div>
              <FilterLabel>Dates</FilterLabel>
              <FilterValue>{displayedValue || "All dates"}</FilterValue>
            </div>
          </FilterButton>
        )}
      />

      <VerticalDivider />

      <FilterButton
        onClick={openPropertyMenu}
        aria-haspopup="menu"
        aria-controls="property-menu"
        aria-expanded={isPropertyMenuOpen ? "true" : undefined}
        aria-label="Filter by property"
      >
        <HomeOutlinedIcon fontSize="small" />
        <div>
          <FilterLabel>Property</FilterLabel>
          <FilterValue>{filterProperty || "All properties"}</FilterValue>
        </div>
      </FilterButton>

      <Menu
        id="property-menu"
        anchorEl={propertyAnchor}
        open={isPropertyMenuOpen}
        onClose={closePropertyMenu}
      >
        <MenuItem onClick={() => handleSelectProperty("")}>
          All properties
        </MenuItem>
        {PROPERTIES.map((propertyName) => (
          <MenuItem key={propertyName} onClick={() => handleSelectProperty(propertyName)}>
            {propertyName}
          </MenuItem>
        ))}
      </Menu>

      <SearchButton>
        <IconButton
          onClick={handleApplyFilters}
          size="medium"
          aria-label="Apply filters"
        >
          <SearchIcon />
        </IconButton>
      </SearchButton>
    </Card>
  );
}
