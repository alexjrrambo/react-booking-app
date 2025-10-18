import { alpha } from "@mui/material";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import styled, { keyframes } from "styled-components";

export const FilterHeaderContent = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 4px;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.xs}px) {
    gap: 0;
    flex-direction: column;
  }
`;

export const FilterButton = styled(ButtonBase)`
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 14px;
  text-align: left;

  &:hover {
      background: ${({ theme }) => alpha(theme.palette.primary.main, 0.08)};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.values.xs}px) {
      width: 100%;
      padding: 10px 10px;
  }
`;

export const FilterLabel = styled(Typography).attrs({ variant: "caption" })`
  line-height: 1;
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-bottom: 2px;
`;

export const FilterValue = styled(Typography).attrs({ variant: "body2" })`
  font-weight: 600;
`;

export const VerticalDivider = styled.div`
  width: 1px;
  height: 32px;
  background: ${({ theme }) =>
    theme.palette.mode === "light"
      ? "rgba(10,10,10,0.12)"
      : "rgba(255,255,255,0.12)"};

  @media (max-width: ${({ theme }) => theme.breakpoints.values.xs}px) {
      display: none;
  }
`;

export const SearchButton = styled.div`
  .MuiIconButton-root {
      background: ${({ theme }) => theme.palette.primary.main};
      color: ${({ theme }) => theme.palette.primary.contrastText};
      width: 100%;

      &:hover {
          background: ${({ theme }) => theme.palette.primary.dark};
      }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.values.xs}px) {
      display: flex;
      width: 100%;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const AnimatedWrapper = styled.div`
  opacity: 0;
  animation: ${fadeIn} 500ms ease-out forwards;
`;
