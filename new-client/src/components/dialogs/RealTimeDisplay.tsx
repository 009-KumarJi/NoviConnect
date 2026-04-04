import React, {useEffect, useState} from 'react';
import {Typography} from "@mui/material";
import moment from "../../lib/dayjs.js";
import {adminTheme} from "../../constants/adminTheme.constant.js";

const RealTimeDisplay = () => {
  const [time, setTime] = useState(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Typography
      display={{xs: "none", lg: "block"}}
      textAlign={"center"}
      sx={{color: adminTheme.textMuted, fontSize: "0.92rem", whiteSpace: "nowrap"}}
    >
      {time}
    </Typography>
  );
};

export default RealTimeDisplay;
