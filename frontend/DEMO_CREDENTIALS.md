# RecipeNest Demo Credentials

Welcome to RecipeNest! This document contains the demo login credentials for testing different user roles in the application.

## Demo Accounts

### Regular User Account
- **Email:** `user@recipenest.com`
- **Password:** `user123`
- **Role:** User
- **Name:** John Doe
- **Access:** User dashboard, recipe browsing, saved recipes, profile management

### Chef Account
- **Email:** `chef@recipenest.com`
- **Password:** `chef123`
- **Role:** Chef
- **Name:** Chef Maria Garcia
- **Access:** Chef portal, recipe management, add new recipes, manage existing recipes

### Admin Account
- **Email:** `admin@recipenest.com`
- **Password:** `admin123`
- **Role:** Admin
- **Name:** Admin Sarah Johnson
- **Access:** Admin panel, recipe approval/rejection, category management, user management

## How to Login

1. Navigate to the login page at `/login`
2. Enter one of the email addresses above
3. Enter the corresponding password
4. Click "Sign In"
5. You will be automatically redirected to the appropriate dashboard based on your role:
   - User → `/dashboard`
   - Chef → `/chef`
   - Admin → `/admin`

## Features by Role

### User Features
- Browse and search recipes
- View detailed recipe information
- Save favorite recipes
- Leave reviews and ratings
- Manage profile settings
- Search recipes by ingredients

### Chef Features
- All user features
- Create new recipes
- Manage existing recipes
- View recipe statistics
- Track recipe performance

### Admin Features
- Approve or reject submitted recipes
- Add rejection reasons for declined recipes
- Manage recipe categories
- Manage users (suspend/activate accounts)
- View platform analytics
- Monitor content quality

## Notes

- These are demo credentials for testing purposes only
- The authentication system uses localStorage to persist the session
- Click "Logout" to switch between different user roles
- The demo credentials are also displayed on the login page for easy access
