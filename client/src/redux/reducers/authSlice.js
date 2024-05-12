import {createSlice} from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {adminLogin, adminLogout, verifyAdmin} from "../thunks/admin.js";
import {sout} from "../../utils/helper.js";

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.fulfilled, (state, action) => {
        sout("Success: ", action.payload)
        toast.success(action.payload);
        state.isAdmin = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        sout("Error: ", action.error.message)
        toast.error(action.error.message);
        state.isAdmin = false;
      })
      .addCase(adminLogout.fulfilled, (state, action) => {
        sout("Success: ", action.payload)
        toast.success(action.payload);
        state.isAdmin = false;
      })
      .addCase(adminLogout.rejected, (state, action) => {
        sout("Error: ", action.error.message)
        toast.error(action.error.message);
        state.isAdmin = false;
      })
      .addCase(verifyAdmin.fulfilled, (state, action) => {
        state.isAdmin = action.payload.admin === true;
        toast.success(action.payload.message);
      })
      .addCase(verifyAdmin.rejected, (state, action) => {
        state.isAdmin = false;
      })
  }
})

export const {userExists, userDoesNotExist} = authSlice.actions;

export default authSlice;