import React, {useState} from 'react';
import {Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemText, Stack, TextField} from "@mui/material";
import {useInputValidation} from "6pp";
import {Search as SearchIcon} from "@mui/icons-material";
import {colorPalette} from "../../constants/color.constant.js";
import UserItem from "../shared/UserItem.jsx";
import {sampleUsers} from "../../constants/sampleData.js";


const Search = () => {
  const search = useInputValidation("");
  const [users, setUsers] = useState(sampleUsers);
  const addFriendHandler = (id) => {
    console.log("Add friend clicked", id);
  }
  let isLoadingSendFriend = false;

  return (
    <Dialog open={true}>
      <Stack p={"2rem"} direction={"column"} width="25rem" sx={{
        backgroundImage: `linear-gradient(0deg, ${colorPalette().CP6}, ${colorPalette().CP8})`,
      }}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label={""}
          value={search.value}
          onChange={search.changeHandler}
          variant={"outlined"}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position={"start"}>
                <SearchIcon/>
              </InputAdornment>
            ),
          }}
        />
        <List>
          {
            users.map((user) =>
              <ListItem>
                <UserItem
                  user={user}
                  key={user._id}
                  handler={addFriendHandler}
                  handlerIsLoading={isLoadingSendFriend}
                />
              </ListItem>
            )
          }
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;