import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  isNewGroup: false,
  isAddMember: false,
  isSearch: false,
  isNotification: false,
  isMobileMenu: false,
  isFileMenu: false,
  isDeleteMenu: false,
  uploadingLoader: false,
  selectedDeleteChat: {
    ChatId: "",
    groupChat: false
  },
}

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsMobileMenu: (state, action) => {
      state.isMobileMenu = action.payload;
    },
    setIsFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    setIsDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setSelectedDeleteChat: (state, action) => {
      state.selectedDeleteChat = action.payload;
    },
    setIsAddMember: (state, action) => {
      state.isAddMember = action.payload;
    }
  }
});

export const {
  setIsNewGroup,
  setIsSearch,
  setIsNotification,
  setIsMobileMenu,
  setIsFileMenu,
  setIsDeleteMenu,
  setUploadingLoader,
  setSelectedDeleteChat,
  setIsAddMember
} = miscSlice.actions;

export default miscSlice;