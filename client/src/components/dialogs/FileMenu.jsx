import React, {useRef} from 'react';
import {Box, ListItemText, Menu, MenuItem, MenuList} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {setIsFileMenu, setUploadingLoader} from "../../redux/reducers/miscSlice.js";
import {
  AudioFile as AudioIcon,
  Image as ImageIcon,
  InsertDriveFile as DocumentIcon,
  MovieFilter as VideoIcon
} from "@mui/icons-material";
import {paleBlueOpaque} from "../../constants/color.constant.js";
import toast from "react-hot-toast";
import {useSendAttachmentsMutation} from "../../redux/api/apiSlice.js";

const FileMenu = ({anchorE1, ChatId}) => {

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const documentRef = useRef(null);

  const {isFileMenu} = useSelector(state => state['misc']);
  const dispatch = useDispatch();
  const [sendAttachments] = useSendAttachmentsMutation();
  const selectRef = (ref) => ref.current?.click();
  const handleClose = () => dispatch(setIsFileMenu(false));
  const handleFileOpen = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;
    if (files.length > 5) return toast.error(`You can upload at most 5 ${key} at a time!`);

    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`Uploading ${files.length} ${files.length===1 ? key.slice(0, key.length-1) : key}...`);
    // fetch the files and upload them to the server
    try {
      const formData = new FormData();
      formData.append("ChatId", ChatId);
      files.forEach(file => formData.append("files", file));
      const res = await sendAttachments(formData);
      res.data
        ? toast.success(`${files.length===1 ? key.slice(0, key.length-1) : key} sent successfully!!!`, {id: toastId, icon: "🚀"})
        : toast.error(`Failed to send ${files.length===1 ? key.slice(0, key.length-1) : key}...`, {id: toastId, icon: "❌"});
    } catch (error) {
      toast(error.message, {id: toastId, icon: "❌"})
    } finally {
      dispatch(setUploadingLoader(false));
      dispatch(setIsFileMenu(false));
    }

  }

  return (
    <Menu open={isFileMenu} anchorEl={anchorE1} onClose={handleClose}>
      <Box sx={{
        width: "10rem"
      }}>
        <MenuList>
          <MenuItem onClick={() => selectRef(imageRef)}>
              <ImageIcon sx={{
                color: paleBlueOpaque,
                fontSize: "1.5rem"
              }}/>
            <ListItemText primary={"Image"} sx={{marginLeft: "1rem"}}/>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/gif, image/svg, image/webp"
              style={{ display: 'none' }}
              onChange={(e) => handleFileOpen(e, "images")}
              ref={imageRef}
            />
          </MenuItem>
          <MenuItem onClick={() => selectRef(audioRef)}>
              <AudioIcon sx={{
                color: paleBlueOpaque,
                fontSize: "1.5rem"
              }}/>
            <ListItemText primary={"Audio"} sx={{marginLeft: "1rem"}}/>
            <input
              type="file"
              multiple
              accept="audio/mpeg, audio/wav, audio/ogg, audio/midi, audio/aac"
              style={{ display: 'none' }}
              onChange={(e) => handleFileOpen(e, "audios")}
              ref={audioRef}
            />
          </MenuItem>
          <MenuItem onClick={() => selectRef(videoRef)}>
              <VideoIcon sx={{
                color: paleBlueOpaque,
                fontSize: "1.5rem"
              }}/>
            <ListItemText primary={"Video"} sx={{marginLeft: "1rem"}}/>
            <input
              type="file"
              multiple
              accept="video/mp4, video/webm, video/ogg, video/quicktime"
              style={{ display: 'none' }}
              onChange={(e) => handleFileOpen(e, "videos")}
              ref={videoRef}
            />
          </MenuItem>
          <MenuItem onClick={() => selectRef(documentRef)}>
            <DocumentIcon sx={{
              color: paleBlueOpaque,
              fontSize: "1.5rem"
            }}/>
            <ListItemText primary={"Document"} sx={{marginLeft: "1rem"}}/>
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileOpen(e, "documents")}
              ref={documentRef}
            />
          </MenuItem>
        </MenuList>
      </Box>
    </Menu>
  );
};

export default FileMenu;