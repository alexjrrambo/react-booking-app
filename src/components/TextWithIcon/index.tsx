import type { ReactNode } from "react";
import { Wrapper } from "./styles";
import { Typography } from "@mui/material";

type TextProps = {
  icon?: ReactNode;
  children: ReactNode;
};

export function TextWithIcon({ icon, children }: TextProps) {
  return (
    <Wrapper>
      {icon}
      <Typography variant="body2">{children}</Typography>
    </Wrapper>
  );
}
