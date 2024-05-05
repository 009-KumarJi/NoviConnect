# Backend Architecture

This document outlines the structure and key components of the backend application.

## Table of Contents
- [Directory Descriptions](#directory-descriptions)
- [File Descriptions](#file-descriptions)
- [Server Flow](#server-flow)

## Directory Descriptions

| Directory                  | Description                                                                                           | Files                                                                                                                                                                                                                                                               |
|:---------------------------|-------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`server.js`](./server.js) | Main entry point of the backend application                                                           | Its a file only.                                                                                                                                                                                                                                                    |
| `routes/`                  | Contains route definitions for the backend                                                            | <ul><li><a href="#user-routes">user.routes.js</a></li><li><a href="#chat-routes">chat.routes.js</a></li><li><a href="#admin-routes">admin.routes.js</a></li></ul>                                                                                                   |
| `models/`                  | Contains data models for the application                                                              | <ul><li><a href="#user-model">user.model.js</a></li><li><a href="#chat-model">chat.model.js</a></li><li><a href="#message-model">message.model.js</a></li><li><a href="#request-model">request.model.js</a></li></ul>                                               |
| `controllers/`             | Contains controller logic for handling routes                                                         | <ul><li><a href="#user-controller">user.controller.js</a></li><li><a href="#chat-controller">chat.controller.js</a></li><li><a href="#admin-controller">admin.controller.js</a></li></ul>                                                                           |
| `middlewares/`             | Contains middleware functions for request processing                                                  | <ul><li><a href="#multer-middleware">multer.middleware.js</a></li><li><a href="#auth-middleware">auth.middleware.js</a></li><li><a href="#error-middleware">error.middleware.js</a></li><li><a href="#fileExists-middleware">fileExists.middleware.js</a></li></ul> |
| `utils/`                   | Contains utility functions used across the application                                                | <ul><li><a href="#features-utility">features.js</a></li><li><a href="#utility-utility">utility.js</a></li><li><a href="#validators-utility">validators.js</a></li></ul>                                                                                             |
| `constants/`               | Contains constant values used throughout the backend                                                  | <ul><li><a href="#events-constants-js">events.constants.js</a></li></ul>                                                                                                                                                                                            |
| `lib/`                     | Contains helper functions used across the application                                                 | <ul><li><a href="#chat-helper">chat.helper.js</a></li><li><a href="#cloudinary-helper">cloudinary.helper.js</a></li><li><a href="#socketio-helper">socketio.helper.js</a></li></ul>                                                                                 |
| `seeders/`                 | Contains scripts for seeding the database with initial data. *can be removed in production*           | <ul><li><a href="#user-seeder">user.seeder.js</a></li><li><a href="#chat-seeder">chat.seeder.js</a></li></ul>                                                                                                                                                       |
| [`.env`](./dummy.env)      | Configuration file for storing sensitive information like database connection strings, API keys, etc. | It's a file only                                                                                                                                                                                                                                                    |

## File Descriptions

| File Name                                                                                              | Description                                                                                                                                |
|--------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| <a id="user-routes">[`user.routes.js`](./routes/user.routes.js)</a>                                    | Contains routes for user-related operations such as login, registration, getMyProfile, searchUsers, etc.                                   |
| <a id="chat-routes">[`chat.routes.js`](./routes/chat.routes.js)</a>                                    | Contains routes for chat-related operations such as newGroupChat, getMyChats, getChat, etc.                                                |
| <a id="amdin-routes">[`admin.routes.js`](./routes/admin.routes.js)</a>                                 | Contains routes for admin-related operations such as getAllUsers, getAllChats, etc.                                                        |
| <a id="user-model">[`user.model.js`](./models/user.model.js)</a>                                       | Defines the User schema.                                                                                                                   |
| <a id="chat-model">[`chat.model.js`](./models/chat.model.js)</a>                                       | Defines the Chat schema.                                                                                                                   |
| <a id="message-model">[`message.model.js`](./models/message.model.js)</a>                              | Defines the Message schema.                                                                                                                |
| <a id="request-model">[`request.model.js`](./models/request.model.js)</a>                              | Defines the Request schema.                                                                                                                |
| <a id="user-controller">[`user.controller.js`](./controllers/user.controller.js)</a>                   | Handles user-related operations such as login and registration.                                                                            |
| <a id="chat-controller">[`chat.controller.js`](./controllers/chat.controller.js)</a>                   | Handles admin-related operations such as admin login/logout, getting admin data, getting all users, etc.                                   |
| <a id="admin-controller">[`admin.controller.js`](./controllers/admin.controller.js)</a>                |                                                                                                                                            |
| <a id="multer-middleware">[`multer.middleware.js`](./middlewares/multer.middleware.js)</a>             | Middleware for handling file uploads.                                                                                                      |
| <a id="auth-middleware">[`auth.middleware.js`](./middlewares/auth.middleware.js)</a>                   | Middleware for ensuring only authenticated users can access certain routes.                                                                |
| <a id="error-middleware">[`error.middleware.js`](./middlewares/error.middleware.js)</a>                | Middleware for handling errors during request processing.                                                                                  |
| <a id="fileExists-middleware">[`fileExists.middleware.js`](./middlewares/fileExists.middleware.js)</a> | Middleware for checking does a file exists in requests where it is needed.                                                                 |
| <a id="features-utility">[`features.js`](./utils/features.js)</a>                                      | Includes functions for database connection, JWT token generation, cookie configuration, logging events, and file deletion from Cloudinary. |
| <a id="utility-utility">[`utility.js`](./utils/utility.js)</a>                                         | Includes utility function for Custom Error Handling.                                                                                       |
| <a id="validators-utility">[`validators.js`](./utils/validators.js)</a>                                | Includes utility function for validating user input.                                                                                       |
| <a id="events-constants-js">[`events.constants.js`](./constants/events.constant.js)</a>                | Contains event names for socket.io communications.                                                                                         |
| <a id="chat-helper">[`chat.helper.js`](./lib/chat.helper.js)</a>                                       | Contains helper functions for chat-related operations such as getting members of a chat excluding the current user, etc.                   |
| <a id="cloudinary-helper">[`cloudinary.helper.js`](./lib/cloudinary.helper.js)</a>                     | Contains helper functions for cloudinary-related operations like creating a base64 string to send it as filepath, etc.                     |
| <a id="socketio-helper">[`socketio.helper.js`](./lib/socketio.helper.js)</a>                           | Contains helper functions for socket.io-related operations like retrieve active sockets for a list of users, creating room.                |
| <a id="user-seeder">[`user.seeder.js`](./seeders/user.seeder.js)</a>                                   | Seeds the database with creating new dummy users. **Note: Remove this file in production.**                                                |
| <a id="chat-seeder">[`chat.seeder.js`](./seeders/chat.seeder.js)</a>                                   | Seeds the database with creating new dummy chats and messages. **Note: Remove this file in production.**                                   |

## Server Flow

```
server/
├── server.js
├── package.json
├── .env
│
├── constants/
│   └── events.constant.js
│
├── controllers/
│   ├── admin.controller.js
│   ├── chat.controller.js
│   └── user.controller.js
│
├── lib/
│   ├── chat.helper.js
│   ├── cloudinary.helper.js
│   └── socketio.helper.js
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── fileExists.middleware.js
│   └── multer.middleware.js
│
├── models/
│   ├── chat.model.js
│   ├── message.model.js
│   ├── request.model.js
│   └── user.model.js
│
├── routes/
│   ├── admin.routes.js
│   ├── chat.routes.js
│   └── user.routes.js
│
├── seeders/
│   ├── chat.seeder.js
│   └── user.seeder.js
│
└── utils/
    ├── features.js
    ├── utility.js
    └── validators.js
```
