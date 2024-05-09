import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice.js";
import apiSlice from "./api/apiSlice.js";
import miscSlice from "./reducers/miscSlice.js";
import chatSlice from "./reducers/chatSlice.js";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})

export default store;