// path: client/src/components/layout/AdminLayout.jsx
import React, {useState} from 'react';
import {Box, Drawer, IconButton, Stack, Typography} from "@mui/material";
import {
  Close as MenuCloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups3 as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {useLocation} from "react-router-dom";
import {Link} from "../styles/StyledComponents.jsx";
import {sout} from "../../utils/helper.js"
import {useDispatch} from "react-redux";
import {adminLogout} from "../../redux/thunks/admin.js";
import {adminTheme} from "../../constants/adminTheme.constant.js";

const adminTabs = [
  {
    name: 'Dashboard',
    path: '/krishnaden/dashboard',
    icon: <DashboardIcon sx={{color: adminTheme.text}}/>,
  }, {
    name: 'Users',
    path: '/krishnaden/user-management',
    icon: <ManageAccountsIcon sx={{color: adminTheme.text}}/>,
  }, {
    name: 'Chats',
    path: '/krishnaden/chat-management',
    icon: <GroupsIcon sx={{color: adminTheme.text}}/>,
  }
];

const SideBar = ({width = '100vw', drawer = false}) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout())
    sout('logout');
  }

  return <Stack
    width={width}
    direction={"column"}
    p={{xs: "2rem", md: "2.2rem"}}
    sx={{
      height: "100vh",
      color: adminTheme.text,
      bgcolor: drawer ? adminTheme.bg : "transparent",
      backdropFilter: "blur(18px)",
      maxWidth: !drawer ? "100%" : "100vw",
      borderRight: drawer ? "none" : `1px solid ${adminTheme.border}`,
    }}
    spacing={"3rem"}
  >
    <Stack spacing={1}>
      <Typography
        variant={"overline"}
        sx={{letterSpacing: "0.32rem", color: adminTheme.accent, fontWeight: 700}}
      >
        KrishnaDen
      </Typography>
      <Typography variant={"h3"} fontWeight={700}>
        NoviConnect
      </Typography>
      <Typography sx={{color: adminTheme.textMuted, maxWidth: "18rem"}}>
        Internal command surface for admins, live metrics, and platform control.
      </Typography>
    </Stack>
    <Stack spacing={"0.75rem"}>
      {
        adminTabs.map((tab) => (
          <Link key={tab.path} to={tab.path} sx={{
            backgroundColor: location.pathname === tab.path ? adminTheme.accentSoft : "transparent",
            border: `1px solid ${location.pathname === tab.path ? adminTheme.borderStrong : "transparent"}`,
            boxShadow: location.pathname === tab.path ? "inset 0 0 0 1px rgba(110, 231, 255, 0.08)" : "none",
          }}>
            <Stack
              direction={"row"}
              spacing={"1rem"}
              alignItems={"center"}
            >
              {tab.icon}
              <Typography variant={"h6"} fontWeight={600} sx={{color: adminTheme.text}}>
                {tab.name}
              </Typography>
            </Stack>
          </Link>
        ))
      }

      <Link onClick={logoutHandler} sx={{marginTop: "0.75rem", border: `1px solid ${adminTheme.border}`}}>
        <Stack
          direction={"row"}
          spacing={"1rem"}
          alignItems={"center"}
        >
          <ExitToAppIcon sx={{color: adminTheme.danger}}/>
          <Typography variant={"h6"} fontWeight={600} sx={{color: adminTheme.text}}>
            Logout
          </Typography>
        </Stack>
      </Link>

    </Stack>
  </Stack>
}

const AdminLayout = ({children}) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMobile = () => setIsSidebarOpen((prevState) => !prevState);
  const handleClose = () => setIsSidebarOpen(false);

  return (
    <Box minHeight={"100vh"} color={adminTheme.text} sx={{background: adminTheme.gradient}}>
      <Box
        sx={{
          display: {xs: "block", md: "none"},
          bgcolor: adminTheme.panelSolid,
          border: `1px solid ${adminTheme.border}`,
          boxShadow: adminTheme.shadow,
          position: 'fixed',
          textAlign: 'center',
          right: "1rem",
          top: "1rem",
          borderRadius: "50%",
          zIndex: 1400,
        }}
      >
        <IconButton onClick={handleMobile}>
          {
            isSidebarOpen
              ? <MenuCloseIcon style={{color: adminTheme.text}}/>
              : <MenuIcon style={{color: adminTheme.text}}/>
          }
        </IconButton>
      </Box>

      <Box
        sx={{
          display: {xs: "none", md: "block"},
          position: "fixed",
          top: 0,
          left: 0,
          width: {md: "18.5rem", lg: "20rem"},
          height: "100vh",
          background: "linear-gradient(180deg, rgba(9, 18, 31, 0.92) 0%, rgba(6, 14, 24, 0.92) 100%)",
          zIndex: 10,
        }}
      >
        <SideBar/>
      </Box>

      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          ml: {xs: 0, md: "18.5rem", lg: "20rem"},
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            px: {xs: "1rem", md: "1.6rem", lg: "2.2rem"},
            py: {xs: "5rem", md: "2rem"},
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at 20% 15%, rgba(34, 211, 238, 0.08), transparent 22%), radial-gradient(circle at 80% 0%, rgba(59, 130, 246, 0.08), transparent 25%)",
            }}
          />
          <Box
            sx={{
              position: "relative",
              maxWidth: "74rem",
              mx: "auto",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>

      <Drawer open={isSidebarOpen} onClose={handleClose}>
        <SideBar width={`min(84vw, 22rem)`} drawer={true}/>
      </Drawer>
    </Box>
  );
};

export default AdminLayout;

