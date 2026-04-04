// path: client/src/pages/KrishnaDen/Dashboard.jsx
import React, {useEffect, useState} from 'react';
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import {Box, Container, Stack, Typography} from "@mui/material";
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
import {adminTheme} from "../../constants/adminTheme.constant.js";

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
    padding: {xs: "1.2rem", md: "1.5rem"},
    margin: '0 0 2rem',
    borderRadius: '1.5rem',
    border: `1px solid ${adminTheme.border}`,
  }}>
    <Stack direction={{xs: "column", xl: "row"}} spacing={{xs: "1rem", xl: "1.25rem"}} alignItems={{xs: "stretch", xl: "center"}}>
      <Stack
        direction="row"
        spacing={"1rem"}
        alignItems={"center"}
        sx={{minWidth: {xl: "18rem"}, flexShrink: 0}}
      >
        <Box
          sx={{
            width: "3.4rem",
            height: "3.4rem",
            borderRadius: "1rem",
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, rgba(34, 211, 238, 0.22), rgba(14, 165, 233, 0.16))",
            border: `1px solid ${adminTheme.borderStrong}`,
          }}
        >
          <AdminPanelSettingsIcon sx={{fontSize: "2rem", color: adminTheme.accent}}/>
        </Box>
        <Box sx={{minWidth: 0}}>
          <Typography variant="overline" sx={{letterSpacing: "0.24rem", color: adminTheme.accent}}>
            Live Overview
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{fontSize: {xs: "2rem", md: "2.15rem"}, lineHeight: 1.05}}
          >
            KrishnaDen Dashboard
          </Typography>
        </Box>
      </Stack>
      <Stack
        direction={{xs: "column", lg: "row"}}
        spacing={"0.8rem"}
        alignItems={{xs: "stretch", lg: "center"}}
        sx={{flex: 1, minWidth: 0}}
      >
        <SearchField placeholder="Search surface" style={{width: "100%"}} />
        <CurvedButton>Scan</CurvedButton>
      </Stack>
      <Stack
        direction="row"
        spacing={"0.8rem"}
        alignItems={"center"}
        sx={{
          px: "1rem",
          py: "0.75rem",
          borderRadius: "999px",
          border: `1px solid ${adminTheme.border}`,
          backgroundColor: "rgba(7, 17, 31, 0.62)",
          flexShrink: 0,
          alignSelf: {xs: "flex-start", xl: "center"},
        }}
      >
        <RealTimeDisplay/>
        <NotificationsIcon sx={{color: adminTheme.textMuted}}/>
      </Stack>
    </Stack>
  </DarkPaper>

  const ChartArea =
    <Stack
      direction={{xs: "column", lg: "row"}}
      alignItems={"stretch"}
      justifyContent={"flex-start"}
      flexWrap={"wrap"}
      sx={{gap: "2rem"}}
    >
      <DarkPaper sx={{
        padding: {xs: "1.4rem", md: "2rem 2.5rem"},
        borderRadius: "1.5rem",
        flex: "1 1 44rem",
        minWidth: 0,
        border: `1px solid ${adminTheme.border}`,
      }}>
        <Typography variant="overline" sx={{letterSpacing: "0.22rem", color: adminTheme.accent}}>
          Traffic
        </Typography>
        <Typography margin={"0.5rem 0 1.5rem"} variant={"h4"} fontWeight={700}>
          Weekly Message Flow
        </Typography>
        <LineChart value={lineData}/>
      </DarkPaper>

      <DarkPaper sx={{
        padding: "1rem",
        borderRadius: "1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: {xs: "100%", sm: "100%"},
        position: "relative",
        flex: "0 1 19rem",
        minHeight: "22.5rem",
        border: `1px solid ${adminTheme.border}`,
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
          <GroupIcon sx={{color: adminTheme.accent}}/> <Typography sx={{color: adminTheme.textMuted}}>Vs </Typography>
          <PersonIcon sx={{color: adminTheme.text}}/>
        </Stack>

      </DarkPaper>
    </Stack>

  const Widgets = (
    <Stack
      padding={{xs: "1.5rem 0", md: "2rem 0 0"}}
      direction={{xs: "column", sm: "row"}}
      justifyContent={"space-between"}
      alignItems={"stretch"}
      flexWrap={"wrap"}
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
      borderRadius: "1.5rem",
      width: {xs: "100%", sm: "calc(50% - 1rem)", lg: "calc(33.333% - 1.35rem)"},
      border: `1px solid ${adminTheme.border}`,
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography variant="overline" sx={{letterSpacing: "0.22rem", color: adminTheme.accent}}>
        Metric
      </Typography>
      <Typography
        sx={{
          borderRadius: "50%",
          border: `6px solid ${adminTheme.borderStrong}`,
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: 700,
          backgroundColor: "rgba(34, 211, 238, 0.08)",
        }}
      >
        {value}
      </Typography>
      <Stack
        direction={"row"}
        spacing={"1rem"}
        alignItems={"center"}
      >
        <Box sx={{color: adminTheme.accent}}>
          {icon}
        </Box>
        <Typography sx={{fontWeight: 600}}>
          {title}
        </Typography>
      </Stack>
    </Stack>
  </DarkPaper>;
export default Dashboard;
