import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack} from "@mui/material";

const ConfirmDeleteDialog = ({open, handleClose, deleteHandler}) => {
  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogTitle color={"error"} sx={{justifyContent: "center", alignSelf: "center"}}>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{justifyContent: "center", alignSelf: "center", padding: "1rem"}}>Are You Sure You Want To Delete This Group?</DialogContentText>

          <DialogActions sx={{justifyContent: "space-evenly", alignSelf: "center", padding: "1rem"}}>
            <Button color={"error"} variant={"text"} onClick={deleteHandler}>Just Delete It!</Button>
            <Button variant={"contained"} onClick={handleClose}>My Bad!</Button>
          </DialogActions>

      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;