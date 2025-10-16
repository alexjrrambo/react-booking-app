import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider as ReduxProvider } from "react-redux";

import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";
import { BookingsPage } from "./pages/Bookings";
import { store } from "./store";

export function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyle />
        <BookingsPage />
      </ThemeProvider>
    </ReduxProvider>
  );
}
