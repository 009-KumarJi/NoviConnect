import React, {useEffect, useState} from 'react';
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Table from "../../components/shared/Table.jsx";
import {Avatar, Skeleton} from "@mui/material";
import {transformImg} from "../../lib/features.js";
import {useAllUsersQuery} from "../../redux/api/adminApiSlice.js";
import {useErrors} from "../../hooks/hook.jsx";
import {sout} from "../../utils/helper.js";
import moment from "moment";


const columns = [
  { field: 'id', headerName: 'ID', headerClassName: "table-header", width: 200 },
  { field: 'avatar', headerName: 'Avatar', headerClassName: "table-header", width: 150, renderCell: (params) => <Avatar src={params.row.avatar} alt={params.row.name}/> },
  { field: 'username', headerName: 'Username', headerClassName: "table-header", width: 200 },
  { field: 'name', headerName: 'Name', headerClassName: "table-header", width: 200 },
  { field: 'email', headerName: 'Email', headerClassName: "table-header", width: 200 },
  { field: 'friends', headerName: 'Friends', headerClassName: "table-header", width: 150 },
  { field: 'groups', headerName: 'Groups', headerClassName: "table-header", width: 150 },
  { field: 'joinedAt', headerName: 'Joined At', headerClassName: "table-header", width: 200 },
];


const UserManagement = () => {

  const [rows, setRows] = useState([]);

  const {data, isError, error, refetch, isLoading} = useAllUsersQuery({});
  useErrors([{isError, error}]);
  sout(data)

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
      <Table heading={"All Users"} columns={columns} rows={rows} />
    </AdminLayout>
  );
};

export default UserManagement;