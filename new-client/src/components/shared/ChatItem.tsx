import React, {memo} from 'react';
import {Link} from "../styles/StyledComponents.jsx";
import {Box, Typography} from "@mui/material";
import AvatarCard from "./AvatarCard.jsx";
import {motion} from "framer-motion";
import {userTheme} from "../../constants/userTheme.constant.js";

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
          backgroundColor: sameSender ? "rgba(56, 189, 248, 0.14)" : "rgba(8, 15, 25, 0.34)",
          color: userTheme.text,
          position: "relative",
          borderRadius: "1rem",
          border: `1px solid ${sameSender ? userTheme.borderStrong : userTheme.border}`
        }}
      >
        <AvatarCard avatar={avatar} newMessage={newMessageAlert?.count || 0}/>
        <Typography sx={{fontWeight: 600}}>{name}</Typography>
        {isOnline && (
          <Box
            sx={{
              flexGrow: 1,
              width: ".7rem",
              height: ".7rem",
              borderRadius: "50%",
              backgroundColor: userTheme.accentStrong,
              position: "absolute",
              right: "1rem",
              boxShadow: "0 0 10px rgba(34, 197, 94, 0.9)",
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);

// Path: client/src/components/shared/ChatItem.jsx
