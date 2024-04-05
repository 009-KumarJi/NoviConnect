import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography} from "@mui/material";
import {sampleUsers} from "../../constants/sampleData.js";
import UserItem from "../shared/UserItem.jsx";

const AddMemberDialog = ({addMember, isLoadingAddMember, chatID}) => {
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

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
    setSelectedMembers([]);
    setMembers([]);
  };

  return (
    <Dialog open onClose={closeHandler}>
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