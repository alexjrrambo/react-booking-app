import { alpha } from "@mui/material/styles";
import styled from "styled-components";

export const TextWrapper = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 32px;
`;

export const IconBox = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    color: ${({ theme }) => theme.palette.text.primary};
    background-color: ${({ theme }) =>
      theme.palette.mode === "light" ? alpha("#000", 0.06) : alpha("#fff", 0.06)};
    border: ${({ theme }) =>
      theme.palette.mode === "light"
        ? `1px solid ${alpha("#000", 0.06)}`
        : `1px solid ${alpha("#fff", 0.06)}`};
`;
