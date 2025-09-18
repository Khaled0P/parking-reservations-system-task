# Parking Reservation System - WeLink Cargo

**Full-stack parking reservation system developed for WeLink Cargo company hiring and training purposes.** This repository contains both the **Next.js + Redux frontend** and the **Express + WebSocket backend** with complete business logic, real-time updates, and an admin dashboard.

## Run locally

1.  Install dependencies for client and server:

```
cd client
npm install
cd ..
npm install
```

2.  Start frontend + backend together:

`npm run dev`

**npm run dev runs the frontend and backend concurrently using our custom script.**

- Frontend: http://localhost:3000 (Next.js client)
- Backend API: http://localhost:4000/api/v1
- Backend WebSocket: ws://localhost:4000/api/v1/ws

## Screenshots

  <img src="./docs/screenshots/Screenshot (4).png" alt="Ticket modal" width="700" />
  <img src="./docs/screenshots/Screenshot (9).png" alt="Admin dashboard" width="700" />

| <img src="./docs/screenshots/Screenshot (1).png" width="420" /> | <img src="./docs/screenshots/Screenshot (2).png" width="420" /> |
|---|---|
| <img src="./docs/screenshots/Screenshot (3).png" width="420" /> | <img src="./docs/screenshots/Screenshot (5).png" width="420" /> |
| <img src="./docs/screenshots/Screenshot (6).png" width="420" /> | <img src="./docs/screenshots/Screenshot (8).png" width="420" /> |
| <img src="./docs/screenshots/Screenshot (10).png" width="420" /> | <img src="./docs/screenshots/Screenshot (11).png" width="420" /> |

## Frontend (Client)

**Tech:** Next.js (App Router) + Redux Toolkit + React Query + shadcn/ui (lucide-react icons, shadcn components).The frontend implements both employee and admin experiences and follows the same structure and conventions across the app. The task for the frontend (including the admin dashboard) has been fulfilled as requested.

### Folder structure

```
client/src
  /app     → domain modules (gate, checkpoint, admin)
  /components   → reusable UI components (shadcn + custom)
  /hooks        → custom React hooks (e.g., useCheckin, useZones)
  /lib/api      → API clients + types + error utils
  /store        → Redux slices + Providers
```

### Features

- **Gate Screen**

  - Visitor check-in (zone availability)

  - Subscriber check-in (subscription lookup + validation)

  - Real-time updates via WebSocket

- **Employee (Checkpoint)**

  - Ticket lookup by ID

  - Normal checkout flow

  - Subscriber checkout with car verification + convert-to-visitor option

- **Admin Dashboard**

  - Manage categories, zones, subscriptions

  - Parking-state report

  - Rush hours & vacations management

  - Live audit log via `admin-update` events

- **Cross-cutting**

  - Authentication (admin / employee)

  - Protected routes with Unauthorized redirect

  - Global error handling via `getApiErrorMessage`

  - Toast notifications and clean loading states

  - Responsive & accessible UI (shadcn/ui + Tailwind)

- **Authentication & Protection**

  - Simple login with seeded users (admin, employee).
  - Token stored in Redux + localStorage.
  - Protected pages use a Unauthorized HOC (protected pages exported like export default Unauthorized(AdminDashboard, { role: "admin" });), which handles authorization/unauthorized UX.

- **UX**

  - Global Unauthorized page (client component) with countdown redirect to /login.
  - 404 page for missing routes.
  - Reusable loading component (spinner + optional title) for production-worthy loading states.
  - Toast notifications used inside hooks/components (not in low-level axios client) for success/error messages.
  - API error normalization helper: getApiErrorMessage.

### Known Issues

- **Missing subscriptionId in ticket response**\ `GET /tickets/:id` does not currently include `subscriptionId`. The frontend is prepared to consume it once backend adds support.

- **Steps to reproduce**

  1.  Open any Gate
  2.  switch to subscribors tab
  3.  enter valid subscription and check-in
  4.  login as employee and load ticket by id

  ## Implementation Notes

  - **Redux + React Query**: Redux handles auth & app state, React Query handles server state (caching, fetching).

  - **Error handling**: centralized in `getApiErrorMessage`, surfaced in toasts + inline form messages.

  - **WebSocket**: global client with reconnect + status indicator, integrates directly with React Query cache.

  - **UI library**: shadcn/ui chosen for rapid, consistent styling with Tailwind.

## Backend (Server.js)

## Features

- In-memory seeded data (zones, gates, categories, subscriptions, tickets, users)
- Endpoints:
  - `POST /api/v1/auth/login`
  - `GET  /api/v1/master/gates`
  - `GET  /api/v1/master/zones`
  - `GET  /api/v1/master/categories`
  - `GET  /api/v1/subscriptions/:id`
  - `POST /api/v1/tickets/checkin`
  - `POST /api/v1/tickets/checkout`
  - `GET  /api/v1/tickets/:id`
  - `GET  /api/v1/admin/reports/parking-state`
  - `PUT  /api/v1/admin/categories/:id` (update rates)
  - `PUT  /api/v1/admin/zones/:id/open` (open/close)
  - `POST /api/v1/admin/rush-hours`
  - `POST /api/v1/admin/vacations`
  - `GET  /api/v1/admin/subscriptions`
- Simple auth: login with seeded user credentials (admin, employee). Returns simple token.
- WebSocket at `/api/v1/ws` for minimal `zone-update` and `admin-update` messages. Clients subscribe by sending `{"type":"subscribe","payload":{"gateId":"gate_1"}}`.

## Notes

- All business logic (reserved calculation, availability, mixed-rate checkout) is implemented server-side.
- Data is in-memory; restarting the server resets the state to seeded values.
- This is a starter implementation for frontend integration and testing. It is **not** production-ready.
