import React, {lazy, memo, Suspense, useEffect, useState} from 'react'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {colorPalette} from "../constants/color.constant.js";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  Menu as MenuIcon
} from "@mui/icons-material";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Link} from "../components/styles/StyledComponents.jsx";
import AvatarCard from "../components/shared/AvatarCard.jsx";
import UserItem from "../components/shared/UserItem.jsx";
import {
  useChatDetailsQuery,
  useDeleteGroupChatMutation,
  useMyGroupsQuery,
  useRemoveMemberMutation,
  useRenameGroupChatMutation
} from "../redux/api/apiSlice.js";
import {useAsyncMutation, useErrors} from "../hooks/hook.jsx";
import {LayoutLoader} from "../components/layout/Loaders.jsx";
import {sout} from "../utils/helper.js";
import {useDispatch, useSelector} from "react-redux";
import {setIsAddMember} from "../redux/reducers/miscSlice.js";

const ConfirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog.jsx"));
const AddMemberDialog = lazy(() => import("../components/dialogs/AddMemberDialog.jsx"));

const Groups = () => {
  const navigate = useNavigate();
  const ChatId = useSearchParams()[0].get("group");
  const dispatch = useDispatch();

  const {isAddMember} = useSelector(state => state['misc']);

  const myGroups = useMyGroupsQuery("");
  sout("groups: ", myGroups);

  const groupDetails = useChatDetailsQuery(
    {ChatId, populate: true},
    {skip: !ChatId}
  );
  sout("groupName: ", groupDetails?.data?.chat?.name);

  const [renameGroup, isLoadingRenaming] = useAsyncMutation(useRenameGroupChatMutation);

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveMemberMutation);

  const [deleteGC, isLoadingDeleteGC] = useAsyncMutation(useDeleteGroupChatMutation);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);


  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  sout("groupMembers: ", groupMembers);
  sout("Full groupDetails: ", groupDetails);

  useErrors([
    {isError: myGroups.isError, error: myGroups.error},
    {isError: groupDetails.isError, error: groupDetails.error},
  ]);

  useEffect(() => {
    const {chat} = groupDetails?.data ?? {};

    if (chat) {
      const {name, members} = chat;
      setGroupName(name);
      setGroupNameUpdatedValue(name);
      setGroupMembers(members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setGroupMembers([]);
      setIsEdit(false);
    }
  }, [groupDetails.data]);

  const navigateHome = () => navigate("/");
  const handleMobile = () => setIsMobileOpen(prev => !prev);
  const handleMobileClose = () => setIsMobileOpen(false);
  const updateGroupNameHandler = async () => {
    setIsEdit(false);
    if (groupName === groupNameUpdatedValue) return;
    await renameGroup("Updating Group Chat Name...", {name: groupNameUpdatedValue, ChatId});
  };
  const openConfirmDeleteHandler = () => setConfirmDeleteDialog(true);
  const closeConfirmDeleteHandler = () => setConfirmDeleteDialog(false);
  const addMemberHandler = (members) => dispatch(setIsAddMember(true));
  const deleteHandler = async () => {
    await deleteGC("Deleting Group Chat...", ChatId);
    navigate("/groups");
  };
  const removeMemberHandler = async (id) => {
    await removeMember("Removing Member...", {ChatId, UserId: id});
  };

  useEffect(() => {
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [ChatId]);


  const IconButtons = <>

    <Box sx={{
      display: {
        xs: "block",
        sm: "none",
        position: "fixed",
        top: "1rem",
        right: "1rem",
      },
    }}>
      <IconButton onClick={handleMobile}>
        <MenuIcon/>
      </IconButton>
    </Box>


    <IconButton
      sx={{
        position: "absolute",
        top: "1rem",
        left: "1rem",
        backgroundColor: colorPalette(0.5).CP3,
        color: colorPalette(1).CP1,
        "&:hover": {
          backgroundColor: colorPalette(0.8).CP3,
          color: colorPalette(0.8).CP8,
        }
      }}
      onClick={navigateHome}
      disabled={isLoadingDeleteGC || isLoadingRenaming}
    >
      <HomeIcon/>
    </IconButton>
  </>;

  const GroupName =
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing="1rem"
      padding="3rem"
    >
      {
        isEdit ?
          <>
            <TextField
              onChange={e => setGroupNameUpdatedValue(e.target.value)}
              placeholder={groupNameUpdatedValue}
              variant="standard"
              value={groupNameUpdatedValue}
            />
            <IconButton onClick={updateGroupNameHandler} disabled={isLoadingRenaming}><DoneIcon/></IconButton>
          </> : <>
            <Typography variant="h4">{groupName}</Typography>
            <IconButton
              onClick={() => setIsEdit(true)}
              disabled={isLoadingRenaming || isLoadingDeleteGC}
            >
              <EditIcon/>
            </IconButton>
          </>
      }
    </Stack>;


  const ButtonGroup =
    <Stack
      direction={{
        sm: "row",
        xs: "column-reverse"
      }}
      spacing={"1rem"}
      p={{
        sm: "1rem",
        xs: "0.1rem",
        md: "1rem 4rem"
      }}
    >
      <Button
        size="large" color="error"
        variant="outlined" startIcon={<DeleteIcon/>}
        onClick={openConfirmDeleteHandler}
        disabled={isLoadingDeleteGC || isLoadingRenaming}
      >
        Delete Group
      </Button>
      <Button
        size="large" variant="contained"
        startIcon={<AddIcon/>} onClick={addMemberHandler}
        disabled={isLoadingDeleteGC || isLoadingRenaming}
      >
        Add Member
      </Button>
    </Stack>

  return myGroups?.isLoading ? <LayoutLoader/> : (
    <Grid container={true} height={"100vh"}>
      <Grid
        item={true} sm={4}
        sx={{display: {xs: "none", sm: "block"}}}
      >
        <GroupsList myGroups={myGroups?.data?.groups} ChatId={ChatId}/>
      </Grid>
      <Grid item={true} xs={12} sm={8} sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        padding: "1rem 3rem",
      }}>

        {IconButtons}

        {
          groupName && <>
            {GroupName}
            <Typography
              margin="1rem"
              alignSelf={"center"}
              variant="body2"
            >
              Group Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing="border-box"
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem"
              }}
              spacing={"0.35rem"}
              bgcolor={colorPalette(0.2).CP5}
              height={"50vh"}
              overflow={"auto"}
              borderRadius={"0.5rem"}
              sx={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
              marginBottom="2rem"
            >
              {
                isLoadingRemoveMember
                  ? <CircularProgress/>
                  : groupMembers
                    ?.map((i) => (
                      <UserItem
                        user={i} isSelected
                        key={i._id}
                        styling={{
                          boxShadow: `0 0 0 0.06rem ${colorPalette(0.4).CP1}`,
                          padding: "1rem 2rem",
                          borderRadius: "0.5rem"
                        }}
                        handler={removeMemberHandler}
                        admin={groupDetails?.data?.chat?.creator}
                      />
                    ))
              }
            </Stack>
            {ButtonGroup}
          </>
        }

      </Grid>
      {
        isAddMember && (
          <Suspense fallback={<Backdrop open/>}>
            <AddMemberDialog ChatId={ChatId}/>
          </Suspense>
        )
      }
      {
        confirmDeleteDialog && (
          <Suspense fallback={<Backdrop open/>}>
            <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler}
                                 deleteHandler={deleteHandler}/>
          </Suspense>
        )
      }

      <Drawer open={isMobileOpen} onClose={handleMobileClose} anchor={"right"}
              sx={{display: {xs: "block", sm: "none"}, backgroundColor: `${colorPalette(0.2).CP3}`}}>
        <GroupsList width="50vw" myGroups={myGroups?.data?.groups} ChatId={ChatId}/>
      </Drawer>
    </Grid>
  )
}

