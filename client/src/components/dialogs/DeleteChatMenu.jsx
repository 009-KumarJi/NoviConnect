import React, {useEffect} from 'react';
import {Menu, Stack, Typography} from "@mui/material";
import {setIsDeleteMenu} from "../../redux/reducers/miscSlice.js";
import {useSelector} from "react-redux";
import {ExitToApp as LeaveGroupIcon, PersonRemove as FriendRemoveIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useAsyncMutation} from "../../hooks/hook.jsx";
import {useDeleteGroupChatMutation, useLeaveGroupMutation} from "../../redux/api/apiSlice.js";

const DeleteChatMenu = ({dispatch, deleteMenuAnchor}) => {
  const navigate = useNavigate();
  const {isDeleteMenu, selectedDeleteChat} = useSelector(state => state['misc']);

  const [deleteChat, _, deleteChatData] = useAsyncMutation(useDeleteGroupChatMutation);
  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation);

  const closeHandler = () => dispatch(setIsDeleteMenu(false));

  const leaveGroupHandler = async () => {
    closeHandler();
    await leaveGroup("Leaving Group...", selectedDeleteChat.ChatId);
  };
  const removeFriendHandler = async () => {
    closeHandler();
    await deleteChat("Removing Friend...", selectedDeleteChat.ChatId);
  };

  useEffect(() => {
    if (deleteChatData || leaveGroupData) navigate("/");
  }, [deleteChatData, leaveGroupData]);

  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      sx={{
        transition: "background-color 0.3s ease",
        "& .MuiMenu-paper": {
          borderRadius: "3rem",
          "&:hover": {
            backgroundColor: "rgb(255,240,240)"
          },
        }
      }}
    >
      <Stack
        sx={{
          width: "11rem",
          padding: "1rem",
          cursor: "pointer",
          color: "maroon",
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={selectedDeleteChat?.groupChat ? leaveGroupHandler : removeFriendHandler}
      >
        {
          selectedDeleteChat?.groupChat
            ? (
              <>
                <LeaveGroupIcon/><Typography>Leave Group</Typography>
              </>
            )
            : (
              <>
                <FriendRemoveIcon/><Typography>Remove Friend</Typography>
              </>
            )
        }
      </Stack>
    </Menu>
  )
};

export default DeleteChatMenu;