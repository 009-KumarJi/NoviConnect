import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  notificationCount: 0,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotificationCount: (state) => {
      state.notificationCount += 1;
    },
    decrementNotificationCount: (state) => {
      if (state.notificationCount < 0) {
        state.notificationCount = 0;
        return;
      }
      state.notificationCount -= 1;
    },
  },
});

export const {incrementNotificationCount, resetNotificationCount, decrementNotificationCount} = chatSlice.actions;

export default chatSlice;