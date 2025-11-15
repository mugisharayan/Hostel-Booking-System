# Hostel Booking System

A full-stack Makerere hostel management platform that lets students discover hostels, place bookings, pay fees, log maintenance issues, and gives custodians dashboards for rooms, payments, and analytics.

## Features
- Hostel discovery with rich detail pages, reviews, and dynamic room data sourced from MongoDB.
- Booking + payment workflows with duplicate-booking protection, transaction tracking, and communication utilities (tickets, room-change and payment inquiries).
- Student dashboard for bookings, maintenance, and profile management plus a custodian workspace for room assignment, payment review, and analytics.
- Shared notification, messaging, and toast systems powered by React contexts and a centralized API client with JWT-aware Axios interceptors.

## Tech Stack
- **Frontend:** React 19, React Router, Axios, context-based state, CRA toolchain.
- **Backend:** Node.js, Express, MongoDB/Mongoose, dotenv, express-async-handler, JWT helpers.
- **Tooling:** Jest + Supertest for API/unit tests, nodemon for backend dev workflow.

## Repository Layout
```
client/   React SPA (routes, contexts, service layer, styles)
server/   Express API, Mongoose models, route/controllers, migration scripts
tests/    Jest suites (unit + API mocks)
test-integration.js  Manual smoke test script for a running backend
```

## Prerequisites
- Node.js 18+ and npm
- Local or hosted MongoDB instance
- Optional: MongoDB Compass for inspecting data

## Setup
```bash
# Install root dev tools (Jest config, optional unless you run tests)
npm install

# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

## Environment Variables
Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hostel-booking
JWT_SECRET=replace_with_strong_secret
```
Frontend can read an override for the API base via `client/.env` (optional):
```
REACT_APP_API_URL=http://localhost:5000/api
```
If unset, the Axios service defaults to `http://localhost:5000/api`.

## Running Locally
```bash
# Backend (Express + MongoDB, defaults to port 5000)
cd server
npm run dev     # nodemon
# or
npm start

# Frontend (React app, CRA defaults to http://localhost:3000 with proxy to 5000)
cd client
npm start
```
The REST API surface lives under `/api/*` (see `server/routes`) and the React client talks to it through `client/src/service/api.service.js`.

## Testing & Utilities
- `npm test` (repo root) runs the Jest suite in `tests/`, which exercises the API helpers and sample Express routes.
- `node test-integration.js` performs a simple live API smoke test once the backend is running.
- From `server/`, `npm run migrate:all-hostels` seeds MongoDB with the curated hostel catalog mirrored from the frontend data file.

## Key Paths
- `client/App.jsx` & `client/src/features/**` contain the student/custodian pages, modals, and overlays.
- `client/src/contexts/**` host the notification, room, custodian, and messaging providers shared across the SPA.
- `server/routes/*.routes.js` wire booking, payment, maintenance, communication, and review endpoints to their controllers.
- `server/models/*.model.js` define the MongoDB schema for users, hostels, rooms, bookings, payments, maintenance requests, favorites, notifications, and reviews.
