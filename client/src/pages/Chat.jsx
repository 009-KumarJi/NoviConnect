import React, {useCallback, useEffect, useRef, useState} from 'react'
import AppLayout from "../components/layout/AppLayout.jsx";
import {IconButton, Skeleton, Stack} from "@mui/material";
import {colorPalette} from "../constants/color.constant.js";
import {AttachFile as AttachFileIcon, Send as SendIcon} from "@mui/icons-material";
import {InputBox} from "../components/styles/StyledComponents.jsx";
import FileMenu from "../components/dialogs/FileMenu.jsx";
import MessageComponent from "../components/shared/MessageComponent.jsx";
import {getSocket} from "../socket.jsx";
import {NEW_MESSAGE} from "../constants/events.constant.js";
import {useChatDetailsQuery, useGetMessagesQuery} from "../redux/api/apiSlice.js";
import {useErrors, useSockets} from "../../hooks/hook.jsx";
import {useInfiniteScrollTop} from "6pp";
import {useDispatch} from "react-redux";
import {setIsFileMenu} from "../redux/reducers/miscSlice.js";
import {sout} from "../utils/helper.js";


const Chat = ({ChatId, user}) => {

  const [page, setPage] = useState(1);
  const containerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const chatDetails = useChatDetailsQuery({ChatId, skip: !ChatId});
  const prevMessagesChunk = useGetMessagesQuery({ChatId, page});

  const members = chatDetails.data?.chat.members;
  const socket = getSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      setMessages([]);
      setPage(1);
      setMessage("");
      setPrevMessages([]);
    }
  }, [ChatId]);

  const newMessagesHandler = useCallback((data) => {
    if (data.ChatId !== ChatId) return;
    sout(data);
    setMessages(prevState => prevState.concat(data.message))
  }, [ChatId]);

  const {data: prevMessages, setData: setPrevMessages} = useInfiniteScrollTop(
    containerRef,
    prevMessagesChunk.data?.totalPages || 1,
    page,
    setPage,
    prevMessagesChunk.data?.messages || []
  );

  const eventHandler = {[NEW_MESSAGE]: newMessagesHandler};
  useSockets(socket, eventHandler);

  const allMessages = [...prevMessages, ...messages];
  useErrors([
    {isError: chatDetails.isError, error: chatDetails.error},
    {isError: prevMessagesChunk.isError, error: prevMessagesChunk.error}
  ]);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    // emitting message to server
    socket.emit(NEW_MESSAGE, {ChatId, members, message});
    setMessage("");
  }
  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  }
  return chatDetails.isLoading ? <Skeleton/> : (
    <>
      {/*Messages Render*/}
      <Stack
        ref={containerRef}
        boxSizing="border-box"
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={colorPalette(0.3).CP7}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {
          allMessages.map((msg) => {
              return (
                <MessageComponent key={msg._id} message={msg} loggedUser={user}/>
              )
            }
          )
        }
      </Stack>

      {/*Input*/}
      <form
        style={{
          height: `10%`,
        }}
        onSubmit={handleSubmit}
      >
        <Stack
          direction='row'
          height="100%"
          padding="1rem"
          alignItems="center"
          position="relative"
        >

          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "20deg"
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon/>
          </IconButton>

          <InputBox
            placeholder={"Type a messsage..."}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <IconButton
            type="submit"
            sx={{
              rotate: "-25deg",
              backgroundColor: colorPalette(0.4).CP5,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                backgroundColor: `${colorPalette(0.8).CP3}`
              }
            }}
          >
            <SendIcon/>
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} ChatId={ChatId}/>

    </>
  )
}
export default AppLayout()(Chat);