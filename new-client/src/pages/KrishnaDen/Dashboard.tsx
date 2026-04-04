// path: client/src/pages/KrishnaDen/Dashboard.jsx
import React, {useEffect, useState} from 'react';
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
import {useDashboardStatsQuery} from "../../redux/api/adminApiSlice.js";
import {useErrors} from "../../hooks/hook.jsx";
import {LayoutLoader} from "../../components/layout/Loaders.jsx";
import {sout} from "../../utils/helper.js";

const Dashboard = () => {

  const {data, isError, error, refetch, isLoading} = useDashboardStatsQuery();
  useErrors([{isError, error}]);
  sout(data)

  const [lineData, setLineData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [doughnutData, setDoughnutData] = useState([0, 0]);
  const [usersNumber, setUsersNumber] = useState(0);
  const [totalChatsNumber, setTotalChatsNumber] = useState(0);
  const [groupChatsNumber, setGroupChatsNumber] = useState(0);
  const [messagesNumber, setMessagesNumber] = useState(0);

  const allValues = {
    lineData,
    doughnutData,
    usersNumber,
    totalChatsNumber,
    groupChatsNumber,
    messagesNumber,
  }
  sout(allValues)

  useEffect(() => {
    if (data) {
      setLineData(data.statistics.messageChart);
      setUsersNumber(data.statistics.usersCount);
      setTotalChatsNumber(data.statistics.totalChatsCount);
      setGroupChatsNumber(data.statistics.groupsCount);
      setMessagesNumber(data.statistics.messagesCount);
      setDoughnutData([totalChatsNumber - groupChatsNumber, groupChatsNumber])
    }
  }, [data, lineData, usersNumber, totalChatsNumber, groupChatsNumber, messagesNumber]);


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
        maxWidth: "40rem",
      }}>
        <Typography margin={"2rem 0"} variant={"h4"}>
          Last Messages
        </Typography>
        <LineChart value={lineData}/>
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
        <DoughnutChart labels={["Single Chats", "Group Chats"]} value={doughnutData}/>
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
      <Widget title={"Users"} value={usersNumber} icon={<PersonIcon/>}/>
      <Widget title={"Chats"} value={totalChatsNumber} icon={<GroupIcon/>}/>
      <Widget title={"Messages"} value={messagesNumber} icon={<MessageIcon/>}/>
    </Stack>
  )

  return (
    <AdminLayout>
      {
        isLoading ? <LayoutLoader/> :
          <Container component={"main"}>
            {AppBar}
            {ChartArea}
            {Widgets}
          </Container>
      }
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