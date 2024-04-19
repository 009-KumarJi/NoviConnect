# Backend Information

## Backend Structure
- **server.js**: The main file of the backend. It contains the server configuration and the routes.
- **routes/**: Contains the routes of the backend.
- **models/**: Contains the models of the backend.
  - **/user.model.js**: Contains the user Schema.
  - **/chat.model.js**: Contains the chat Schema.
  - **/message.model.js**: Contains the message Schema.
  - **/request.model.js**: Contains the Request Schema.
- **controllers/**: Contains the controllers of the backend.
  - **/user.controller.js**: Contains the user controller like login, register, etc.  
- **middlewares/**: Contains the middlewares of the backend.
  - **/multer.middleware.js**: Contains the multer middleware for file upload. It is used for uploading the files.
- **seeders/**: Contains the seeders of the backend.
- **utils/**: Contains the utility functions of the backend.
  - **/features.js**: Contains the mongoDB connection function.
- **constants/**: Contains the constants of the backend.