import type { ReactNode } from "react";
import { Card as MuiCard } from "@mui/material";
import { CardContent } from "./styles";

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return (
    <MuiCard>
      <CardContent>
        {children}
      </CardContent>
    </MuiCard>
  );
}
