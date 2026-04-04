import React, {memo} from 'react';
import {Avatar, IconButton, ListItem, Stack, Typography} from "@mui/material";
import {Add as AddIcon, Remove as RemoveIcon} from "@mui/icons-material";
import {transformImg} from "../../lib/features.js";
import {userTheme} from "../../constants/userTheme.constant.js";

const UserItem = ({
                    user,
                    handler,
                    handlerIsLoading,
                    isSelected = false,
                    styling = {},
                    admin = ""
                  }) => {
  const {name, _id, avatar} = user;
  return (
    <ListItem>
      <Stack
        direction="row"
        alignItems="center"
        spacing="1rem"
        width="100%"
        sx={{
          p: "0.9rem 1rem",
          borderRadius: "1rem",
          backgroundColor: "rgba(9, 17, 28, 0.76)",
          border: `1px solid ${userTheme.border}`,
          color: userTheme.text,
          ...styling,
        }}
      >
        <Avatar src={transformImg(avatar)}/>
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            fontWeight: 600,
          }}
        >{name}{
          admin === _id && (
            <Typography component="span" variant="caption" sx={{color: userTheme.textMuted}}> (Admin)</Typography>
          )
        }</Typography>
        <IconButton
          size="small"
          sx={{
            bgcolor: isSelected ? "rgba(251, 113, 133, 0.18)" : userTheme.accentSoft,
            color: isSelected ? userTheme.danger : userTheme.accent,
            border: `1px solid ${isSelected ? "rgba(251, 113, 133, 0.28)" : userTheme.borderStrong}`,
            "&:hover": {
              bgcolor: isSelected ? "rgba(251, 113, 133, 0.26)" : "rgba(94, 234, 212, 0.2)",
            }
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          {
            isSelected ?
              <RemoveIcon/> :
              <AddIcon/>
          }
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);
