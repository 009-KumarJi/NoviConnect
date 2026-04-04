import React from 'react';
import {Avatar, Stack, Typography} from "@mui/material";
import {
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalenderIcon,
  PermIdentityRounded as FaceIcon,
} from "@mui/icons-material";
import moment from "../../lib/dayjs.js";
import {transformImg} from "../../lib/features.js";
import {userTheme} from "../../constants/userTheme.constant.js";

const Profile = ({user}) => {
  return (
    <Stack spacing={"1.5rem"} direction="column" alignItems={"center"} sx={{color: userTheme.text}}>
      <Avatar
        src={transformImg(user?.avatar?.url, 350)}
        sx={{
          height: 200,
          width: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: `4px solid ${userTheme.borderStrong}`,
          boxShadow: userTheme.shadow,
        }}
      />
      <ProfileCard heading={"Bio"} text={user?.bio}/>
      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon/>}/>
      <ProfileCard heading={"Username"} text={user?.username} Icon={<UsernameIcon/>}/>
      <ProfileCard heading={"Joined"} text={moment(user?.createdAt).fromNow()} Icon={<CalenderIcon/>}/>
    </Stack>
  );
};

const ProfileCard = ({text, Icon, heading}) => (
  <Stack
    spacing="1rem"
    direction="row"
    alignItems="center"
    color={userTheme.text}
    textAlign="center"
    sx={{width: "100%", p: "1rem", borderRadius: "1rem", backgroundColor: "rgba(16, 27, 44, 0.72)", border: `1px solid ${userTheme.border}`}}
  >
    {Icon && Icon}
    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography variant="caption" color={userTheme.textMuted}>{heading}</Typography>
    </Stack>
  </Stack>
);

export default Profile;
