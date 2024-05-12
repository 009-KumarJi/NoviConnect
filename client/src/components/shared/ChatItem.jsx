import React, {memo} from 'react';
import {Link} from "../styles/StyledComponents.jsx";
import {Box, Container, Typography} from "@mui/material";
import AvatarCard from "./AvatarCard.jsx";
import {darkPaleBlue} from "../../constants/color.constant.js";

const ChatItem = (
  {
    avatar = [],
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleDeleteChat,
  }
) => {
  return (
    <Link
      sx={{padding: "0"}}
      to={`/chat/${_id}`}
      onContextMenu={(_event) => handleDeleteChat(_event, _id, groupChat)}
    >
      <Container
        sx={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: sameSender ? `${darkPaleBlue}` : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
          borderRadius: "10rem"
        }}
      >
        <AvatarCard avatar={avatar} newMessage={newMessageAlert?.count || 0}/>
        <Typography>{name}</Typography>
        {isOnline && (
          <Box
            sx={{
              flexGrow: 1,
              width: ".7rem",
              height: ".7rem",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              right: "1rem",
              boxShadow: "0 0 10px limegreen",
            }}
          />
        )}
      </Container>
    </Link>
  );
};

export default memo(ChatItem);

// Path: client/src/components/shared/ChatItem.jsx