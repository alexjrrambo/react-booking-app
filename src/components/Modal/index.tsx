import { Dialog, DialogActions, DialogContent, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  actions?: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  dataTestId?: string;
};

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = "md",
  fullWidth = true,
  dataTestId,
}: ModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      data-testid={dataTestId}
    >

      <DialogContent>
        {title && <Typography variant="h6">{title}</Typography>}
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        {children}
      </DialogContent>

      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
}
