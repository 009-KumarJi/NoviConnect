import React, {useCallback, useEffect, useRef, useState} from 'react'
import AppLayout from "../components/layout/AppLayout.jsx";
import {IconButton, Skeleton, Stack} from "@mui/material";
import {colorPalette} from "../constants/color.constant.js";
import {AttachFile as AttachFileIcon, Send as SendIcon} from "@mui/icons-material";
import {InputBox} from "../components/styles/StyledComponents.jsx";
import FileMenu from "../components/dialogs/FileMenu.jsx";
import {sampleMessages} from "../constants/sampleData.js";
import MessageComponent from "../components/shared/MessageComponent.jsx";
import {getSocket} from "../socket.jsx";
import {NEW_MESSAGE} from "../constants/events.constant.js";
import {useChatDetailsQuery} from "../redux/api/apiSlice.js";
import {useErrors, useSockets} from "../../hooks/hook.jsx";

const Chat = ({ChatId, user}) => {
  const containerRef = useRef(null);
  const socket = getSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatDetails = useChatDetailsQuery({ChatId, skip: !ChatId});
  const members = chatDetails.data?.chat.members;
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    // emit message to server
    socket.emit(NEW_MESSAGE, {ChatId, members, message});
    setMessage("");
  }
  const newMessagesHandler = useCallback((data) => {
    console.log(data);
    setMessages(prevState => prevState.concat(data.message))
  }, []);
  
  const eventHandler = {[NEW_MESSAGE]: newMessagesHandler};
  useSockets(socket, eventHandler);
  useErrors([{isError: chatDetails.isError, error: chatDetails.error}]);

  return chatDetails.isLoading ? <Skeleton/> : (
    <>
      {/*Messages Render*/}
      <Stack
        ref={containerRef}
        boxSizing="border-box"
        padding={`1rem`}
        spacing={`1rem`}
        height={`90%`}
        bgcolor={colorPalette(0.3).CP7}
      >
        {
          messages.map((msg) => {
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
          >
            <AttachFileIcon/>
          </IconButton>

          <InputBox
            placeholder={"Type a messsage..."}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />

          <IconButton type="submit"
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
      <FileMenu/>

    </>
  )
}
export default AppLayout()(Chat);