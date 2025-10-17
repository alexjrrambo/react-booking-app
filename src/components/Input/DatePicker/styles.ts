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

  .my-booked-class {
    background-color: ${({ theme }) => theme.palette.error.main};
    color: ${({ theme }) => theme.palette.primary.contrastText};
    border-radius: 50%;
    opacity: 0.7;
  }
`;

export const DatePickerContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 400px;
`;
