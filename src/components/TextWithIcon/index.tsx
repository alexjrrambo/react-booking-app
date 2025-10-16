import { Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Wrapper } from "./styles";

type TextWithIconProps = {
  icon?: ReactNode;
  children: ReactNode;
};

export function TextWithIcon({ icon, children }: TextWithIconProps) {
  return (
    <Wrapper>
      {icon}
      <Typography variant="body2">{children}</Typography>
    </Wrapper>
  );
}
