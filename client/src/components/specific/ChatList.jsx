import React from 'react';
import {Stack} from "@mui/material";
import ChatItem from "../shared/ChatItem.jsx";

const ChatList = (
  {
    w = "100%",
    chats = [],
    chatID,
    onlineUsers = [],
    newMessagesAlert = [
      {
        chatID: "",
        count: 0,
      }
    ],
    handleDeleteChat,
  }) => {
  return (
    <Stack width={w} direction={"column"}>
      {
        chats?.map((data, index) => {
          const {avatar, _id, name, groupChat, members} = data;
          const newMessageAlert = newMessagesAlert.find(
            ({chatID}) => chatID === _id
          );
          const isOnline = members?.some(
            (member) => onlineUsers.includes(_id)
          );
          return (
            <ChatItem
              index={index}
              newMessageAlert={newMessageAlert}
              isOnline={isOnline}
              avatar={avatar}
              name={name}
              _id={_id}
              key={_id}
              groupChat={groupChat}
              sameSender={chatID === _id}
              handleDeleteChat={handleDeleteChat}
            />
          );
        })
      }
    </Stack>
  );
};

export default ChatList;