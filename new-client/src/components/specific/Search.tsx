import React, {useEffect, useState} from 'react';
import {Dialog, DialogTitle, InputAdornment, List, Slide, Stack, TextField} from "@mui/material";
import {useInputValidation} from "../../hooks/useCustomForm";
import {Search as SearchIcon} from "@mui/icons-material";
import UserItem from "../shared/UserItem.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setIsSearch} from "../../redux/reducers/miscSlice.js";
import {useLazySearchUserQuery, useSendFriendRequestMutation} from "../../redux/api/apiSlice.js";
import {useAsyncMutation} from "../../hooks/hook.jsx";
import {sout} from "../../utils/helper.js";
import {userTheme} from "../../constants/userTheme.constant.js";


const Search = () => {
  const dispatch = useDispatch();
  const {isSearch} = useSelector(state => state["misc"]);

  const search = useInputValidation("");
  const [users, setUsers] = useState([]);

  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequestHook] = useSendFriendRequestMutation();
  const [sendFriendRequest, isLoadingSFRequest] = useAsyncMutation(sendFriendRequestHook);

  useEffect(() => {

    const timeOutId = setTimeout(() => {
      search.value &&
      searchUser(search.value)
        .then(({data}) => setUsers(data.users))
        .catch(e => sout(e));
    }, 500);

    return () => clearTimeout(timeOutId);

  }, [search.value]);

  const addFriendHandler = async (id) => await sendFriendRequest("Sending Friend Request...", {ReceiverId: id})
  const searchCloseHandler = () => dispatch(setIsSearch(false));

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler} TransitionComponent={Slide} transitionDuration={300} PaperProps={{sx: {borderRadius: "1.5rem", background: "linear-gradient(180deg, rgba(16, 27, 44, 0.98) 0%, rgba(10, 18, 30, 0.98) 100%)", border: `1px solid ${userTheme.border}`, color: userTheme.text}}}>
      <Stack p={"2rem"} direction="column" width="25rem" sx={{
        background: "transparent",
      }}>
        <DialogTitle textAlign="center" sx={{color: userTheme.text}}>
          Find People
        </DialogTitle>
        <TextField
          label={""}
          value={search.value}
          onChange={search.changeHandler}
          variant={"outlined"}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position={"start"}>
                <SearchIcon sx={{color: userTheme.textMuted}}/>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: userTheme.text,
              backgroundColor: "rgba(8, 15, 25, 0.88)",
              borderRadius: "1rem",
              "& fieldset": {borderColor: userTheme.border},
              "&:hover fieldset": {borderColor: userTheme.borderStrong},
              "&.Mui-focused fieldset": {borderColor: userTheme.accent},
            },
          }}
        />
        <List sx={{
          overflowY: "auto",
          height: "60vh",
          '&::-webkit-scrollbar': {width: '0.3em'},
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 0.5rem rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 0.5rem rgba(0,0,0,0.00)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: `${userTheme.accentSoft}`,
            outline: `0.1rem solid ${userTheme.border}`,
          },
        }}>
          {
            users
              ?.map((user) =>
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
