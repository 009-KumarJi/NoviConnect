import React, {lazy, Suspense, useState} from 'react';
import {AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {colorPalette, textDark} from "../../constants/color.constant.js";
import axios from "axios";
import {server} from "../../constants/config.constant.js";
import toast from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import {userDoesNotExist} from "../../redux/reducers/authSlice.js";
import {setIsMobileMenu, setIsNewGroup, setIsNotification, setIsSearch} from "../../redux/reducers/miscSlice.js";


const SearchDialog = lazy(() => import("../specific/Search.jsx"));
const NotificationsDialog = lazy(() => import("../specific/Notifications.jsx"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup.jsx"));

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isSearch} = useSelector(state => state["misc"]);
  const {isNewGroup} = useSelector(state => state["misc"]);
  const {isNotification} = useSelector(state => state["misc"]);
  const handleMobile = () => dispatch(setIsMobileMenu(true));
  const openSearch = () => dispatch(setIsSearch(true));
  const openNewGroup = () => dispatch(setIsNewGroup(!isNewGroup));
  const showNotification = () => dispatch(setIsNotification(!isNotification));
  const navigateToGroup = () => {
    navigate("/groups");
  }
  const logoutHandler = () => {
    axios
      .get(`${server}/api/v1/user/logout`, {withCredentials: true})
      .then(res => {
        toast.success(res?.data?.message || "Logged-out successfully!");
        dispatch(userDoesNotExist());
      })
      .catch(err => toast.error(err?.response?.data?.message || "Something went wrong!"))
  }

  return (
    <>
      <Box sx={{flexGrow: 1}} height={"4rem"}>
        <AppBar position="static"
                sx={{backgroundImage: `linear-gradient(90deg, ${colorPalette().CP8}, rgb(65,125,143))`}}>
          <Toolbar>
            <Typography color={textDark} variant={"h6"} fontWeight={"bold"} sx={{display: {xs: "none", sm: "block"}}}>
              Novi<span style={{
              color: `${colorPalette(1).CP9}`,
              backgroundColor: `${textDark}`,
              paddingRight: "0.2rem"
            }}>Connect</span>
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
              <IconMould icon={<NotificationsIcon/>} onClick={showNotification} title="Notifications"/>
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

const IconMould = ({icon, onClick, title}) => {
  return (
    <Tooltip title={title}>
      <IconButton color={"inherit"} size={"large"} onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default Header;