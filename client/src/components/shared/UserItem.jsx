import React, {memo} from 'react';
import {Avatar, IconButton, ListItem, Stack, Typography} from "@mui/material";
import {Add as AddIcon, Remove as RemoveIcon} from "@mui/icons-material";
import {transformImg} from "../../lib/features.js";
import {sout} from "../../utils/helper.js";

const UserItem = ({
                    user,
                    handler,
                    handlerIsLoading,
                    isSelected = false,
                    styling = {}
                  }) => {
  sout("UserItem: ", user)
  const {name, _id, avatar} = user;
  return (
    <ListItem>
      <Stack
        direction="row"
        alignItems="center"
        spacing="1rem"
        width="100%"
        {...styling}
      >
        <Avatar src={transformImg(avatar)}/>
        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%"
          }}
        >{name}</Typography>
        <IconButton
          size="small"
          sx={{
            bgcolor: isSelected ? "error.main" : "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: isSelected ? "error.dark" : "primary.dark",
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