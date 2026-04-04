# NoviConnect Server

Backend for NoviConnect. It provides REST APIs, Socket.IO real-time messaging, auth, OTP email delivery through Resend, media upload support, and ciphertext-only storage for E2EE message flows.

## Stack

- Node.js
- Express 5
- TypeScript
- MongoDB / Mongoose
- Socket.IO
- Redis
- Cloudinary
- Resend

## Responsibilities

- User and admin authentication
- OTP email delivery
- Chat and group management
- Real-time message transport
- End-to-end encrypted message storage and key-bundle APIs
- Media handling for encrypted attachments

## Environment Variables

Copy values from [`dummy.env`](c:/Users/krish/Desktop/noviconnect-latest/new-server/dummy.env).

```env
NODE_ENV='DEVELOPMENT or PRODUCTION'
DB_NAME=
MONGO_URI=
PORT=
JWT_SECRET=
ADMIN_SECRET_KEY=
E2EE_ENABLED=true
CLIENT_URLS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL="NoviConnect <mail@krishna.novitrail.com>"
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run test:e2ee
npm run audit:e2ee
```

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

## E2EE Notes

- The server stores ciphertext payloads for secure messages.
- User public keys and encrypted private-key bundles are stored server-side.
- Raw private keys are not stored on the backend.
- `E2EE_ENABLED` can be used to gate the secure messaging rollout.

For implementation details, see:

- [`implementaation-plan-e2ee.md`](c:/Users/krish/Desktop/noviconnect-latest/implementaation-plan-e2ee.md)
- [`e2ee-manual-checklist.md`](c:/Users/krish/Desktop/noviconnect-latest/e2ee-manual-checklist.md)

## Email Delivery

OTP emails are sent through Resend using the official SDK. Configure:

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL="NoviConnect <mail@krishna.novitrail.com>"
```

## Deployment Notes

- Set `NODE_ENV=PRODUCTION` in production.
- `CLIENT_URLS` supports comma-separated frontend origins.
- Production cookies require a secure cross-site setup because the frontend and backend are deployed on different domains.
