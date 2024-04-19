# Backend Architecture

## Structure and Components

- **`server.js`**: The main entry point of the backend. It sets up the server configuration and defines the application routes.

- **`routes/`**: This directory houses all the route definitions for the backend.
  - **`user.routes.js`**: Contains the routes for user-related operations such as login and registration.

- **`models/`**: This directory contains the data models for the application. Each file corresponds to a specific model:
  - **`user.model.js`**: Defines the User schema.
  - **`chat.model.js`**: Defines the Chat schema.
  - **`message.model.js`**: Defines the Message schema.
  - **`request.model.js`**: Defines the Request schema.

- **`controllers/`**: This directory contains the controller logic for handling specific routes. 
  - **`user.controller.js`**: Handles user-related operations such as login and registration.

- **`middlewares/`**: This directory contains middleware functions that process incoming requests before they reach the route handlers.
  - **`multer.middleware.js`**: A middleware for handling file uploads.

- **`seeders/`**: This directory contains scripts for seeding the database with initial data.

- **`utils/`**: This directory contains utility functions that are used across the application. 
  - **`features.js`**: Includes a function for establishing a connection to the MongoDB database.

- **`constants/`**: This directory contains constant values that are used throughout the backend.