import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    button: { textTransform: "none" },
  },
});
