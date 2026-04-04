# NoviConnect - Backend (TypeScript)

This is the fully typed back-end for NoviConnect, rewritten in TypeScript for better maintainability. It handles authentication, data models via Mongoose, real-time messaging using Socket.IO with Redis as a scalable backing, and file uploads via Cloudinary.

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via `mongoose`)
- **Real-time & Caching**: Socket.IO, Redis (`ioredis`)
- **File Uploads**: Multer, Cloudinary
- **Security**: JWT (`jsonwebtoken`), Bcrypt, Cookie-parser

## Getting Started

### Prerequisites

- Node.js
- MongoDB instance running locally or via MongoDB Atlas
- Redis server running optimally at `127.0.0.1:6379`
- Cloudinary credentials

### Environment Variables

You need an `.env` file in the root of the `new-server` directory. Use the `dummy.env` as a reference:

```env
MONGO_URI=your_mongodb_uri
PORT=3000
JWT_SECRET=your_jwt_secret
ADMIN_SECRET_KEY=your_admin_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis Setup
REDIS_URI=redis://127.0.0.1:6379
```

### Installation

1. Navigate to the server directory:
   ```bash
   cd new-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

The server uses `tsx` to run TypeScript files directly in development.

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```
