import React from 'react';
import {Container, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {DarkPaper} from "../styles/StyledComponents.jsx";
import {colorPalette} from "../../constants/color.js";

const Table = ({rows, columns, heading, rowHeight = 52}) => {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',

      }}>
      <DarkPaper
        sx={{
          width: "100%",
          padding: "1rem 4rem",
          borderRadius: "1rem",
          margin: "auto",
          overflow: "hidden",
          height: "100%",
          boxShadow: "none"
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            margin: "2rem",
            textTransform: "uppercase",

          }}
        >{heading}</Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          style={{
            height: "80%",
            scrollbarWidth: "thin",
            scrollbarColor: `${colorPalette(0.5).CP9} transparent`,
            color: "white",
            fontWeight: "normal"
          }}
          sx={{
            border: "none",
            ".table-header": {
              backgroundColor: colorPalette(.4).CP1,
              color: colorPalette().CP9,
              fontWeight: "bold",
            },
          }}
        />


      </DarkPaper>
    </Container>
  );
};

export default Table;