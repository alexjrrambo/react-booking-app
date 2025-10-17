import type { ReactNode } from "react";
import { CardWrapper } from "./styles";

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return (
    <CardWrapper>
      {children}
    </CardWrapper>
  );
}
