import React, {useState} from 'react';
import {Box, Drawer, Grid, IconButton, Stack, Typography} from "@mui/material";
import {colorPalette} from "../../constants/color.js";
import {
  Close as MenuCloseIcon,
  Dashboard as DashboardIcon,
  Groups3 as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import {useLocation} from "react-router-dom";
import {Link} from "../styles/StyledComponents.jsx";


const adminTabs = [
  {
    name: 'Dashboard',
    path: '/krishnaden/dashboard',
    icon: <DashboardIcon sx={{color: `${colorPalette(1).CP9}`}}/>,
  }, {
    name: 'Users',
    path: '/krishnaden/user-management',
    icon: <ManageAccountsIcon sx={{color: `${colorPalette(1).CP9}`}}/>,
  }, {
    name: 'Chats',
    path: '/krishnaden/chat-management',
    icon: <GroupsIcon sx={{color: `${colorPalette(1).CP9}`}}/>,
  }, {
    name: 'Messages',
    path: '/krishnaden/message-management',
    icon: <MessageIcon sx={{color: `${colorPalette(1).CP9}`}}/>,
  }
];
const SideBar = ({width = '100vw', drawer = false}) => {
  const location = useLocation();

  return <Stack
    width={width}
    sx={{
      height: "100vh",
      bgcolor: 'rgba(9,9,44,1)',
      color: `${colorPalette(1).CP8}`,
      padding: "3rem",
    }}
    spacing={"3rem"}
  >
    <Typography variant={"h3"}>NoviConnect</Typography>
    <Stack spacing={"1rem"}>
      {
        adminTabs.map((tab) => (
          <Link key={tab.path} to={tab.path} sx={{
            backgroundColor: location.pathname === tab.path ? `${colorPalette(0.2).CP5}` : 'transparent',
          }}>
            <Stack
              direction={"row"}
              spacing={"1rem"}
              alignItems={"center"}
            >
              {tab.icon}
              <Typography variant={"h5"} fontWeight={"bolder"} sx={{color: `${colorPalette(1).CP9}`}}>
                {tab.name}
              </Typography>
            </Stack>
          </Link>
        ))
      }
    </Stack>
  </Stack>
}

const AdminLayout = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMobile = () => setIsSidebarOpen((prevState) => !prevState);
  const handleClose = () => setIsSidebarOpen(false);

  return (
    <Grid container minHeight={"100vh"} color={colorPalette().CP8}>
      <Box
        sx={{
          display: {xs: "block", md: "none"},
          bgcolor: 'rgba(9,9,44,0.9)',
          position: 'fixed',
          textAlign: 'center',
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobile}>
          {!isSidebarOpen ? <MenuIcon style={{color: `${colorPalette().CP8}`}}/> :
            <MenuCloseIcon style={{color: `${colorPalette().CP8}`}}/>}
        </IconButton>
      </Box>
      <Grid item md={4} lg={3} sx={{display: {xs: "none", md: "block"}, bgcolor: 'rgba(9,9,44,0.9)'}}>
        <SideBar/>
      </Grid>
      <Grid item xs={12} md={8} lg={9} sx={{bgcolor: 'rgb(17,0,49)'}}>
        {children}
      </Grid>
      <Drawer open={isSidebarOpen} onClose={handleClose}>
        <SideBar width={`50vw`} drawer={true}/>
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;