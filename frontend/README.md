# Digital Calendar - Frontend

Vite + React frontend.

## Setup

1. Install dependencies:

```powershell
cd frontend; npm install
```

2. Create `.env` or set `VITE_API_URL` to point to backend, e.g. `VITE_API_URL=http://localhost:5000/api`.

3. Run dev server:

```powershell
npm run dev
```

The app uses Tailwind CSS. You may run the standard `tailwindcss` setup if needed, but the included `postcss` config works with Vite.

Notes:
- Calendar uses `react-big-calendar` (weekly/monthly views). For drag-and-drop rescheduling, install and configure the drag-and-drop addon from `react-big-calendar` (not wired by default in this scaffold). The sample `CalendarView` fetches events from `/api/events` and opens a form to create/edit events.
