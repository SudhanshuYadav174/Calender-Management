# API Documentation (REST)

Base URL: `http://localhost:5000/api`

Auth
- POST `/auth/signup`  
  Body: `{ name, email, password }`  
  Response: `{ token, user }`

- POST `/auth/login`  
  Body: `{ email, password }`  
  Response: `{ token, user }`

- GET `/auth/me`  
  Headers: `Authorization: Bearer <token>`  
  Response: `user` object

Events (all require `Authorization` header)
- GET `/events`  
  Response: `[]` list of user's events

- POST `/events`  
  Body: `{ title, description, date, startTime, endTime, location, color, reminders: [{ minutesBefore }] }`  
  Response: created event

- GET `/events/:id`  
  Response: event object

- PUT `/events/:id`  
  Body: fields to update  
  Response: updated event

- DELETE `/events/:id`  
  Response: `{ message: 'Deleted' }`

Notes:
- `date` is `YYYY-MM-DD`. `startTime` and `endTime` are `HH:mm`.
- `reminders` is an array of objects like `{ minutesBefore: 10 }`.
- Scheduler runs every minute to check for reminder times and will send email when SMTP is configured.
