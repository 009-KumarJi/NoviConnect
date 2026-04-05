import React from 'react';
import {Stack} from "@mui/material";
import ChatItem from "../shared/ChatItem.jsx";
import {sout} from "../../utils/helper.js";
import {userTheme} from "../../constants/userTheme.constant.js";

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
    <Stack width={w} direction="column" overflow={"auto"} height={"100%"} paddingTop="0.2rem" sx={{
      "&::-webkit-scrollbar": {width: "0.6rem"},
      "&::-webkit-scrollbar-thumb": {backgroundColor: userTheme.accentSoft, borderRadius: "1rem"},
      "&::-webkit-scrollbar-track": {backgroundColor: "rgba(0,0,0,0)", border: "none"},
    }}>
      {
        chats
          ?.map((data, index) => {
            const {avatar, _id, name, groupChat, members, unreadCount = 0} = data;
            const newMessageAlert = newMessagesAlert.find(
              ({ChatId}) => ChatId === _id
            );
            const effectiveUnreadCount = ChatId === _id
              ? 0
              : Math.max(unreadCount, newMessageAlert?.count || 0);
            const isOnline = members.some(member => onlineUsers.includes(member));
            sout("onlineUsers ---- : ", onlineUsers);
            sout("isOnline ---- : ", isOnline);
            sout("id ---- : ", _id);
            sout("members ---- : ", members);
            return (
              <ChatItem
                index={index}
                newMessageAlert={{count: effectiveUnreadCount}}
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
