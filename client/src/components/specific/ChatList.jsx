import React from 'react';
import {Stack} from "@mui/material";

const ChatList = (
  {
    w = "100%",
    chats = [],
    chatID,
    onlineUsers = [],
    newMessageAlert = {
      chatID: "",
      count: 0,
    },
    handleDeleteChat,
  }) => {
  return (
    <Stack width={w} direction={"column"}>
      {
        chats?.map((data) => {
          return <div>{data}</div>;
        })
      }
    </Stack>
  );
};

export default ChatList;