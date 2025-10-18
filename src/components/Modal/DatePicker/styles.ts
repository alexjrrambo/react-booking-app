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

  .rdp-months {
    justify-content: center;
  }
`;

export const DatePickerContainer = styled.div`
  height: 400px;
`;

export const DatePickerModalActions = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.palette.background.paper};
  border-top: 1px solid ${({ theme }) => theme.palette.divider};

  > div {
    display: flex;
    align-items: end;
    gap: 8px;
  }

    @media (max-width: ${({ theme }) => theme.breakpoints.values.sm}px) {
      padding: 4px;

      > div {
        gap: 4px;
      }      
    }
`;
