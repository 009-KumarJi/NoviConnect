import React, {useState} from 'react';
import {Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography} from "@mui/material";
import UserItem from "../shared/UserItem.jsx";
import {useInputValidation} from "../../hooks/useCustomForm";
import {useAvailableFriendsQuery, useNewGroupChatMutation} from "../../redux/api/apiSlice.js";
import {sout} from "../../utils/helper.js";
import {useAsyncMutation, useErrors} from "../../hooks/hook.jsx";
import {useDispatch, useSelector} from "react-redux";
import toast from "react-hot-toast";
import {setIsNewGroup} from "../../redux/reducers/miscSlice.js";
import {userTheme} from "../../constants/userTheme.constant.js";

const NewGroup = () => {
  const {isNewGroup} = useSelector((state) => state['misc']);
  const dispatch = useDispatch();

  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const {isError, error, data, isLoading} = useAvailableFriendsQuery();
  const [newGroupChatHook] = useNewGroupChatMutation();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(newGroupChatHook);
  sout("data: ", data);

  useErrors([{isError, error},]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter(currElement => currElement !== id)
        : prev.concat(id)
    );
  }
  sout("selectedMembers: ", selectedMembers);

  const submitHandler = async () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select at least 2 Members");

    sout(`creating new group... with name: ${groupName.value} and ${selectedMembers.length} members`);

    await newGroup(
      "Creating New Group...",
      {name: groupName.value, members: selectedMembers}
    );

    sout("Group created successfully!");

    closeHandler();
  }

  const closeHandler = () => dispatch(setIsNewGroup(false));

  return (
    <Dialog open={isNewGroup} onClose={closeHandler} PaperProps={{sx: {borderRadius: "1.5rem", background: "linear-gradient(180deg, rgba(16, 27, 44, 0.98) 0%, rgba(10, 18, 30, 0.98) 100%)", border: `1px solid ${userTheme.border}`, color: userTheme.text}}}>
      <Stack p={{xs: "1rem", sm: "3rem"}} width={"25rem"} spacing="2rem"
             sx={{background: "transparent"}}>
        <DialogTitle variant="h4" textAlign="center" sx={{color: userTheme.text}}>
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: userTheme.text,
              backgroundColor: "rgba(8, 15, 25, 0.88)",
              borderRadius: "1rem",
              "& fieldset": {borderColor: userTheme.border},
              "&:hover fieldset": {borderColor: userTheme.borderStrong},
              "&.Mui-focused fieldset": {borderColor: userTheme.accent},
            },
            "& .MuiInputLabel-root": {color: userTheme.textMuted},
          }}
        />
        <Typography variant="body1" sx={{color: userTheme.textMuted}}>Members</Typography>
        <Stack>
          {
            isLoading
              ? <Skeleton/>
              : data?.friends
                ?.map(i =>
                  <UserItem
                    user={i}
                    key={i._id}
                    handler={selectMemberHandler}
                    isSelected={selectedMembers.includes(i._id)}
                  />
                )
          }
        </Stack>
        <Stack direction="row" justifyContent="space-evenly">
          <Button
            sx={{color: userTheme.danger}} variant="text"
            size="large" onClick={closeHandler}
            disabled={isLoadingNewGroup}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large" onClick={submitHandler}
            disabled={isLoadingNewGroup}
            sx={{borderRadius: "999px", background: "linear-gradient(135deg, #5eead4 0%, #38bdf8 100%)", color: "#041019"}}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
