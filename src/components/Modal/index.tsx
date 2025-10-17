import { Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
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
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
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
