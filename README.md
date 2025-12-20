# Digital Calendar (Full-stack)

This repository contains a full-stack "Digital Calendar with Event Reminders" application.

- Backend: `backend/` (Node.js, Express, MongoDB, Mongoose, JWT authentication, node-cron reminders)
- Frontend: `frontend/` (React + Vite, Tailwind CSS, react-big-calendar calendar UI)

Quick start

1. Backend

```powershell
cd backend
copy .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET (and SMTP settings if you want email reminders)
npm install
npm run seed   # optional - creates demo user/demo events
npm run dev
```

2. Frontend

```powershell
cd frontend
npm install
# Optionally set VITE_API_URL in .env to point to backend (defaults to http://localhost:5000/api)
npm run dev
```

Demo credentials (from seed):

- Email: `demo@example.com`
- Password: `password123`

## Deployment

Want to deploy this app? Check out the **[DEPLOYMENT.md](./DEPLOYMENT.md)** guide for deploying to Render.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

See `API_DOCS.md` for REST endpoints and `backend/README.md` and `frontend/README.md` for more details.
