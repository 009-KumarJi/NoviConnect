import {styled} from "@mui/material";
import {Link as LinkComponent} from "react-router-dom";
import {colorPalette, cursorHoveringChatName} from "../../constants/color.js";

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
  margin: 0.1rem 1rem 0.1rem 0.3rem;
  border-radius: 10rem;
  &:hover {
    background-color: ${cursorHoveringChatName};
  }
`;
export const InputBox = styled('input')`
  width: 100%;
  height: 100%;
  padding: 0 3rem;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  box-sizing: border-box;
  background-color: ${colorPalette(0.2).CP5};
`;