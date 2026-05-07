# Hostel Booking System

Full-stack Makerere hostel booking app with:

- `client/`: Vite + React SPA
- `server/`: Express + MongoDB API
- one production deployment target where the Express server also serves the built frontend

## What Was Aligned

This repo stays the deployment source of truth. It was selectively aligned to `mugisharayan/APP` for the working runtime pieces that were missing or broken here:

- missing client pages, modals, contexts, utilities, and styles such as `CustodianContext`, `FAQPage`, `DashboardChoiceModal`, `ToastContainer`, `ProtectedRoute`, `MyBookingsPage`, the student request/notification components, and the integration panel
- missing server pieces such as `favorite.routes.js`, `health.routes.js`, `assignmentHistory.model.js`, and request logging support
- the broken backend entrypoint
- the corrupted `client/src/features/home/HomePage.jsx`
- naming mismatches such as `ProtectRoute` vs `ProtectedRoute`, `MyBookingPage` vs `MyBookingsPage`, `integration` vs `integrations`, and `useRealTimeUpdate` vs `useRealTimeUpdates`

## Prerequisites

- Node.js 18+
- npm
- MongoDB connection string

## Install

```bash
npm install
npm --prefix server install
npm --prefix client install
```

## Environment

Create `server/.env` with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hostel-booking
JWT_SECRET=replace_this
NODE_ENV=development
```

`MONGODB_URI` is also supported for backward compatibility with older local setups.

Optional client override:

```env
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is omitted:

- development defaults to `http://localhost:5000/api`
- production defaults to `/api`

## Local Run

Run both apps in separate terminals:

```bash
npm --prefix server run dev
npm --prefix client run dev
```

Or use the root helper after dependencies are installed:

```bash
npm run dev
```

Useful root scripts:

```bash
npm run build
npm run verify:server
npm start
```

Notes:

- the server serves the built frontend from `client/dist` whenever that build output exists
- if port `5000` is already taken on your machine, override it when starting the server, for example `PORT=5050 npm --prefix server start`

## Verification

The current verification baseline is:

- `npm run build` in `client` succeeds
- `npm run verify:server` succeeds
- `GET /api/health` responds
- `GET /api/hostels` responds from MongoDB
- browser smoke test confirmed:
  - home page loads
  - hostels page loads
  - hostel detail opens
  - booking flow opens from hostel detail
  - student signup reaches the booking/dashboard flow
  - student dashboard and maintenance page render
  - custodian dashboard loads after auth hydration

## Render Deployment

Recommended Render web service settings:

- Service type: `Web Service`
- Branch: `main`
- Root directory: repo root (leave it blank)
- Build command:

```bash
npm install && npm --prefix server install && npm --prefix client install && npm run verify:server && npm test && npm run build
```

- Start command:

```bash
npm start
```

- Required environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`

`MONGODB_URI` also works if you are reusing an older environment setup, but new deployments should prefer `MONGO_URI`.

Render auto-deploy from the connected repo is enough for this class project. The lightweight CI part now happens inside the Render build command: syntax check, `npm test`, then frontend build.

More detailed reproduction notes are written to `~/Desktop/deployment.md`.
