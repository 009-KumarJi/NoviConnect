import React, {memo} from 'react';
import {Link} from "../styles/StyledComponents.jsx";
import {Box, Typography} from "@mui/material";
import AvatarCard from "./AvatarCard.jsx";
import {darkPaleBlue} from "../../constants/color.constant.js";
import {motion} from "framer-motion";

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
  const handleDelete = (_event) => {
    handleDeleteChat(_event, _id, groupChat);
  }
  return (
    <Link
      sx={{padding: "0"}}
      to={`/chat/${_id}`}
      onContextMenu={(_event) => handleDelete(_event)}
    >
      <motion.div
        initial={{opacity: 0, y: "-100%"}}
        whileInView={{opacity: 1, y: 0}}
        transition={{delay: index * 0.1}}
        style={{
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
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);

// Path: client/src/components/shared/ChatItem.jsx