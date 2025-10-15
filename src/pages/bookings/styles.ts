import { CardContent } from "@mui/material";
import styled from "styled-components";

export const Container = styled.div`
    max-width: 1120px;
    margin: 0 auto;
    padding: 24px;
`;

export const StyledCardContent = styled(CardContent)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
