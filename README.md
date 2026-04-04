# NoviConnect

A MERN Chat App using ReactJS, Express.js, TypeScript, NodeJS, MongoDB, and Socket.IO.

## Tech Stack

- **Frontend**: ReactJS (Vite), TypeScript, Redux Toolkit, Material-UI, Framer Motion
- **Backend**: NodeJS, Express, TypeScript, Socket.IO
- **Database**: MongoDB
- **Caching/Real-time**: Redis, Socket.IO
- **Authentication**: JWT
- **Cloud Storage**: Cloudinary

## Links

- **[`Video Demo`](https://www.linkedin.com/posts/krishna-kumar-975b25186_demo-httpslnkdingg88yqyn-after-about-activity-7195526884514807808--qZH?utm_source=share&utm_medium=member_android)**
- **[`Deployed Demo Legacy`](https://noviconnect-client.vercel.app/)**
- **[`Deployed Demo New`](https://noviconnect-client-v2.vercel.app/)**

## Setup and Architecture

The codebase has recently been updated to use a modern TypeScript stack, split across a Vite-based React client and a TypeScript-backed Express server.

- **[Frontend Architecture & Setup](./new-client/README.md)**
- **[Backend Architecture & Setup](./new-server/README.md)**

*(Note: The legacy JavaScript implementations are preserved in the `client/` and `server/` directories, but the active codebase is now `new-client/` and `new-server/`)*

## Features

The main features included in the Chat App are:

- **User Authentication**: Secure register/login with usernames and JWT.
- **Friend Connections**: Search users, send/accept friend requests, and manage connections.
- **Real-time Chat**: One-on-one and group messaging enabled by Socket.IO and Redis.
- **Group Management**: Create groups (3-100 members), manage members, and automatically handle admin reassignment.
- **Media Sharing**: Send attachments via Cloudinary integration.
- **Admin Dashboard**: Comprehensive view for users, messages, and chats (Accessible with a Secret key only).
- **Responsive UI**: Built with Material-UI and animated with Framer Motion.

