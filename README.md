# NoviConnect

A MERN Chat App using ReactJS, Express.js, Node.js, MongoDB, and Socket.IO.

## Tech Stack

- **Frontend**: ReactJS
- **Backend**: NodeJS, Express
- **Database**: MongoDB
- **Real-time Communication**: Socket.IO
- **Authentication**: JWT
- **Styling**: Material-UI

## [`Deployed Demo`](https://noviconnect-client.vercel.app/)

## [`Backend Architecture`](./server/readme.md)
## [`Frontend Snapshots`](./client/readme.md)

## Features

The main features to add in the Chat App are:

- Users can register/log in with a username.
- Users can search for a user.
- Users can send a friend request to other users.
- The user will be notified about the request.
- Users can accept the friend request.
- Users can see the Chat list.
- Users can send messages or attachments in Chat.
- Users can create a Group Chat with a minimum of 3 members and a maximum of 100 members.
- Group admin can rename the Group, add members, or remove members.
- The group admin can delete the group.
- Group members can leave the group.
- If the Group admin leaves the group then a new Admin will be assigned.
- Users can delete a chat / unfriend a user.
- Admin Dashboard to see users, messages, and chats (Only Accessible with a Secret key).
