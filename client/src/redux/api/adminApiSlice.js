import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {server} from "../../constants/config.constant.js";

const adminApiSlice = createApi({
  reducerPath: "adminApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/admin/api/krishna-den`,
  }),
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    dashboardStats: builder.query({
      query: () => ({
        url: "/statistics",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Admin"],
    }),
    allUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Admin"],
    }),
    allChats: builder.query({
      query: () => ({
        url: "/chats",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Admin"],
    }),
    allMessages: builder.query({
      query: () => ({
        url: "/messages",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Admin"],
    }),
  }),
});

export default adminApiSlice;

export const {
  useDashboardStatsQuery,
  useAllUsersQuery,
  useAllChatsQuery,
  useAllMessagesQuery,
} = adminApiSlice;