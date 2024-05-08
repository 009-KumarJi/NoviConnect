import moment from "moment";
import {useCallback, useEffect, useRef, useState} from "react";

const fileFormat = (url= "") => {
  const fileExt = url.split(".").pop();
  if (["jpg", "jpeg", "png", "gif"].includes(fileExt)) {
    return "image";
  } else if (["mp4", "webm", "ogg"].includes(fileExt)) {
    return "video";
  } else if (["pdf", "doc", "docx", "xls", "xlsx"].includes(fileExt)) {
    return "document";
  } else if (["mp3", "wav"].includes(fileExt)) {
    return "audio";
  } else {
    return "file";
  }
};

const transformImg = (url="", width = 100) => url;

const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = Array.from(
    {length: 7},
    (_, i) =>
      currentDate.clone().subtract(i, 'days').format('dddd'));
  return last7Days.reverse();
}


export { fileFormat, transformImg, getLast7Days};
