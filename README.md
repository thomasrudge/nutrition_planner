# Nutrition Planner

> A web app that lets users track their daily nutrition by uploading meal photos, which are analyzed by a computer vision model to calculate calories, protein, and other nutrients.

---

## Tech Stack

- **Backend:** NestJS (Node.js)
- **Frontend:** React + Vite (TypeScript)
- **AI:** Python (computer vision model)

---

## Project Structure

```
nutrition_planner/
├── backend/      # NestJS API
├── frontend/     # React + Vite
├── ai/           # Python computer vision model
└── README.md
```

---

## API Endpoints

> Base URL: `http://localhost:3000`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user, returns JWT |
| POST | `/auth/signin` | Sign in, returns JWT |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:id` | Get a user by ID |
| GET | `/users/email/:email` | Get a user by email |
| PATCH | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

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