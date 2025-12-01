# Digital Calendar - Backend

This is the Express/MongoDB backend for the Digital Calendar application.

## Setup

1. Copy `.env.example` to `.env` and fill values (at minimum `MONGO_URI` and `JWT_SECRET`).

2. Install dependencies:

```powershell
cd backend; npm install
```

3. Seed sample data (creates a demo user `demo@example.com` / `password123` and sample events):

```powershell
npm run seed
```

4. Run development server:

```powershell
npm run dev
```

API runs on `http://localhost:5000` by default.

## Important endpoints

- `POST /api/auth/signup` - create account
- `POST /api/auth/login` - login
- `GET /api/auth/me` - get current user (requires `Authorization: Bearer <token>`)

- `GET /api/events` - list user's events
- `POST /api/events` - create event
- `GET /api/events/:id` - get event
- `PUT /api/events/:id` - update event
- `DELETE /api/events/:id` - delete event

See API documentation in the project root `API_DOCS.md`.
