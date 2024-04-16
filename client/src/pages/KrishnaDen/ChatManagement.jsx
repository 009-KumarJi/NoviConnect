import React, {useEffect, useState} from 'react';
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Table from "../../components/shared/Table.jsx";
import {Avatar, Stack} from "@mui/material";
import {sampleDashboardData} from "../../constants/sampleData.js";
import {transformImg} from "../../lib/features.js";
import AvatarCard from "../../components/shared/AvatarCard.jsx";


const columns = [
  { field: 'id', headerName: 'ID', headerClassName: "table-header", width: 200 },
  { field: 'avatar', headerName: 'Avatar', headerClassName: "table-header", width: 150, renderCell: (params) => <Avatar src={params.row.avatar} alt={params.row.name}/> },
  { field: 'name', headerName: 'Name', headerClassName: "table-header", width: 300 },
  { field: 'totalMembers', headerName: 'Total Members', headerClassName: "table-header", width: 120 },
  { field: 'members', headerName: 'Members', headerClassName: "table-header", width: 150, renderCell: (params) => <AvatarCard avatar={params.row.members.avatar}/> },
  { field: 'totalMessages', headerName: 'Total Messages', headerClassName: "table-header", width: 120 },
  { field: 'creator', headerName: 'Created By', headerClassName: "table-header", width: 250, renderCell: (params) => <Stack direction="row" spacing="1rem" alignItems="center"><Avatar src={params.row.creator.avatar} alt={params.row.creator.name}/><span>{params.row.creator.name}</span></Stack>},
];


const ChatManagement = () => {

  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(sampleDashboardData.chats.map(i => ({
      ...i,
      id: i._id,
      avatar: i.avatar.map(j => transformImg(j,50)),
      members: {avatar: i.members.map(j => transformImg(j.avatar, 50)), id: i._id},
      creator: {avatar: transformImg(i.creator.avatar, 50), name: i.creator.name}
    })));
  }, []);

  return (
    <AdminLayout>
      <Table heading={"All Chats"} columns={columns} rows={rows}/>
    </AdminLayout>
  );
};


export default ChatManagement;