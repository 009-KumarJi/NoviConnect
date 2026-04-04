import {keyframes, LinearProgress, Paper as PaperComponent, Skeleton, styled} from "@mui/material";
import {Link as LinkComponent} from "react-router-dom";
import {colorPalette, cursorHoveringChatName} from "../../constants/color.constant.js";
import {adminTheme} from "../../constants/adminTheme.constant.js";
import {userTheme} from "../../constants/userTheme.constant.js";


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
  color: ${adminTheme.text};
  padding: 1rem;
  margin: 0.1rem 1rem 0.1rem 0.3rem;
  border-radius: 1.1rem;
  transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease;

  &:hover {
    background-color: ${adminTheme.accentSoft};
    border-color: ${adminTheme.borderStrong};
    transform: translateX(2px);
  }
`;
export const InputBox = styled('input')`
  width: 100%;
  height: 100%;
  padding: 0 3rem;
  border: 1px solid ${userTheme.border};
  outline: none;
  border-radius: 1rem;
  box-sizing: border-box;
  background: rgba(8, 15, 25, 0.92);
  color: ${userTheme.text};
  backdrop-filter: blur(10px);
`;

export const SearchField = styled('input')`
  width: 20vmax;
  padding: 1rem 2rem;
  border: 1px solid ${adminTheme.border};
  outline: none;
  border-radius: 999px;
  background-color: rgba(5, 12, 21, 0.76);
  font-size: 1.1rem;
  color: ${adminTheme.text};
`;

export const CurvedButton = styled('button')`
  padding: 0.95rem 1.4rem;
  border: none;
  outline: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%);
  font-size: 0.95rem;
  font-weight: 700;
  color: #04111d;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(34, 211, 238, 0.22);

  &:hover {
    background: linear-gradient(135deg, #67e8f9 0%, #22d3ee 100%);
  }
`;

export const DarkPaper = styled(PaperComponent)`
  background: linear-gradient(180deg, rgba(15, 29, 49, 0.96) 0%, rgba(10, 20, 34, 0.96) 100%);
  color: ${adminTheme.text};
  box-shadow: ${adminTheme.shadow};
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
