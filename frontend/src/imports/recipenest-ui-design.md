Create a modern, responsive, fully interactive web application UI design for a recipe management platform called “RecipeNest” with a connected “ChefPortal” and Admin Panel.

The design must be clean, professional, user-friendly, and easy to implement later using React and Node.js. Use proper layout hierarchy, reusable components, and consistent spacing (8px grid system).

🎨 DESIGN SYSTEM REQUIREMENTS

Use modern food-themed color theory:

Primary color: Fresh green (#2E7D32 or similar)

Secondary: Warm beige or light cream background

Accent: Soft orange for CTA buttons

Neutral grays for text and borders

Use clean sans-serif typography (modern web style)

Soft shadows, rounded corners (8px–12px radius)

Card-based layout

Consistent button styles (Primary, Secondary, Danger)

Fully responsive (Desktop 1440px, Tablet 768px, Mobile 375px)

👤 ROLE 1: USER (RecipeNest Frontend)

Design the following screens with full clickable prototype flow:

1️⃣ Landing / Home Page

Navbar (Logo, Home, Categories, Login/Register)

Hero section with search bar

Featured recipes grid (recipe cards)

Category filter section

Footer

2️⃣ Login Page

Email field

Password field

Remember me

Forgot password

Login button

Link to register

Smooth validation states

3️⃣ Register Page

Name

Email

Password

Confirm password

Role selection (User / Chef dropdown)

Register button

4️⃣ Recipe List Page

Sidebar filters (Category, Difficulty, Cooking Time)

Search results grid

Pagination or Load more button

5️⃣ Recipe Detail Page (Important)

Include:

Recipe image

Title

Chef name

Cooking time

Difficulty

Ingredients list

Instructions section

Nutrition info

Rating display

Reviews section

Bookmark button (toggle state)

Leave review form

6️⃣ User Profile Page

Profile image

Bio

Saved recipes list

User reviews

Prototype must show:
Login → Home → Search → Recipe → Bookmark → Saved

👨‍🍳 ROLE 2: CHEF (ChefPortal Dashboard)

Use dashboard layout with left sidebar navigation.

Sidebar:

Dashboard

My Recipes

Add Recipe

Analytics

Profile Settings

Logout

7️⃣ Chef Dashboard Page

Cards showing:

Total Recipes

Total Reviews

Total Bookmarks

Recent activity list

8️⃣ Add Recipe Page

Form fields:

Title

Description

Category dropdown

Cooking time

Difficulty dropdown

Dynamic ingredient fields (Add ingredient button)

Instructions text area

Image upload

Submit button

9️⃣ Manage Recipes Page

Table layout

Status badge (Approved / Pending)

Edit button

Delete button (confirmation modal)

Prototype must show:
Login as Chef → Dashboard → Add Recipe → Submit → View in My Recipes → Edit → Delete

🛠 ROLE 3: ADMIN PANEL

Minimal, professional admin interface.

🔟 Admin Dashboard

Total Users

Total Recipes

Pending Recipes

1️⃣1️⃣ Approve Recipes Page

Table:

Recipe name

Chef

Approve button

Reject button

Status update animation

1️⃣2️⃣ Manage Categories Page

Add category modal

Edit category

Delete category

Prototype must show:
Admin Login → View Pending → Approve → Status Change

🔄 INTERACTION & PROTOTYPE REQUIREMENTS

Smooth page transitions

Hover states on buttons

Click animations

Form validation states

Bookmark toggle animation

Confirmation modals for delete

Status badge changes dynamically

Mobile hamburger menu

Collapsible filters on mobile

Sidebar collapse on tablet/mobile

📱 RESPONSIVENESS REQUIREMENT

Design separate layouts for:

Desktop (1440px)

Tablet (768px)

Mobile (375px)

Mobile behavior:

Sidebar → Hamburger menu

Filters → Collapsible dropdown

Cards → Single column

Buttons full width

🧠 TECH IMPLEMENTATION FRIENDLY

Use reusable components (Cards, Buttons, Inputs, Badges, Modals)

Keep structure realistic for React component hierarchy

Use clear naming for components

Maintain consistent spacing

Keep layout grid-based

Generate:

Complete UI screens

Component library

Interactive prototype connections

Organized pages

Clean auto-layout structure