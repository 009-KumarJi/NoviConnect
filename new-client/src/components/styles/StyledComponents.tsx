import {keyframes, LinearProgress, Paper as PaperComponent, Skeleton, styled} from "@mui/material";
import {Link as LinkComponent} from "react-router-dom";
import {colorPalette, cursorHoveringChatName} from "../../constants/color.constant.js";


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

export const SearchField = styled('input')`
  width: 20vmax;
  padding: 1rem 2rem;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  background-color: ${colorPalette(0.4).CP4};
  font-size: 1.1rem;
  color: ${colorPalette().CP9};
`;

export const CurvedButton = styled('button')`
  padding: 1rem 2rem;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  background-color: ${colorPalette(0.4).CP4};
  font-size: 1.1rem;
  color: ${colorPalette().CP9};
  cursor: pointer;

  &:hover {
    background-color: ${colorPalette(0.2).CP5};
  }
`;

export const DarkPaper = styled(PaperComponent)`
  background-color: ${colorPalette(0.4).CP3};
  color: ${colorPalette().CP9};
  box-shadow: 0px 3px 2px ${colorPalette(0.5).CP6};
`;

const bounceAnimation = keyframes`
  0% {
    transform: scale(1)
  }
  50% {
    transform: scale(1.5)
  }
  100% {
    transform: scale(1)
  }
`
export const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite`,
}))

export const StyledLinearProgress = styled(LinearProgress)(({theme}) => ({
  height: '10px',
  borderRadius: '5px',
  '& .MuiLinearProgress-bar': {
    borderRadius: '5px',
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiLinearProgress-barColorPrimary': {
    backgroundColor: theme.palette.grey[200],
  },
}));