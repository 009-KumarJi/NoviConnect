import React from 'react';
import {Stack} from "@mui/material";
import ChatItem from "../shared/ChatItem.jsx";
import {colorPalette} from "../../constants/color.js";

const ChatList = (
  {
    w = "100%",
    chats = [],
    ChatId,
    onlineUsers = [],
    newMessagesAlert = [
      {
        ChatId: "",
        count: 0,
      }
    ],
    handleDeleteChat,
  }) => {
  return (
    <Stack width={w} direction={"column"} overflow={"auto"} height={"100%"} paddingTop="0.2rem" sx={{

      "&::-webkit-scrollbar": {
        width: "0.6rem",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: `${colorPalette(0.3).CP6}`,
        borderRadius: "1rem",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "rgba(0,0,0,0)",
        border: "none",
      },
    }}>
      {
        chats?.map((data, index) => {
          const {avatar, _id, name, groupChat, members} = data;
          const newMessageAlert = newMessagesAlert.find(
            ({ChatId}) => ChatId === _id
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
              sameSender={ChatId === _id}
              handleDeleteChat={handleDeleteChat}
            />
          );
        })
      }
    </Stack>
  );
};

export default ChatList;