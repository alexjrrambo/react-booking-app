import { Card } from "@mui/material";
import styled from "styled-components";

export const CardWrapper = styled(Card)`
  display: flex;
  gap: 8px;
  padding: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.xs}px) {
    gap: 4px;
    padding: 8px;
  }
`;
