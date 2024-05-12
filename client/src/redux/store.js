import {combineReducers, configureStore} from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice.js";
import apiSlice from "./api/apiSlice.js";
import miscSlice from "./reducers/miscSlice.js";
import chatSlice from "./reducers/chatSlice.js";
import {RESET_STORE} from "./resetActions.js";

const appReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [miscSlice.name]: miscSlice.reducer,
  [chatSlice.name]: chatSlice.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === RESET_STORE) {
    state = undefined;
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})

export default store;