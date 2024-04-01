import React from 'react';
import {Avatar, Stack, Typography} from "@mui/material";
import {
  PermIdentityRounded as FaceIcon,
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalenderIcon,
} from "@mui/icons-material";
import moment from "moment";
import {colorPalette} from "../../constants/color.js";

const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          height: 200,
          width: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white"
        }}
      />
      <ProfileCard heading={"Bio"} text={"Lorem ipsum dolor sit amet"} />
      <ProfileCard heading={"Name"} text={"John Doe"} Icon={<FaceIcon/>}/>
      <ProfileCard heading={"Username"} text={"johndoe"} Icon={<UsernameIcon/>}/>
      <ProfileCard heading={"Joined"} text={moment(`2021-11-05T00:00:00.000Z`).fromNow()} Icon={<CalenderIcon/>}/>
    </Stack>
  );
};

const ProfileCard = ({text, Icon, heading}) => (
    <Stack
      spacing={"1rem"}
      direction={"row"}
      alignItems={"center"}
      color={"white"}
      textAlign={"center"}
    >
      {Icon && Icon}
      <Stack>
        <Typography variant={"body1"}>{text}</Typography>
        <Typography variant={"caption"} color={colorPalette().CP7}>{heading}</Typography>
      </Stack>
    </Stack>
);

export default Profile;