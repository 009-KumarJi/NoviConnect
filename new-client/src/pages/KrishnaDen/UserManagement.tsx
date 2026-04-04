import React, {useEffect, useState} from 'react';
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Table from "../../components/shared/Table.jsx";
import {Avatar, IconButton, Skeleton} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {transformImg} from "../../lib/features.js";
import {useAllUsersQuery, useDeleteUserMutation} from "../../redux/api/adminApiSlice.js";
import {useAsyncMutation, useErrors} from "../../hooks/hook.jsx";
import {sout} from "../../utils/helper.js";
import moment from "../../lib/dayjs.js";
import {adminTheme} from "../../constants/adminTheme.constant.js";


const columns = (deleteHandler, isDeleting) => [
  {field: 'id', headerName: 'ID', headerClassName: "table-header", width: 200},
  {
    field: 'avatar',
    headerName: 'Avatar',
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <Avatar src={params.row.avatar} alt={params.row.name}/>
  },
  {field: 'username', headerName: 'Username', headerClassName: "table-header", width: 200},
  {field: 'name', headerName: 'Name', headerClassName: "table-header", width: 200},
  {field: 'email', headerName: 'Email', headerClassName: "table-header", width: 200},
  {field: 'friends', headerName: 'Friends', headerClassName: "table-header", width: 150},
  {field: 'groups', headerName: 'Groups', headerClassName: "table-header", width: 150},
  {field: 'joinedAt', headerName: 'Joined At', headerClassName: "table-header", width: 200},
  {
    field: 'actions',
    headerName: 'Actions',
    headerClassName: "table-header",
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <IconButton
        onClick={() => deleteHandler(params.row.id, params.row.name)}
        disabled={isDeleting}
        sx={{color: adminTheme.danger}}
      >
        <DeleteIcon/>
      </IconButton>
    ),
  },
];


const UserManagement = () => {

  const [rows, setRows] = useState([]);
  const [deleteUserHook] = useDeleteUserMutation();
  const [deleteUser, isDeleting] = useAsyncMutation(deleteUserHook);

  const {data, isError, error, refetch, isLoading} = useAllUsersQuery({});
  useErrors([{isError, error}]);
  sout(data)

  const deleteHandler = async (userId, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    await deleteUser("Deleting user...", userId);
  };

  useEffect(() => {
    if (data) {
      setRows(data?.transformedUsers
        ?.map(i => ({
          ...i,
          id: i._id,
          groups: i.groupsCount,
          joinedAt: moment(i.joinedAt).format("MMMM Do YYYY, hh:mm:ss"),
          avatar: transformImg(i.avatar)
        })));
    }
  }, [data, isLoading]);

  return isLoading ? <Skeleton/> : (
    <AdminLayout>
      <Table heading={"All Users"} columns={columns(deleteHandler, isDeleting)} rows={rows}/>
    </AdminLayout>
  );
};

export default UserManagement;
