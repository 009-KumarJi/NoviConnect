import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: true,
  isAdmin: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    userDoesNotExist: (state) => {
      state.user = null;
      state.isLoading = false;
    },
  }
})

export const {userExists, userDoesNotExist} = authSlice.actions;

export default authSlice;