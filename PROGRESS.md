# RecipeNest — Build Progress

## Project Info
- **Course**: CIS051 — Web Technologies and Platforms
- **University**: University of Bedfordshire
- **Student**: Upal Karki (2434937)
- **Stack**: MERN (MongoDB + Express + React + Node.js)
- **Frontend**: React + TypeScript + Tailwind + shadcn/ui
- **Database**: MongoDB Compass (local) → mongodb://localhost:27017/recipenest

## Ports
- Frontend: http://localhost:5173
- Backend:  http://localhost:5000

## Folder Structure
```
Web/
├── backend/
│   ├── server.js              ✅ done
│   ├── .env                   ✅ done (update MONGO_URI for local Compass)
│   ├── config/db.js           ✅ done
│   ├── models/
│   │   ├── User.js            ✅ done
│   │   ├── Recipe.js          ✅ done
│   │   ├── Review.js          ✅ done
│   │   ├── Bookmark.js        ✅ done
│   │   └── Category.js        ✅ done
│   ├── controllers/
│   │   ├── authController.js  ⏳ Phase 3
│   │   ├── recipeController.js ⏳ Phase 4
│   │   ├── adminController.js  ⏳ Phase 6
│   │   └── reviewController.js ⏳ Phase 5
│   ├── routes/
│   │   ├── authRoutes.js      ⏳ Phase 3
│   │   ├── recipeRoutes.js    ⏳ Phase 4
│   │   └── adminRoutes.js     ⏳ Phase 6
│   └── middleware/
│       ├── authMiddleware.js  ⏳ Phase 3
│       └── roleMiddleware.js  ⏳ Phase 3
└── frontend/                  ✅ FULLY COMPLETE (React + TS)
    └── src/app/
        ├── pages/             ✅ all 17 pages done
        ├── layouts/           ✅ done
        ├── components/        ✅ done
        └── config/demoCredentials.ts  ← REPLACE in Phase 7

## Build Phases
| Phase | Task                          | Status      |
|-------|-------------------------------|-------------|
| 1     | Project setup + DB connection | ✅ Complete |
| 2     | All 5 database models         | ✅ Complete |
| 3     | Auth (register/login/JWT)     | ⏳ Next     |
| 4     | Recipe APIs (CRUD)            | ⏳ Pending  |
| 5     | Reviews + Bookmarks APIs      | ⏳ Pending  |
| 6     | Admin APIs                    | ⏳ Pending  |
| 7     | Connect frontend to backend   | ⏳ Pending  |

## Key Design Decisions
- Password hashed with bcrypt (salt rounds: 10)
- JWT stored in localStorage on frontend
- Role-based access: user / chef / admin
- Recipe approval flow: pending → approved/rejected by admin
- Review post-save hook auto-updates recipe averageRating
- Bookmark has unique index (user+recipe) to prevent duplicates

## To Resume in a New Chat
1. Upload the Web.zip file
2. Paste this message:
   "I am building RecipeNest MERN app for university.
    Read my PROGRESS.md and continue from Phase [X].
    Here is my project zip."
