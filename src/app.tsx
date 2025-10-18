import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider as ReduxProvider } from "react-redux";

import { BookingsPage } from "./pages/Booking";
import { store } from "./store";
import { GlobalStyle } from "./styles/globalStyle";
import { lightTheme } from "./styles/theme";

export function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <GlobalStyle />
        <BookingsPage />
      </ThemeProvider>
    </ReduxProvider>
  );
}
