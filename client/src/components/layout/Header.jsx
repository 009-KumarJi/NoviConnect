import React, {lazy, Suspense, useState} from 'react';
import {AppBar, Box, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import {orange} from "../../constants/color.js";
import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";


const SearchDialog = lazy(() => import("../specific/Search.jsx"));
const NotificationsDialog = lazy(() => import("../specific/Notifications.jsx"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup.jsx"));

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isNewGroupDialogOpen, setIsNewGroupDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const handleMobile = () => {
    console.log("Mobile menu clicked");
    setIsMobileMenuOpen((prev) => !prev);
  };
  const openSearch = () => {
    console.log("Search dialog opened");
    setIsSearchDialogOpen((prev) => !prev);
  };
  const openNewGroup = () => {
    console.log("New group dialog opened");
    setIsNewGroupDialogOpen((prev) => !prev);
  }
  const showNotification = () => {
    console.log("Notification dialog opened");
    setIsNotificationDialogOpen((prev) => !prev);
  }
  const navigateToGroup = () => {
    navigate("/groups");
  }
  const logoutHandler = () => {
    console.log("Logout clicked");
  }

  return (
    <>
      <Box sx={{flexGrow: 1}} height={"4rem"}>
        <AppBar
          position={"static"}
          sx={{bgcolor: orange}}
        >
          <Toolbar>
            <Typography variant={"h6"} sx={{display: {xs: "none", sm: "block"}}}>
              NoviConnect
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
        isSearchDialogOpen && (
          <Suspense fallback={<div>Loading...</div>}>
            <SearchDialog/>
          </Suspense>
        )
      }
      {
        isNewGroupDialogOpen && (
          <Suspense fallback={<div>Loading...</div>}>
            <NewGroupDialog/>
          </Suspense>
        )
      }
      {
        isNotificationDialogOpen && (
          <Suspense fallback={<div>Loading...</div>}>
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