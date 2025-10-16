import { ThemeProvider, createTheme } from "@mui/material";
import { render } from "@testing-library/react";

export function renderWithTheme(ui: React.ReactNode) {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};
