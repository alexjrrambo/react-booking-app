import { Button } from "@mui/material";
import styled from "styled-components";

export const BookingListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
`;

export const BookingItemActions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const StyledActionButton = styled(Button)`
    //width: 100px;
    justify-content: flex-start;
    text-align: left;
`;
