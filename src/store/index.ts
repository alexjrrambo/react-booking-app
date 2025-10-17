import { configureStore } from "@reduxjs/toolkit";
import { bookingReducer } from "./slices/booking";

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
