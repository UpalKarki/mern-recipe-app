# RecipeNest — Build Progress

## Project Info
- **Course**: CIS051-2 — Web Technologies and Platforms
- **University**: University of Bedfordshire
- **Student**: Upal Karki (2434937)
- **Stack**: MERN (MongoDB + Express + React + Node.js)
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Database**: MongoDB Compass (local) → mongodb://localhost:27017/recipenest

## Ports
- Frontend: http://localhost:5173
- Backend:  http://localhost:5001

## Build Phases

| Phase | Task                          | Status      |
|-------|-------------------------------|-------------|
| 1     | Project setup + DB connection | ✅ Complete |
| 2     | All 4 database models         | ✅ Complete |
| 3     | Auth (register/login/JWT)     | ✅ Complete |
| 4     | Recipe APIs (CRUD)            | ✅ Complete |
| 5     | Reviews + Bookmarks APIs      | ✅ Complete |
| 6     | Admin APIs                    | ✅ Complete |
| 7     | Connect frontend to backend   | ✅ Complete |

## What's Implemented

### Backend
- JWT authentication with bcrypt password hashing
- Role-based middleware (user / chef / admin)
- Full CRUD for recipes with approval workflow
- Review post-save hook auto-updates averageRating
- Bookmark toggle with unique compound index
- Admin stats, user management, recipe moderation

### Frontend
- 18 pages across 3 role-based dashboards
- Centralised API layer (api.ts) for all 22 endpoints
- Real-time category filtering on dashboards
- Search by name and ingredient on recipe list
- Pagination on recipe list page
- Bookmark toggle with instant UI feedback
- Star rating and review submission
- Profile page with saved recipes and review history
- Edit profile with bio update synced to backend

## Key Design Decisions
- Password hashed with bcrypt (salt rounds: 10)
- JWT stored in localStorage on frontend
- Role-based access: user / chef / admin
- Recipe approval flow: pending → approved/rejected by admin
- Review post-save hook auto-updates recipe averageRating
- Bookmark has unique index (user+recipe) to prevent duplicates
- Image stored as base64 in MongoDB (development only)
- Backend on port 5001 (port 5000 conflicts with macOS AirPlay)

## Known Limitations
- Images stored as base64 (would use Cloudinary in production)
- JWT tokens do not expire (would add refresh tokens in production)
- No email notifications for recipe approval status