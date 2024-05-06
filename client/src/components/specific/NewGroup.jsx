import React, {useState} from 'react';
import {Button, Dialog, DialogTitle, Stack, TextField, Typography} from "@mui/material";
import {colorPalette} from "../../constants/color.constant.js";
import {sampleUsers} from "../../constants/sampleData.js";
import UserItem from "../shared/UserItem.jsx";
import {useInputValidation} from "6pp";

const NewGroup = () => {
  const groupName = useInputValidation("");
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const submitHandler = () => {
    console.log("Create group clicked");
  }

  const selectMemberHandler = (i) => {
    setSelectedMembers((prev) =>
      prev.includes(i) ?
        prev.filter(currElement => currElement !== i) :
        [...prev, i]
    );
  }
  console.log(selectedMembers);
  return (
    <Dialog open={true}>
      <Stack p={{xs: "1rem", sm: "3rem"}} width={"25rem"} spacing="2rem"
             sx={{backgroundImage: `linear-gradient(0deg, ${colorPalette().CP6}, ${colorPalette().CP8})`,}}>
        <DialogTitle variant="h4" textAlign="center">New Group</DialogTitle>
        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler}/>
        <Typography variant="body1">Members</Typography>
        <Stack>
          {
            members.map(i =>
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
          <Button color="error" variant="text" size="large">Cancel</Button>
          <Button color="primary" variant="contained" size="large" onClick={submitHandler}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;