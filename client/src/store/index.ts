import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
// import wsReducer from "./slices/wsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // ws: wsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
