import React, {useState} from 'react';
import {Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography} from "@mui/material";
import {colorPalette} from "../../constants/color.constant.js";
import UserItem from "../shared/UserItem.jsx";
import {useInputValidation} from "6pp";
import {useAvailableFriendsQuery, useNewGroupChatMutation} from "../../redux/api/apiSlice.js";
import {sout} from "../../utils/helper.js";
import {useAsyncMutation, useErrors} from "../../hooks/hook.jsx";
import {useDispatch, useSelector} from "react-redux";
import toast from "react-hot-toast";
import {setIsNewGroup} from "../../redux/reducers/miscSlice.js";

const NewGroup = () => {
  const {isNewGroup} = useSelector((state) => state['misc']);
  const dispatch = useDispatch();

  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const {isError, error, data, isLoading} = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupChatMutation);
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
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{xs: "1rem", sm: "3rem"}} width={"25rem"} spacing="2rem"
             sx={{backgroundImage: `linear-gradient(0deg, ${colorPalette().CP6}, ${colorPalette().CP8})`}}>
        <DialogTitle variant="h4" textAlign="center">
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />
        <Typography variant="body1">Members</Typography>
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
            color="error" variant="text"
            size="large" onClick={closeHandler}
            disabled={isLoadingNewGroup}
          >
            Cancel
          </Button>
          <Button
            color="primary" variant="contained"
            size="large" onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;