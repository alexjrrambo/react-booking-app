import { createTheme } from "@mui/material/styles";

// Breakpoints: xs:0, sm:600, md:900, lg:1200, xl:1536
export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    button: { textTransform: "none" },
  },
});
