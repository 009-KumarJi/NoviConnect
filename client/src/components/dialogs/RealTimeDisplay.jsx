import React, {useEffect, useState} from 'react';
import {Typography} from "@mui/material";
import moment from "moment";

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
    <Typography display={{xs: "none", lg: "block"}} textAlign={"center"}>
      {time}
    </Typography>
  );
};

export default RealTimeDisplay;