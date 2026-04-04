# NoviConnect Client

Frontend for NoviConnect, a dark-themed real-time chat application with Google auth, OTP-based account flows, KrishnaDen admin routes, and end-to-end encrypted messaging.

## Stack

- React 19
- Vite
- Redux Toolkit / RTK Query
- Material UI
- Socket.IO client
- Web Crypto API for E2EE

## Features

- User auth, signup, login, forgot password, and OTP verification
- Google sign-in support
- Direct chats and group chats
- End-to-end encrypted text messages
- End-to-end encrypted attachments
- Password-backed key recovery and recovery-key flows
- KrishnaDen admin interface

## Environment Variables

Copy values from [`dummy.env`](c:/Users/krish/Desktop/noviconnect-latest/new-client/dummy.env).

```env
VITE_SERVER=
VITE_GOOGLE_CLIENT_ID=
VITE_MODE=development
VITE_E2EE_ENABLED=true
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
npm run audit:e2ee
```

## Local Development

```bash
npm install
npm run dev
```

The app expects the backend to be running and `VITE_SERVER` to point to it.

## E2EE Notes

- New secure messages are encrypted in the browser before they are sent.
- Message decryption happens only on the client.
- Private keys are protected with password-based wrapping and recovery flows.
- `VITE_E2EE_ENABLED` can be used to gate the secure messaging rollout.

For implementation details, see:

- [`implementaation-plan-e2ee.md`](c:/Users/krish/Desktop/noviconnect-latest/implementaation-plan-e2ee.md)
- [`e2ee-manual-checklist.md`](c:/Users/krish/Desktop/noviconnect-latest/e2ee-manual-checklist.md)

## Deployment

- Set the required frontend env vars in Vercel.
- Ensure the backend CORS allowlist includes the deployed frontend origin.
- For direct-route support on Vercel, keep [`vercel.json`](c:/Users/krish/Desktop/noviconnect-latest/new-client/vercel.json) deployed with the client.
