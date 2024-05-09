import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {server} from "../../constants/config.constant.js";

const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/`
  }),
  tagTypes: ["Chat", "User", "Message"],
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
    getNotifications: builder.query({
      query: () => ({
        url: "user/notifications",
        method: "GET",
        credentials: "include"
      }),
      keepUnusedDataFor: 0
    }),
    AcceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: `user/accept-request`,
        method: "PUT",
        credentials: "include",
        body: data.requestId
      }),
      invalidatesTags: ["Chat"]
    }),
    chatDetails: builder.query({
      query({ChatId, populate=false}) {
        let url = `chat/${ChatId}`;
        if (populate) url += `?populate=true`;
        return {
          url,
          method: "GET",
          credentials: "include"
        }
      },
      providesTags: ["Chat"]
    }),
    getMessages: builder.query({
      query: ({ChatId, page= 1}) => ({
        url: `chat/message/${ChatId}?page=${page}`,
        method: "GET",
        credentials: "include"
      }),
      keepUnusedDataFor: 0,
    }),
    sendAttachments: builder.mutation({
      query: (data) => ({
        url: `chat/message`,
        method: "POST",
        credentials: "include",
        body: data
      }),
      invalidatesTags: ["Message"]
    }),
  })
});

export default apiSlice;
export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useGetMessagesQuery,
  useSendAttachmentsMutation,
} = apiSlice;