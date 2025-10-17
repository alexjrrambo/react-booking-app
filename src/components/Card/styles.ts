import { Card } from "@mui/material";
import styled from "styled-components";

export const CardWrapper = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.xs}px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    border-radius: 16px;
  }
`;
