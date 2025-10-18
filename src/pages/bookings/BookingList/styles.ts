import { alpha } from "@mui/material/styles";
import styled, { keyframes } from "styled-components";

export const BookingListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
`;

export const BookingItemActions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    @media (max-width: ${({ theme }) => theme.breakpoints.values.sm}px) {        
      justify-content: end;      
    }
`;

export const DateBadge = styled.div`
    display: flex;
    width: 260px;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 14px;
    border: 1px solid ${({ theme }) => alpha(theme.palette.primary.main, 0.25)};
    background: ${({ theme }) => alpha(theme.palette.primary.main, 0.10)};
    box-shadow: 0 2px 6px rgba(16, 24, 40, 0.06);
`;

export const DateBadgeIcon = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    color: ${({ theme }) => theme.palette.primary.contrastText};
    background-color: ${({ theme }) => theme.palette.primary.main};
`;

export const DateBadgeText = styled.div`
    display: flex;
    gap: 4px;
    flex-direction: column;
    line-height: 1.1;

    label {
      font-size: 12px;
    }

    span {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 16px;
      letter-spacing: 0.2px;
      color: ${({ theme }) => theme.palette.text.primary};
    }

    svg {
      font-size: 14px;
      opacity: 0.8;
    }
`;

export const BookingListEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 0;
  border-radius: 16px;
  background: ${({ theme }) => theme.palette.primary.contrastText};
`;

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const AnimatedWrapper = styled.div<{ $delayMs?: number }>`
  opacity: 0;
  animation: ${fadeSlideUp} 260ms ease-out forwards;
  animation-delay: ${({ $delayMs = 0 }) => `${$delayMs}ms`};
`;
