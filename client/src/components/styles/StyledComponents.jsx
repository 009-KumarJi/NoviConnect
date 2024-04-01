import {styled} from "@mui/material";
import {Link as LinkComponent} from "react-router-dom";
import {cursorHoveringChatName} from "../../constants/color.js";

export const VisuallyHiddenInput = styled('input')({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});

export const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  padding: 1rem;

  &:hover {
    background-color: ${cursorHoveringChatName};
  }
`;