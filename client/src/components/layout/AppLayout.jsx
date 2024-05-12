import React, {useCallback, useEffect} from 'react';
import Header from "./Header.jsx";
import Title from "../shared/Title.jsx";
import {Drawer, Grid, Skeleton} from "@mui/material";
import ChatList from "../specific/ChatList.jsx";
import {useNavigate, useParams} from "react-router-dom";
import Profile from "../specific/Profile.jsx";
import {profileBackground} from "../../constants/color.constant.js";
import {useMyChatsQuery} from "../../redux/api/apiSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {setIsMobileMenu} from "../../redux/reducers/miscSlice.js";
import {useErrors, useSockets} from "../../hooks/hook.jsx";
import {getSocket} from "../../socket.jsx";
import {NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS} from "../../constants/events.constant.js";
import {incrementNotificationCount, setNewMessagesAlert} from "../../redux/reducers/chatSlice.js";
import {sout} from "../../utils/helper.js";
import {getOrSaveFromStorage} from "../../lib/features.js";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const socket = getSocket();
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();

    const ChatId = params.ChatId;

    const {isMobileMenu} = useSelector(state => state["misc"]);
    const {user} = useSelector(state => state.auth);
    const {newMessagesAlert} = useSelector(state => state['chat']);
    sout("New Messages Alert: ", newMessagesAlert)

    const {isLoading, data, isError, error, refetch} = useMyChatsQuery("");

    useErrors([{isError, error}])
    const handleDeleteChat = (_event, _id, groupChat) => {
      _event.preventDefault();
      sout("Delete Chat ID: ", _id, groupChat);
    }

    useEffect(() => {
      getOrSaveFromStorage({
        key: NEW_MESSAGE_ALERT,
        value: newMessagesAlert,
      })
    }, [newMessagesAlert]);

    const handleMobileMenuClose = () => dispatch(setIsMobileMenu(false));

    const newMessagesAlertListener = useCallback((data) => {
      if (data.ChatId === ChatId) return;
      dispatch(setNewMessagesAlert(data));
      sout("New Message Alert: ", data.ChatId);
    },[ChatId, dispatch]);

    const newRequestListener = useCallback(()=> {
      sout("New Request Alert...")
      dispatch(incrementNotificationCount());
    },[dispatch]);

    const refetchListener = useCallback(()=> {
      sout("Refetching Chats...")
      refetch();
      navigate("/");
    },[refetch, navigate]);

    const eventListeners = {
      [NEW_MESSAGE_ALERT]: newMessagesAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
    };

    useSockets(socket, eventListeners);

    return (
      <>
        <Title/>
        <Header/>
        {
          isLoading ? <Skeleton variant="rectangular" height={"4rem"}/> : (
            <Drawer
              open={isMobileMenu}
              onClose={handleMobileMenuClose}
            >
              <ChatList
                w="70vw"
                chats={data?.chats}
                ChatId={ChatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
              />
            </Drawer>
          )
        }
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: {xs: "none", sm: "block"}
            }}
            height={"100%"}
          >
            {
              isLoading ? <Skeleton/> : (
                <ChatList
                  chats={data?.chats}
                  ChatId={ChatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                />
              )
            }
          </Grid>
          <Grid
            item
            xs={12} sm={8} md={5} lg={6}
            height={"100%"}
          >
            <WrappedComponent {...props} ChatId={ChatId} user={user}/>
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
            <Profile user={user}/>
          </Grid>
        </Grid>
      </>
    )
  }
};

export default AppLayout;