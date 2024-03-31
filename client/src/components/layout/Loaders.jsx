import React from 'react';
import {Grid, Skeleton, Stack} from "@mui/material";

const LayoutLoader = () => {
  return <Grid container height={"calc(100vh - 4rem)"} spacing={"1rem"}>


    <Grid
      item
      sm={4} md={3}
      height={"100%"}
      sx={{
        display: {xs: "none", sm: "block"}
      }}
    >
      <Skeleton variant={"rectangular"} height={"100vh"}/>
    </Grid>


    <Grid
      item
      xs={12} sm={8} md={5} lg={6}
      height={"100%"}
    >
      <Stack spacing={"1rem"}>
        {
          Array.from({length: 12}).map((_, index) => <Skeleton key={index} variant={"rounded"} height={"5rem "}/>)
        }
      </Stack>
    </Grid>


    <Grid
      item
      md={4} lg={3}
      sx={{
        display: {xs: "none", md: "block"},
      }}
      height={"100%"}
    >
      <Skeleton variant={"rectangular"} height={"100vh"}/>
    </Grid>
  </Grid>;
};

export default LayoutLoader;