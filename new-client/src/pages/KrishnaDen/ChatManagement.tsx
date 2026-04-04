import React, {useEffect, useState} from 'react';
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Table from "../../components/shared/Table.jsx";
import {Avatar, Skeleton, Stack} from "@mui/material";
import {transformImg} from "../../lib/features.js";
import AvatarCard from "../../components/shared/AvatarCard.jsx";
import {useAllChatsQuery} from "../../redux/api/adminApiSlice.js";
import {useErrors} from "../../hooks/hook.jsx";
import {sout} from "../../utils/helper.js";


const columns = [
  {
    field: 'id',
    headerName: 'Chat ID',
    headerClassName: "table-header",
    width: 200
  },
  {
    field: 'groupChat',
    headerName: 'Group Chat',
    headerClassName: "table-header",
    width: 100
  },
  {
    field: 'avatar',
    headerName: 'Avatar',
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <AvatarCard avatar={params.row.avatar.avatar} max={100}/>
  },
  {
    field: 'name',
    headerName: 'Name',
    headerClassName: "table-header",
    width: 300
  },
  {
    field: 'totalMembers',
    headerName: 'Total Members',
    headerClassName: "table-header",
    width: 120
  },
  {
    field: 'members',
    headerName: 'Members',
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: 'totalMessages',
    headerName: 'Total Messages',
    headerClassName: "table-header",
    width: 120
  },
  {
    field: 'creator',
    headerName: 'Created By',
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) =>
      <Stack direction="row" spacing="1rem" alignItems="center">
        <Avatar src={params.row.creator.avatar} alt={params.row.creator.name}/>
        <span>{params.row.creator.name}</span>
      </Stack>
  },
];


const ChatManagement = () => {


  const {data, isError, error, refetch, isLoading} = useAllChatsQuery({});
  useErrors([{isError, error}]);
  sout(data?.chats[0])


  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (data) {
      setRows(data?.chats.map(i => ({
        ...i,
        groupChat: i.groupChat ? "Yes" : "No",
        id: i._id,
        avatar: {avatar: i.members.map(j => transformImg(j.avatar, 50))},
        members: i.members.map(j => j.name.toString().concat("\n")).toString(),
        creator: {avatar: transformImg(i.creator.avatar, 50), name: i.creator.name}
      })));
    }
  }, [data, isLoading]);

  return isLoading ? <Skeleton/> : (
    <AdminLayout>
      <Table heading={"All Chats"} columns={columns} rows={rows}/>
    </AdminLayout>
  );
};


export default ChatManagement;