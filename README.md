# Project Name

> Short description of what this project does.

---

## Tech Stack

- **Backend:** NestJS (Node.js)
- **Frontend:** React + Vite (TypeScript)

---

## Project Structure

```
my-app/
├── backend/      # NestJS API
├── frontend/     # React + Vite
└── README.md
```

---

## API Endpoints

> Base URL: `http://localhost:3000`

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:id` | Get a user by ID |
| GET | `/users/email/:email` | Get a user by email |
| POST | `/users` | Create a new user |
| PATCH | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

### Auth
*(coming soon)*

---

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run start:dev` | `/backend` | Start backend in watch mode |
| `npm run build` | `/backend` | Build backend for production |
| `npm run dev` | `/frontend` | Start frontend dev server |
| `npm run build` | `/frontend` | Build frontend for production |

---

## License

Private — all rights reserved.