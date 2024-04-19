# Backend Architecture

## Structure and Components

- [`server.js`](./server.js): The main entry point of the backend. It sets up the server configuration and defines the application routes.

- `routes/`: This directory houses all the route definitions for the backend.
  - [`user.routes.js`](./routes/user.routes.js): Contains the routes for user-related operations such as login and registration.

- `models/`: This directory contains the data models for the application. Each file corresponds to a specific model:
  - [`user.model.js`](./models/user.model.js): Defines the User schema.
  - [`chat.model.js`](./models/chat.model.js): Defines the Chat schema.
  - [`message.model.js`](./models/message.model.js): Defines the Message schema.
  - [`request.model.js`](./models/request.model.js): Defines the Request schema.

- `controllers/`: This directory contains the controller logic for handling specific routes. 
  - [`user.controller.js`](./controllers/user.controller.js): Handles user-related operations such as login and registration.

- `middlewares/`: This directory contains middleware functions that process incoming requests before they reach the route handlers.
  - [`multer.middleware.js`](./middlewares/multer.middleware.js): A middleware for handling file uploads.
  - [`auth.middleware.js`](./middlewares/auth.middleware.js): A middleware for ensuring that only authenticated users can access certain routes.
  - [`error.middleware.js`](./middlewares/error.middleware.js): A middleware for handling errors that occur during request processing.

- `seeders/`: This directory contains scripts for seeding the database with initial data.

- `utils/`: This directory contains utility functions that are used across the application. 
  - [`features.js`](./utils/features.js): Includes a function for: 
    - establishing a connection to the MongoDB database.
    - creating token for user authentication and saving it in a cookie.
    - Cookie Options config
  - [`utility.js`](./utils/utility.js): Includes utility function for Custom Error Handling.

- `constants/`: This directory contains constant values that are used throughout the backend.

- **`.env`**: Contains environment variables such as the database connection string, JWT secret key, etc.