import { Typography } from "@mui/material";
import type { ReactNode } from "react";
import { IconBox, TextWrapper } from "./styles";

type TextWithIconProps = {
  icon?: ReactNode;
  label?: string;
  children: ReactNode;
};

export function TextWithIcon({ icon, label, children }: TextWithIconProps) {
  return (
    <TextWrapper>
      {icon ? <IconBox>{icon}</IconBox> : null}
      {label
        ? (
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          )
        : null}
      <Typography variant="body2" fontWeight={600}>
        {children}
      </Typography>
    </TextWrapper>
  );
}
