import React, {useRef} from 'react'
import AppLayout from "../components/layout/AppLayout.jsx";
import {IconButton, Stack} from "@mui/material";
import {colorPalette, darkPaleBlue} from "../constants/color.js";
import {AttachFile as AttachFileIcon, Send as SendIcon} from "@mui/icons-material";
import {InputBox} from "../components/styles/StyledComponents.jsx";
import FileMenu from "../components/dialogs/FileMenu.jsx";

const Chat = () => {
  const containerRef = useRef(null);

  return (
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
      </Stack>

      {/*Input*/}
      <form
        style={{
          height: `10%`,
        }}
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

          <InputBox placeholder={"Idhar se bhejo message"}/>

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
