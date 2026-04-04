# NoviConnect - Frontend (TypeScript/Vite)

This is the newly migrated TypeScript frontend for NoviConnect, powered by React and Vite. It provides a highly responsive, modern UI for real-time messaging, utilizing Material-UI and Framer Motion.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) via [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Styling & UI**: MUI (`@mui/material`, `@emotion/react`), framer-motion
- **Networking/Real-time**: Axios, Socket.IO Client
- **Routing**: React Router DOM (v7)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Navigate to the client directory:
   ```bash
   cd new-client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the Vite dev server with Hot Module Replacement (HMR):

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```
This generates optimized static assets in the `dist` folder.
