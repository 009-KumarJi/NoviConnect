import React, {useEffect, useState} from 'react';
import {Dialog, DialogTitle, InputAdornment, List, Slide, Stack, TextField} from "@mui/material";
import {useInputValidation} from "6pp";
import {Search as SearchIcon} from "@mui/icons-material";
import {colorPalette} from "../../constants/color.constant.js";
import UserItem from "../shared/UserItem.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setIsSearch} from "../../redux/reducers/miscSlice.js";
import {useLazySearchUserQuery, useSendFriendRequestMutation} from "../../redux/api/apiSlice.js";
import {useAsyncMutation} from "../../../hooks/hook.jsx";


const Search = () => {
  const dispatch = useDispatch();
  const search = useInputValidation("");
  const {isSearch} = useSelector(state => state["misc"]);
  const [users, setUsers] = useState([]);
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSFRequest] = useAsyncMutation(useSendFriendRequestMutation);
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (search.value)
        searchUser(search.value)
          .then(({data}) => setUsers(data.users))
          .catch()
    }, 600);
    return () => clearTimeout(timeOutId);
  }, [search.value]);
  const addFriendHandler = async (id) =>
    await sendFriendRequest("Sending Friend Request!", {ReceiverId: id})
  const searchCloseHandler = () => dispatch(setIsSearch(false));

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler} TransitionComponent={Slide} transitionDuration={300}>
      <Stack p={"2rem"} direction="column" width="25rem" sx={{
        backgroundImage: `linear-gradient(0deg, ${colorPalette().CP6}, ${colorPalette().CP8})`,
      }}>
        <DialogTitle textAlign="center">Find People</DialogTitle>
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
        <List sx={{
          overflowY: "auto",
          height: "60vh",
          '&::-webkit-scrollbar': {
            width: '0.3em',
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 0.5rem rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 0.5rem rgba(0,0,0,0.00)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: `${colorPalette().CP9}`,
            outline: '0.1rem solid slategrey',
          },
        }}>
          {
            users.map((user) =>
              <UserItem
                user={user}
                key={user._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSFRequest}
              />
            )
          }
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;