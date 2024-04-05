import React from 'react';
import {Avatar, AvatarGroup, Box, Stack} from "@mui/material";
import {transformImg} from "../../lib/features.js";


const AvatarCard = ({avatar = [], max = 4}) => {
  return (
    <Stack direction="row" spacing={0.5}>
      <AvatarGroup max={max} sx={{position: "relative"}}>
        <Box width={"5rem"} height={"3rem"}>
          {
            avatar.map(
              (i, index) => (
                <Avatar
                  key={Math.random() * 100}
                  src={transformImg(i)}
                  alt={`Avatar ${index}`}
                  sx={{
                    width: "3rem",
                    height: "3rem",
                    position: "absolute",
                    left: {
                      xs: `${0.5 + index}rem`,
                      sm: `${index}rem`,
                    }
                  }}
                />
              )
            )
          }
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;