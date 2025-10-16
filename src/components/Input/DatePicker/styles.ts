import { alpha } from "@mui/material/styles";
import { DayPicker } from "react-day-picker";
import styled from "styled-components";

export const DatePickerInputContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const StyledDatePicker = styled(DayPicker)`
  --rdp-accent-color: ${({ theme }) => theme.palette.primary.dark};
  --rdp-accent-background-color: ${({ theme }) => theme.palette.primary.dark};
  --rdp-range_middle-background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.3)};
  --rdp-day_button-border: none;
`;

export const DatePickerContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 400px;
`;
