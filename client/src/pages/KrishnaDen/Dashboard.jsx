import React from 'react';
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import {Box, Container, Stack, Typography} from "@mui/material";
import {colorPalette} from "../../constants/color.constant.js";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Groups3 as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person4 as PersonIcon,
} from "@mui/icons-material";
import {CurvedButton, DarkPaper, SearchField} from "../../components/styles/StyledComponents.jsx";
import RealTimeDisplay from "../../components/dialogs/RealTimeDisplay.jsx";
import {DoughnutChart, LineChart} from "../../components/specific/Charts.jsx";

const Dashboard = () => {
  const AppBar = <DarkPaper sx={{
    padding: "2rem",
    margin: '2rem 0',
    borderRadius: '1rem',
  }}>
    <Stack direction={"row"} spacing={"2rem"} alignItems={"center"}>
      <AdminPanelSettingsIcon sx={{fontSize: "3rem"}}/>
      <SearchField/>
      <CurvedButton>Search</CurvedButton>
      <Box flexGrow={1}/>
      <RealTimeDisplay/>
      <NotificationsIcon/>
    </Stack>
  </DarkPaper>

  const ChartArea =
    <Stack
      direction={{xs: "column", lg: "row"}}
      alignItems={{xs: "center", lg: "stretch"}}
      justifyContent={"center"}
      flexWrap={"wrap"}
      sx={{gap: "2rem"}}
    >
      <DarkPaper sx={{
        padding: "2rem 3.5rem",
        borderRadius: "1rem",
        width: "100%",
        maxWidth: "45rem",
      }}>
        <Typography margin={"2rem 0"} variant={"h4"}>
          Last Messages
        </Typography>
        <LineChart value={[65, 59, 80, 81, 56, 55, 40]}/>
      </DarkPaper>

      <DarkPaper sx={{
        padding: "1rem",
        borderRadius: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: {xs: "100%", sm: "50%"},
        position: "relative",
        maxWidth: "25rem",
      }}>
        <DoughnutChart labels={["Single Chats", "Group Chats"]} value={[20, 80]}/>
        <Stack
          position={"absolute"}
          direction={"row"}
          spacing={"0.5rem"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}
          width={"100%"}
          height={"100%"}
        >
          <GroupIcon/> <Typography>Vs </Typography>
          <PersonIcon/>
        </Stack>

      </DarkPaper>
    </Stack>

  const Widgets = (
    <Stack
      padding={"2rem"}
      direction={{xs: "column", sm: "row"}}
      justifyContent={"space-between"}
      alignItems={"center"}
      spacing={"2rem"}
    >
      <Widget title={"Users"} value={"100"} icon={<PersonIcon/>}/>
      <Widget title={"Chats"} value={"10"} icon={<GroupIcon/>}/>
      <Widget title={"Messages"} value={"1000"} icon={<MessageIcon/>}/>
    </Stack>
  )

  return (
    <AdminLayout>
      <Container component={"main"}>
        {AppBar}

        {ChartArea}

        {Widgets}
      </Container>
    </AdminLayout>
  );

};

const Widget = ({title, value, icon}) =>
  <DarkPaper
    sx={{
      padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1.5rem",
      width: "20rem",
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
        sx={{
          borderRadius: "50%",
          border: `6px solid ${colorPalette().CP9}`,
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value}
      </Typography>
      <Stack
        direction={"row"}
        spacing={"1rem"}
        alignItems={"center"}
      >
        {icon}
        <Typography>
          {title}
        </Typography>
      </Stack>
    </Stack>
  </DarkPaper>;
export default Dashboard;