const GroupsList = ({width = "100%", myGroups = [], ChatId}) => (
  <Stack width={width} bgcolor={colorPalette(0.4).CP3} height={"100vh"} overflow={"auto"} sx={{
    "&::-webkit-scrollbar": {width: "0.6rem"},
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: `${colorPalette(0.2).CP3}`,
      borderRadius: "1rem",
    },
    "&::-webkit-scrollbar-track": {display: "none"},
    msOverflowStyle: 'none',
  }}>
    {
      myGroups?.length > 0
        ? myGroups
          .map(group =>
            <GroupListItem
              group={group}
              ChatId={ChatId}
              key={group._id}
            />
          )
        : <Typography textAlign="center" padding="1rem">
          No groups available
        </Typography>
    }
  </Stack>
);

const GroupListItem = memo(({group, ChatId}) => {
  const {name, avatar, _id} = group;
  return <Link to={`?group=${_id}`} onClick={e => {
    if (ChatId === _id) e.preventDefault()
  }}>
    <Stack direction="row" spacing="1rem" alignItems="center" sx={{
      color: (_id === ChatId) ? `${colorPalette(1).CP4}` : "unset",
    }}>
      <AvatarCard avatar={avatar}/>
      <Typography>{name}</Typography>
    </Stack>
  </Link>
});

export default Groups;
