import React, {memo} from 'react';
import {Box, Typography} from "@mui/material";
import {colorPalette} from "../../constants/color.constant.js";
import moment from "moment";
import {fileFormat} from "../../lib/features.js";
import RenderAttachment from "./RenderAttachment.jsx";

const MessageComponent = ({message, loggedUser}) => {
  const {sender, content, attachments =[], createdAt} = message;
  const isSameSender = sender?._id === loggedUser?._id;
  const timeAgo = moment(createdAt).fromNow();
  return (
    <div
      style={{
        alignSelf: isSameSender ? "flex-end" : "flex-start",
        backgroundColor: "floralwhite",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content"
      }}
    >
      {!isSameSender && (<Typography fontWeight={600} variant="caption" color={colorPalette(0.8).CP3}>{sender.name}</Typography>)}
      {content && (<Typography>{content}</Typography>)}
      {
        attachments.length > 0 && (
          attachments.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormat(url);
            return (
              <Box key={index}>
                <a href={url} target="_blank" download={true} style={{color: "black"}}>
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            )
          }))
      }
      <Typography variant={"caption"} color={"text.secondary"}>{timeAgo}</Typography>
    </div>
  );
};

export default memo(MessageComponent);