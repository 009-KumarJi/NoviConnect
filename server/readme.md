# Backend Architecture

This document outlines the structure and key components of the backend application.

## Project Structure

| Directory                     | Description                                                 | Files                                                                                                                              |
|-------------------------------|-------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [routes/](./routes)           | Contains route definitions for the backend                  | [user.routes.js](#user-routes), [chat.routes.js](#chat-routes)                                                                     |
| [models/](./models)           | Contains data models for the application                    | [user.model.js](#user-model), [chat.model.js](#chat-model), [message.model.js](#message-model), [request.model.js](#request-model) |
| [controllers/](./controllers) | Contains controller logic for handling routes               | [user.controller.js](#user-controller), [chat.controller.js](#chat-controller)                                                     |
| [middlewares/](./middlewares) | Contains middleware functions for request processing        | [multer.middleware.js](#multer-middleware), [auth.middleware.js](#auth-middleware), [error.middleware.js](#error-middleware)       |
| [utils/](./utils)             | Contains utility functions used across the application      | [features.js](#features-utility), [utility.js](#utility-utility), [validators.js](#validators-utility)                             |
| [constants/](./constants)     | Contains constant values used throughout the backend        | [events.constants.js](#events-constants-js)                                                                                           |
| [lib/](./lib)                 | Contains helper functions used across the application       | [chat.helper.js](#chat-helper)                                                                                                     |
| [seeders/](./seeders)         | Contains scripts for seeding the database with initial data | [user.seeder.js](#user-seeder), [chat.seeder.js](#chat-seeder)                                                                     |

## File Descriptions

| File Name                                                                                | Description                                                                                                                                |
|------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| <a id="user-routes">[user.routes.js](./routes/user.routes.js)</a>                        | Contains routes for user-related operations such as login, registration, getMyProfile, searchUsers, etc.                                   |
| <a id="chat-routes">[chat.routes.js](./routes/chat.routes.js)</a>                        | Contains routes for chat-related operations such as newGroupChat, getMyChats, getChat, etc.                                                |
| <a id="user-model">[user.model.js](./models/user.model.js)</a>                           | Defines the User schema.                                                                                                                   |
| <a id="chat-model">[chat.model.js](./models/chat.model.js)</a>                           | Defines the Chat schema.                                                                                                                   |
| <a id="message-model">[message.model.js](./models/message.model.js)</a>                  | Defines the Message schema.                                                                                                                |
| <a id="request-model">[request.model.js](./models/request.model.js)</a>                  | Defines the Request schema.                                                                                                                |
| <a id="user-controller">[user.controller.js](./controllers/user.controller.js)</a>       | Handles user-related operations such as login and registration.                                                                            |
| <a id="chat-controller">[chat.controller.js](./controllers/chat.controller.js)</a>       | Handles chat-related operations such as createChat, getMyChats, getChat, etc.                                                              |
| <a id="multer-middleware">[multer.middleware.js](./middlewares/multer.middleware.js)</a> | Middleware for handling file uploads.                                                                                                      |
| <a id="auth-middleware">[auth.middleware.js](./middlewares/auth.middleware.js)</a>       | Middleware for ensuring only authenticated users can access certain routes.                                                                |
| <a id="error-middleware">[error.middleware.js](./middlewares/error.middleware.js)</a>    | Middleware for handling errors during request processing.                                                                                  |
| <a id="features-utility">[features.js](./utils/features.js)</a>                          | Includes functions for database connection, JWT token generation, cookie configuration, logging events, and file deletion from Cloudinary. |
| <a id="utility-utility">[utility.js](./utils/utility.js)</a>                             | Includes utility function for Custom Error Handling.                                                                                       |
| <a id="validators-utility">[validators.js](./utils/validators.js)</a>                    | Includes utility function for validating user input.                                                                                       |
| <a id="events-constants-js">[events.constants.js](./constants/events.constant.js)</a>   | Contains event names for socket.io communications.                                                                                         |
| <a id="chat-helper">[chat.helper.js](./lib/chat.helper.js)</a>                           | Contains helper functions for chat-related operations such as getting members of a chat excluding the current user, etc.                   |
| <a id="user-seeder">[user.seeder.js](./seeders/user.seeder.js)</a>                       | Seeds the database with creating new dummy users. **Note: Remove this file in production.**                                                |
| <a id="chat-seeder">[chat.seeder.js](./seeders/chat.seeder.js)</a>                       | Seeds the database with creating new dummy chats and messages. **Note: Remove this file in production.**                                   |


