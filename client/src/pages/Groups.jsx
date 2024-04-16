import React, {lazy, memo, Suspense, useEffect, useState} from 'react'
import {Backdrop, Box, Button, Drawer, Grid, IconButton, Stack, TextField, Typography} from "@mui/material";
import {colorPalette, darkPaleBlue, textDark} from "../constants/color.js";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceButton,
  Menu as MenuIcon
} from "@mui/icons-material";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Link} from "../components/styles/StyledComponents.jsx";
import AvatarCard from "../components/shared/AvatarCard.jsx";
import {sampleChats, sampleUsers} from "../constants/sampleData.js";
import UserItem from "../components/shared/UserItem.jsx";

const ConfirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog.jsx"));
const AddMemberDialog = lazy(() => import("../components/dialogs/AddMemberDialog.jsx"));

const Groups = () => {
  const navigate = useNavigate();
  const chatID = useSearchParams()[0].get("group");
  const isAddMember = false;

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const navigateBack = () => navigate("/");
  const handleMobile = () => setIsMobileOpen(!isMobileOpen);
  const handleMobileClose = () => setIsMobileOpen(false);
  const updateGroupNameHandler = () => setIsEdit(false);
  const openConfirmDeleteHandler = () => setConfirmDeleteDialog(true);
  const closeConfirmDeleteHandler = () => setConfirmDeleteDialog(false);
  const addMemberHandler = () => {
  };
  const deleteHandler = () => {
  };
  const removeMemberHandler = (id) => {
  };

  useEffect(() => {
    if (chatID) {
      setGroupName(`Group ${chatID}`);
      setGroupNameUpdatedValue(`Group ${chatID}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    }
  }, [chatID]);


  const IconBtns = <>

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
      onClick={navigateBack}
    >
      <KeyboardBackspaceButton/>
    </IconButton>
  </>;
  const GroupName = <Stack direction="row" alignItems="center" justifyContent="center" spacing="1rem" padding="3rem">
    {
      isEdit ?
        <>
          <TextField onChange={e => setGroupNameUpdatedValue(e.target.value)}
                     placeholder={groupNameUpdatedValue} variant="standard"/>
          <IconButton onClick={updateGroupNameHandler}><DoneIcon/></IconButton>
        </> : <>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton onClick={() => setIsEdit(true)}><EditIcon/> </IconButton>
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
      <Button size="large" color="error" variant="outlined" startIcon={<DeleteIcon/>}
              onClick={openConfirmDeleteHandler}>Delete Group</Button>
      <Button size="large" variant="contained" startIcon={<AddIcon/>} onClick={addMemberHandler}>Add Member</Button>
    </Stack>

  return (
    <Grid container={true} height={"100vh"}>
      <Grid
        item={true} sm={4}
        sx={{display: {xs: "none", sm: "block"}}}
      >
        <GroupsList myGroups={sampleChats} chatID={chatID}/>
      </Grid>
      <Grid item={true} xs={12} sm={8} sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        padding: "1rem 3rem",
      }}>

        {IconBtns}

        {
          groupName && <>
            {GroupName}
            <Typography margin="1rem" alignSelf={"flex-start"} variant={"body1"}>
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
                sampleUsers.map((i) => (
                  <UserItem
                    user={i} isSelected
                    key={i._id}
                    styling={{
                      boxShadow: `0 0 0 0.06rem ${colorPalette(0.4).CP1}`,
                      padding: "1rem 2rem",
                      borderRadius: "0.5rem"
                    }}
                    handler={removeMemberHandler}
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
            <AddMemberDialog/>
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
        <GroupsList width="50vw" myGroups={sampleChats} chatID={chatID}/>
      </Drawer>
    </Grid>
  )
}

const GroupsList = ({width = "100%", myGroups = [], chatID}) => (
  <Stack width={width} bgcolor={colorPalette(0.4).CP3} height={"100vh"} overflow={"auto"} sx={{
    "&::-webkit-scrollbar": {
      width: "0.6rem",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: `${colorPalette(0.2).CP3}`,
      borderRadius: "1rem",
    },
    "&::-webkit-scrollbar-track": {
      display: "none"
    },
    msOverflowStyle: 'none',
  }}>
    {
      (myGroups.length > 0)
        ? myGroups.map((group) => <GroupListItem group={group} chatID={chatID} key={group._id}/>)
        : <Typography textAlign="center" padding="1rem">No groups available</Typography>
    }
  </Stack>
);

const GroupListItem = memo(({group, chatID}) => {
  const {name, avatar, _id} = group;
  return <Link to={`?group=${_id}`} onClick={(e) => (chatID === _id) && e.preventDefault()}>
    <Stack direction="row" spacing="1rem" alignItems="center" sx={{
      color: (_id===chatID) ? `${colorPalette(1).CP4}` : "unset",

    }}>
      <AvatarCard avatar={avatar}/>
      <Typography>{name}</Typography>
    </Stack>
  </Link>
});

export default Groups;
