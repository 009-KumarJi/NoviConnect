import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice.js";
import apiSlice from "./api/apiSlice.js";
import miscSlice from "./reducers/miscSlice.js";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [miscSlice.name]: miscSlice.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})

export default store;