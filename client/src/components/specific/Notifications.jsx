import React, {memo} from 'react';
import {Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography} from "@mui/material";
import {colorPalette} from "../../constants/color.js";
import {sampleNotifications} from "../../constants/sampleData.js";

const Notifications = () => {
  const friendRequestHandler = (_id, accept) => {
    console.log("Friend request clicked", _id);
  }
  return (
    <Dialog open={true}>
      <Stack p={{xs: "1rem", sm: "2rem"}} maxWidth={"25rem"}
             sx={{backgroundImage: `linear-gradient(0deg, ${colorPalette.CP6}, ${colorPalette.CP8})`,}}>
        <DialogTitle>Notifications</DialogTitle>
        {
          // Notifications
          sampleNotifications.length > 0 ? (
            sampleNotifications.map(
              (notification) => (
                <NotificationItem _id={notification._id} sender={notification.sender} handler={friendRequestHandler}
                                  key={notification._id}/>
              ))
          ) : (<Typography textAlign="center">No New Notifications(NNN)</Typography>)
        }
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({sender, _id, handler}) => {
  const {name, avatar} = sender;
  return (
    <ListItem>
      <Stack
        direction="row"
        alignItems="center"
        spacing="1rem"
        width="100%"
      >
        <Avatar src={avatar}/>
        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%"
          }}
        >
          {`${name} sent you a friend request.`}
        </Typography>
        <Stack direction={{
          xs: "column",
          sm: "row"
        }}>
          <Button color="primary" onClick={() => handler({_id, accept: true})}>Accept</Button>
          <Button color="error" onClick={() => handler({_id, accept: false})}>Reject</Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;