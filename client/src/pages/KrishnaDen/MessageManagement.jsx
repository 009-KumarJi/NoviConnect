import React, {useEffect, useState} from 'react';
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import {Avatar, Box, Skeleton, Stack} from "@mui/material";
import Table from "../../components/shared/Table.jsx";
import {fileFormat, transformImg} from "../../lib/features.js";
import moment from "moment";
import RenderAttachment from "../../components/shared/RenderAttachment.jsx";
import {useAllMessagesQuery} from "../../redux/api/adminApiSlice.js";
import {useErrors} from "../../hooks/hook.jsx";
import {sout} from "../../utils/helper.js";


const columns = [
  {field: 'id', headerName: 'ID', headerClassName: "table-header", width: 200},
  {
    field: 'attachments', headerName: 'Attachments', headerClassName: "table-header", width: 200,
    renderCell: (params) =>
    {
      const {attachments} = params.row;
      return attachments.length > 0
        ? attachments.map((i, _) => {
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
  const {data, isError, error, refetch, isLoading} = useAllMessagesQuery({});
  useErrors([{isError, error}]);
  sout(data)

  useEffect(() => {
    if (data){
      setRows(data?.messages?.map(i => ({
        ...i,
        id: i._id,
        sender: {avatar: transformImg(i.sender.avatar, 50), name: i.sender.name},
        createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        groupChat: i.groupChat ? "Yes" : "No",
        attachments: i.attachments > 0 ? i.attachments.map(i => ({url: i.url, type: i.type})) : [],
      })));
    }
  }, [data, isLoading]);

  return isLoading ? <Skeleton/> : (
    <AdminLayout>
      <Table heading={"All Messages"} columns={columns} rows={rows} rowHeight={200}/>
    </AdminLayout>
  );

};

export default MessageManagement;