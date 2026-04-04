import React, {lazy, Suspense} from 'react';
import {AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {server} from "../../constants/config.constant.js";
import toast from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import {userDoesNotExist} from "../../redux/reducers/authSlice.js";
import {setIsMobileMenu, setIsNewGroup, setIsNotification, setIsSearch} from "../../redux/reducers/miscSlice.js";
import {resetNotificationCount} from "../../redux/reducers/chatSlice.js";
import {resetStore} from "../../redux/resetActions.js";
import {getSocket} from "../../socket.jsx";
import apiSlice from "../../redux/api/apiSlice.js";
import {userTheme} from "../../constants/userTheme.constant.js";
import {clearEncryptionIdentity} from "../../lib/e2ee";


const SearchDialog = lazy(() => import("../specific/Search.jsx"));
const NotificationsDialog = lazy(() => import("../specific/Notifications.jsx"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup.jsx"));

const Header = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = getSocket();

  const {isSearch, isNewGroup, isNotification} = useSelector(state => state["misc"]);
  const {notificationCount} = useSelector(state => state["chat"]);
  const {user} = useSelector(state => state["auth"]);

  const handleMobile = () => dispatch(setIsMobileMenu(true));
  const openSearch = () => dispatch(setIsSearch(true));
  const openNewGroup = () => dispatch(setIsNewGroup(true));
  const showNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  }
  const navigateToGroup = () => navigate("/groups");
  const navigateToSettings = () => navigate("/settings");

  const logoutHandler = async () => {
    if (socket) (socket as any).disconnect();

    try {
      const res = await axios.get(`${server}/api/v1/user/logout`, {withCredentials: true});
      clearEncryptionIdentity(user?._id);
      dispatch(apiSlice.util.resetApiState());
      dispatch(resetStore());
      dispatch(userDoesNotExist());
      toast.success(res?.data?.message || "Logged-out successfully!");
      navigate("/login", {replace: true});
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  }

  return (
    <>
      <Box sx={{flexGrow: 1}} height={"4rem"}>
        <AppBar position="static"
                sx={{background: "rgba(8, 15, 25, 0.88)", backdropFilter: "blur(18px)", borderBottom: `1px solid ${userTheme.border}`, boxShadow: "none"}}>
          <Toolbar>
            <Typography color={userTheme.text} variant={"h6"} fontWeight={"bold"} sx={{display: {xs: "none", sm: "block"}}}>
              Novi<span style={{color: userTheme.accentBlue}}>Connect</span>
            </Typography>
            <Box sx={{display: {xs: "block", sm: "none"}}}>
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon/>
              </IconButton>
            </Box>
            <Box sx={{flexGrow: 1}}/>
            <Box>
              <IconMould icon={<SearchIcon/>} onClick={openSearch} title="Search"/>
              <IconMould icon={<AddIcon/>} onClick={openNewGroup} title="New Group"/>
              <IconMould icon={<GroupIcon/>} onClick={navigateToGroup} title="Manage Groups"/>
              <IconMould icon={<SettingsIcon/>} onClick={navigateToSettings} title="Settings"/>
              <IconMould icon={<NotificationsIcon/>} onClick={showNotification} title="Notifications"
                         value={notificationCount}/>
              <IconMould icon={<LogoutIcon/>} onClick={logoutHandler} title="Logout"/>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {
        isSearch && (
          <Suspense fallback={<Backdrop open/>}>
            <SearchDialog/>
          </Suspense>
        )
      }
      {
        isNewGroup && (
          <Suspense fallback={<Backdrop open/>}>
            <NewGroupDialog/>
          </Suspense>
        )
      }
      {
        isNotification && (
          <Suspense fallback={<Backdrop open/>}>
            <NotificationsDialog/>
          </Suspense>
        )
      }
    </>
  );
};

const IconMould = ({icon, onClick, title, value}) => {
  return (
    <Tooltip title={title}>
      <IconButton color={"inherit"} size={"large"} onClick={onClick} sx={{border: `1px solid ${userTheme.border}`, ml: 0.6, backgroundColor: "rgba(13, 22, 35, 0.72)", "&:hover": {backgroundColor: userTheme.accentSoft}}}>
        {
          value
            ? <Badge badgeContent={value} color="error">{icon}</Badge>
            : icon
        }
      </IconButton>
    </Tooltip>
  );
};

export default Header;
