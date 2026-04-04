import React from 'react';
import {Box, Container, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {DarkPaper} from "../styles/StyledComponents.jsx";
import {adminTheme} from "../../constants/adminTheme.constant.js";

const Table = ({rows, columns, heading, rowHeight = 52}) => {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        minHeight: '100vh',
        py: {xs: 1, md: 2},
      }}>
      <DarkPaper
        sx={{
          width: "100%",
          padding: {xs: "1rem", md: "1.5rem"},
          borderRadius: "1.5rem",
          margin: "auto",
          overflow: "hidden",
          height: "100%",
          border: `1px solid ${adminTheme.border}`,
          boxShadow: adminTheme.shadow,
        }}
      >
        <Box sx={{px: {xs: 1, md: 2}, pt: 1, pb: 3}}>
          <Typography variant="overline" sx={{letterSpacing: "0.24rem", color: adminTheme.accent}}>
            KrishnaDen
          </Typography>
          <Typography variant="h4" sx={{fontWeight: 700, color: adminTheme.text}}>
            {heading}
          </Typography>
        </Box>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          style={{
            height: "80%",
            scrollbarWidth: "thin",
            scrollbarColor: `${adminTheme.textMuted} transparent`,
            color: adminTheme.text,
            fontWeight: "normal"
          }}
          sx={{
            border: "none",
            backgroundColor: "transparent",
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${adminTheme.border}`,
              background: "linear-gradient(180deg, rgba(16, 31, 50, 0.95) 0%, rgba(11, 22, 40, 0.95) 100%)",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid rgba(148, 163, 184, 0.08)`,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "rgba(34, 211, 238, 0.06)",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: `1px solid ${adminTheme.border}`,
            },
            "& .MuiDataGrid-toolbarContainer, & .MuiTablePagination-root, & .MuiDataGrid-selectedRowCount": {
              color: adminTheme.textMuted,
            },
            ".table-header": {
              backgroundColor: "transparent",
              color: adminTheme.text,
              fontWeight: "bold",
            },
          }}
        />


      </DarkPaper>
    </Container>
  );
};

export default Table;
