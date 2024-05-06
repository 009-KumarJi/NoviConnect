import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {server} from "../../constants/config.constant.js";

const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/`
  }),
  tagTypes: ["Chat", "User"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chat/my-chats",
        method: "GET",
        credentials: "include"
      }),
      providesTags: ["Chat"]
    }),
    searchUser: builder.query({
      query: (search) => ({
        url: `user/search?name=${search.trim().replaceAll(" ", "+")}`,
        method: "GET",
        credentials: "include"
      }),
      providesTags: ["User"]
    }),
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: `user/send-request`,
        method: "PUT",
        credentials: "include",
        body: data
      }),
      invalidatesTags: ["User"]
    }),
  })
});

export default apiSlice;
export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} = apiSlice;