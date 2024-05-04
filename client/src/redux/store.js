import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
  }
})