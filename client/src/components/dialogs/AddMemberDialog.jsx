import React, {useEffect, useState} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Slide,
  Stack,
  Typography
} from "@mui/material";
import UserItem from "../shared/UserItem.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setIsAddMember} from "../../redux/reducers/miscSlice.js";
import {useAsyncMutation, useErrors} from "../../hooks/hook.jsx";
import {useAddMembersMutation, useAvailableFriendsQuery} from "../../redux/api/apiSlice.js";
import {sout} from "../../utils/helper.js";

const AddMemberDialog = ({ChatId}) => {

  const dispatch = useDispatch();

  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const {isAddMember} = useSelector(state => state['misc']);
  const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddMembersMutation);

  const {isLoading, data, isError, error} = useAvailableFriendsQuery(ChatId);
  sout("Available Friends: ", data);

  useEffect(() => {
    data && setMembers(data.friends)
  }, [data]);

  useErrors([{isError, error}]);

  const selectMemberHandler = (i) => {
    setSelectedMembers((prev) =>
      prev.includes(i) ?
        prev.filter(currElement => currElement !== i) :
        [...prev, i]
    );
  }

  const addMemberSubmitHandler = async () => {
    await addMembers("Adding selected members...", {ChatId, members: selectedMembers})
    closeHandler()
  };

  const closeHandler = () => dispatch(setIsAddMember(false));

  return (
    <Dialog open={isAddMember} onClose={closeHandler} TransitionComponent={Slide} transitionDuration={300}>
      <DialogTitle textAlign="center">Add Member</DialogTitle>
      <DialogContent dividers sx={{maxHeight: 400, overflowY: 'auto'}}>
        <Stack spacing={"1rem"}>
          {isLoading ? <Skeleton/> : (members.length > 0 ? (
            members.map(user => (
              <UserItem key={user._id} user={user} handler={selectMemberHandler}
                        isSelected={selectedMembers.includes(user._id)}/>
            ))
          ) : (
            <Typography textAlign="center">No Friends</Typography>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{padding: 2, justifyContent: "space-evenly"}}>
        <Button color="error" variant="text" onClick={closeHandler}>
          Cancel
        </Button>
        <Button variant="contained" onClick={addMemberSubmitHandler} disabled={isLoadingAddMembers}>
          Submit Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberDialog;