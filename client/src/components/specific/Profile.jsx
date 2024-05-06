import React from 'react';
import {Avatar, Stack, Typography} from "@mui/material";
import {
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalenderIcon,
  PermIdentityRounded as FaceIcon,
} from "@mui/icons-material";
import moment from "moment";
import {colorPalette} from "../../constants/color.constant.js";
import {transformImg} from "../../lib/features.js";

const Profile = ({user}) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        src={transformImg(user?.avatar?.url)}
        sx={{
          height: 200,
          width: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white"
        }}
      />
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon/>}/>
      <ProfileCard heading={"Username"} text={user?.username} Icon={<UsernameIcon/>}/>
      <ProfileCard heading={"Joined"} text={moment(user?.createdAt).fromNow()} Icon={<CalenderIcon/>}/>
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