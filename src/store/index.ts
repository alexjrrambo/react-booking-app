import { configureStore } from "@reduxjs/toolkit";
import { bookingReducer } from "./booking/slice";

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
