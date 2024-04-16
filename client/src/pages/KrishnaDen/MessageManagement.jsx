import React, {useEffect, useState} from 'react';
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import {Avatar, Box, Stack} from "@mui/material";
import Table from "../../components/shared/Table.jsx";
import {sampleDashboardData} from "../../constants/sampleData.js";
import {fileFormat, transformImg} from "../../lib/features.js";
import moment from "moment";
import RenderAttachment from "../../components/shared/RenderAttachment.jsx";


const columns = [
  {field: 'id', headerName: 'ID', headerClassName: "table-header", width: 200},
  {
    field: 'attachments', headerName: 'Attachments', headerClassName: "table-header", width: 200,
    renderCell: (params) =>
    {
      const {attachments} = params.row;
      return attachments.length > 0
        ? attachments.map((i, index) => {
          const url = i.url;
          const file = fileFormat(url);
          return <Box>
            <a href={url} target="_blank" rel="noreferrer" download={true} style={{color: "black"}}>
              {RenderAttachment(file, 50)}
            </a>
          </Box>
        })

        : "No Attachments";
    }
  },
  {field: 'content', headerName: 'Content', headerClassName: "table-header", width: 400, renderCell: (params) =>
      <span>
        {
          (params.row.content.length > 50)
            ? params.row.content.slice(0, 50) + "..."
            : (params.row.content.length > 0)
              ? params.row.content
              : "No Content"
        }</span>
      },
  {field: 'sender', headerName: 'Sent By', headerClassName: "table-header", width: 200, renderCell: (params) => <Stack direction="row" spacing="1rem" alignItems="center"><Avatar src={params.row.sender.avatar} alt={params.row.sender.name}/><span>{params.row.sender.name}</span></Stack>},
  {field: 'chat', headerName: 'Chat', headerClassName: "table-header", width: 220},
  {field: 'groupChat', headerName: 'Group Chat', headerClassName: "table-header", width: 100},
  {field: 'createdAt', headerName: 'Created At', headerClassName: "table-header", width: 250},
];
const MessageManagement = () => {

  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(sampleDashboardData.messages.map(i => ({
      ...i,
      id: i._id,
      sender: {avatar: transformImg(i.sender.avatar, 50), name: i.sender.name},
      createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
      groupChat: i.groupChat ? "Yes" : "No",
    })));
  }, []);

  return (
    <AdminLayout>
      <Table heading={"All Messages"} columns={columns} rows={rows} rowHeight={200}/>
    </AdminLayout>
  );
};

export default MessageManagement;