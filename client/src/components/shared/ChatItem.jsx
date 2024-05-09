import React, {memo} from 'react';
import {Link} from "../styles/StyledComponents.jsx";
import {Box, Container, Stack, Typography} from "@mui/material";
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
      sx={{
        padding: "0",
      }}
      to={`/chat/${_id}`}
      onContextMenu={
        (_event) => {
          handleDeleteChat(_event, _id, groupChat);
        }
      }
    >
      <Container sx={{
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
        <AvatarCard avatar={avatar}/>

        <Stack>
          <Typography>{name}</Typography>
          {
            newMessageAlert && (
              <Typography>{newMessageAlert.count} New Messages</Typography>
            )
          }
        </Stack>

        {
          isOnline && (
            <Box
              sx={{
                width: "1rem",
                height: "1rem",
                borderRadius: "50%",
                backgroundColor: "green",
                position: "absolute",
                right: "1rem",
                transform: "translateY(-50%)",
              }}
            />
          )
        }

      </Container>
    </Link>
  );
};

export default memo(ChatItem);

// Path: client/src/components/shared/ChatItem.jsx