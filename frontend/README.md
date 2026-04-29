# RecipeNest

A full-stack recipe sharing web application built with the MERN stack as part of the CIS051-2 Web Technologies and Platforms module at the University of Bedfordshire.

## Student
- **Name:** Upal Karki
- **ID:** 2434937

## Tech Stack
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (local via MongoDB Compass)
- **Auth:** JWT + bcrypt

## Getting Started

### Prerequisites
- Node.js v18+
- pnpm (`npm install -g pnpm`)
- MongoDB running locally on port 27017

### Run the Backend
```bash
cd backend
npm install
node server.js
```

Server runs on: `http://localhost:5001`

### Run the Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs on: `http://localhost:5173`

## Features

### User Role
- Browse and search all approved recipes
- Filter by category and difficulty
- View full recipe details
- Leave star ratings and written reviews
- Bookmark favourite recipes
- View saved recipes and review history

### Chef Role
- Submit new recipes for admin approval
- Edit and delete own recipes
- View recipe engagement stats
- Manage full recipe portfolio

### Admin Role
- Approve or reject chef-submitted recipes
- View platform statistics dashboard
- Manage all users (suspend/delete)
- View all recipes by status

## Project Structure
Web/
├── backend/
│   ├── server.js
│   ├── config/db.js
│   ├── models/          # User, Recipe, Review, Bookmark
│   ├── controllers/     # auth, recipe, review, bookmark, admin
│   ├── routes/          # authRoutes, recipeRoutes, adminRoutes
│   └── middleware/      # authMiddleware, roleMiddleware
└── frontend/
└── src/app/
├── pages/       # 18 pages across 3 role dashboards
├── layouts/     # role-based layout wrappers
├── components/  # shadcn/ui components
└── config/      # api.ts, demoCredentials.ts

## Default Admin Setup
1. Register any account via `/register`
2. Open MongoDB Compass → `recipenest` → `users`
3. Edit the user document and change `role` to `"admin"`
4. Login — you will be redirected to the admin dashboard