import {createSlice} from "@reduxjs/toolkit";
import {sout} from "../../utils/helper.js";

const initialState = {
  notificationCount: 0,
  newMessagesAlert: [{
    ChatId: "",
    count: 0,
  }],
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotificationCount: (state) => {
      state.notificationCount += 1;
    },
    resetNotificationCount: (state) => {
      state.notificationCount = 0;
    },
    setNewMessagesAlert: (state, action) => {
      const {ChatId} = action.payload;
      const index = state.newMessagesAlert.findIndex(alert => alert.ChatId === action.payload.ChatId);
      if (index === -1) {
        state.newMessagesAlert.push({ChatId, count: 1});
      } else {
        state.newMessagesAlert[index].count += 1;
      }
    },
    resetNewMessagesAlert: (state, action) => {
      sout("Resetting Alert: ", action.payload);
      state.newMessagesAlert = state.newMessagesAlert.filter(alert => alert.ChatId !== action.payload);
    }
  },
});

export const {
  incrementNotificationCount,
  resetNotificationCount,
  setNewMessagesAlert,
  resetNewMessagesAlert,
} = chatSlice.actions;

export default chatSlice;