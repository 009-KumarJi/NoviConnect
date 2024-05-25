import React from 'react';
import {Grid, Skeleton, Stack} from "@mui/material";
import {BouncingSkeleton} from "../styles/StyledComponents.jsx";

const LayoutLoader = () => {
  return <Grid container height={"calc(100vh - 4rem)"} spacing={"1rem"}>
    <Grid item sm={4} md={3} height={"100%"} sx={{
      display: {xs: "none", sm: "block"}
    }}
    >
      <Skeleton variant="rectangular" height={"100vh"}/>
    </Grid>
    <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
      <Stack spacing={"1rem"}>
        {
          Array
            .from({length: 12})
            .map((_, index) =>
              <Skeleton key={index} variant="rounded" height={"5rem "}/>
            )
        }
      </Stack>
    </Grid>


    <Grid item md={4} lg={3} height={"100%"} sx={{
      display: {xs: "none", md: "block"},
    }}
    >
      <Skeleton variant="rectangular" height={"100vh"}/>
    </Grid>
  </Grid>;
};

const TypingLoader = () => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      spacing="0.5rem"
      padding="0.5rem"
    >
      {
        Array
          .from({length: 4})
          .map((_, index) => (
            <BouncingSkeleton
              key={index}
              variant="circular"
              width={15}
              height={15}
              style={{animationDelay: `${0.1 + index * 0.2}s`}}
            />
          ))
      }
    </Stack>
  );
};

export {LayoutLoader, TypingLoader};