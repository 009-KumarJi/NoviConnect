import React from 'react';
import Header from "./Header.jsx";
import Title from "../shared/Title.jsx";
import {Grid} from "@mui/material";
import ChatList from "../specific/ChatList.jsx";
import {sampleChats} from "../../constants/sampleData.js";
import {useParams} from "react-router-dom";
import Profile from "../specific/Profile.jsx";
import {profileBackground} from "../../constants/color.js";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {

    const params = useParams();
    const chatID = params.chatID;
    const handleDeleteChat = (_event, _id, groupChat) => {
      _event.preventDefault();
      console.log("Delete Chat ID: ", _id, groupChat);
    }


    return (
      <>
        <Title/>
        <Header/>
        <Grid container height={"calc(100vh - 4rem)"}>


          <Grid
            item
            sm={4} md={3}
            height={"100%"}
            sx={{
              display: {xs: "none", sm: "block"}
            }}
          >
            <ChatList
              chats={sampleChats}
              chatID={chatID}
              handleDeleteChat={handleDeleteChat}
            />
          </Grid>


          <Grid
            item
            xs={12} sm={8} md={5} lg={6}
            height={"100%"}
          >
            <WrappedComponent {...props}/>
          </Grid>


          <Grid
            item
            md={4} lg={3}
            sx={{
              display: {xs: "none", md: "block"},
              padding: "2rem",
              bgcolor: profileBackground,
            }}
            height={"100%"}
          >
            <Profile />
          </Grid>
        </Grid>
      </>
    )
  }
};

export default AppLayout;