import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography} from "@mui/material";
import {sampleUsers} from "../../constants/sampleData.js";
import UserItem from "../shared/UserItem.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setIsAddMember} from "../../redux/reducers/miscSlice.js";
import {useAsyncMutation} from "../../../hooks/hook.jsx";
import {useAddMembersMutation} from "../../redux/api/apiSlice.js";

const AddMemberDialog = ({ChatId}) => {

  const dispatch = useDispatch();

  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const {isAddMember} = useSelector(state => state['misc']);
  const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddMembersMutation);

  const selectMemberHandler = (i) => {
    setSelectedMembers((prev) =>
      prev.includes(i) ?
        prev.filter(currElement => currElement !== i) :
        [...prev, i]
    );
  }

  const addMemberSubmitHandler = () => {
    closeHandler()
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <DialogTitle textAlign="center">Add Member</DialogTitle>
      <DialogContent dividers sx={{maxHeight: 400, overflowY: 'auto'}}>
        <Stack spacing={"1rem"}>
          {members.length > 0 ? (
            members.map(user => (
              <UserItem key={user._id} user={user} handler={selectMemberHandler}
                        isSelected={selectedMembers.includes(user._id)}/>
            ))
          ) : (
            <Typography textAlign="center">No Friends</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{padding: 2, justifyContent: "space-evenly"}}>
        <Button color="error" variant="text" onClick={closeHandler}>
          Cancel
        </Button>
        <Button variant="contained" onClick={addMemberSubmitHandler} disabled={isLoadingAddMember}>
          Submit Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberDialog;