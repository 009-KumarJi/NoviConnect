import React, {memo} from 'react';
import {Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography} from "@mui/material";
import {colorPalette} from "../../constants/color.constant.js";
import {useAcceptFriendRequestMutation, useGetNotificationsQuery} from "../../redux/api/apiSlice.js";
import {useAsyncMutation, useErrors} from "../../hooks/hook.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setIsNotification} from "../../redux/reducers/miscSlice.js";

const Notifications = () => {

  const dispatch = useDispatch();
  const {isNotification} = useSelector(state => state["misc"]);

  const {isLoading, data, error, isError, refetch} = useGetNotificationsQuery();
  useErrors([{isError, error}]);

  const [friendRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const notificationCloseHandler = () => dispatch(setIsNotification(false));
  const friendRequestHandler = async (requestId, status) => {
    notificationCloseHandler();
    await friendRequest(status ? "Request Accepting... " : "Request Rejecting...", {requestId, status});
    await refetch();
  };
  return (
    <Dialog open={isNotification} onClose={notificationCloseHandler}>
      <Stack p={{xs: "1rem", sm: "2rem"}} maxWidth={"25rem"}
             sx={{backgroundImage: `linear-gradient(0deg, ${colorPalette().CP6}, ${colorPalette().CP8})`}}>

        <DialogTitle>Notifications</DialogTitle>

        {
          isLoading
            ? <Skeleton/>
            : <>
              {
                data?.allRequests?.length > 0
                  ? data?.allRequests
                    ?.map(
                      (notification) => (
                        <NotificationItem
                          requestId={notification._id}
                          sender={notification.sender}
                          handler={friendRequestHandler}
                          key={notification._id}
                        />
                      ))
                  : <Typography textAlign="center">No New Notifications(NNN)</Typography>
              }
            </>
        }

      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({sender, requestId, handler}) => {
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
        <Stack direction={{xs: "column", sm: "row"}}>

          <Button
            color="primary"
            onClick={() => handler({requestId, status: true})}
          >
            Accept
          </Button>
          <Button
            color="error"
            onClick={() => handler({requestId, status: false})}
          >
            Reject
          </Button>

        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;