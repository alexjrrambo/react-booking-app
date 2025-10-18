import { Button } from "@mui/material";
import styled from "styled-components";

export const ButtonResponsiveWithIcon = styled(Button)`
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm}px) {
    min-width: 36px;
    padding: 6px;

    & .MuiButton-startIcon {
        margin: 0;
    }

    svg {
        align-self: center;
    }

    > label {
        display: none;
    }
  }
`;
