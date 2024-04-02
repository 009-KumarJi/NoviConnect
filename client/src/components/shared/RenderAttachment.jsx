import React from 'react';
import {transformImg} from "../../lib/features.js";
import {FileOpen as FileOpenIcon} from "@mui/icons-material";

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" width="200px" controls={true}/>
    case "image":
      return <img src={transformImg(url, 200)} alt="attachment" width="200px" height="150px" style={{objectFit: "contain"}}/>
    case "audio":
      return <audio src={url} preload="none" controls={true}/>
    case "document":
      return <iframe src={url} width="200px" height="150px"/>
    default:
      return <FileOpenIcon/>
  }
};

export default RenderAttachment;