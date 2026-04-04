import React, {memo} from 'react';
import {Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography} from "@mui/material";
import {useAcceptFriendRequestMutation, useGetNotificationsQuery} from "../../redux/api/apiSlice.js";
import {useAsyncMutation, useErrors} from "../../hooks/hook.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setIsNotification} from "../../redux/reducers/miscSlice.js";
import {userTheme} from "../../constants/userTheme.constant.js";

const Notifications = () => {

  const dispatch = useDispatch();
  const {isNotification} = useSelector(state => state["misc"]);

  const {isLoading, data, error, isError, refetch} = useGetNotificationsQuery();
  useErrors([{isError, error}]);

  const [acceptRequestHook] = useAcceptFriendRequestMutation();
  const [friendRequest] = useAsyncMutation(acceptRequestHook);

  const notificationCloseHandler = () => dispatch(setIsNotification(false));
  const friendRequestHandler = async (requestId, status) => {
    notificationCloseHandler();
    await friendRequest(status ? "Request Accepting... " : "Request Rejecting...", {requestId, status});
    await refetch();
  };
  return (
    <Dialog open={isNotification} onClose={notificationCloseHandler} PaperProps={{sx: {borderRadius: "1.5rem", background: "linear-gradient(180deg, rgba(16, 27, 44, 0.98) 0%, rgba(10, 18, 30, 0.98) 100%)", border: `1px solid ${userTheme.border}`, color: userTheme.text}}}>
      <Stack p={{xs: "1rem", sm: "2rem"}} maxWidth={"25rem"}
             sx={{background: "transparent"}}>

        <DialogTitle sx={{color: userTheme.text}}>Notifications</DialogTitle>

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
                  : <Typography textAlign="center" sx={{color: userTheme.textMuted}}>No new notifications</Typography>
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
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            color: userTheme.text,
          }}
        >
          {`${name} sent you a friend request.`}
        </Typography>
        <Stack direction={{xs: "column", sm: "row"}}>

          <Button
            sx={{color: userTheme.accent}}
            onClick={() => handler({requestId, status: true})}
          >
            Accept
          </Button>
          <Button
            sx={{color: userTheme.danger}}
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
