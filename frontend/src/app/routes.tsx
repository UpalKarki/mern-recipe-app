import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { UserDashboardPage } from "./pages/UserDashboardPage";
import { RecipeListPage } from "./pages/RecipeListPage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { SavedRecipesPage } from "./pages/SavedRecipesPage";
import { ChefDashboardPage } from "./pages/ChefDashboardPage";
import { ChefProfilePage } from "./pages/ChefProfilePage";
import { ChefRecipesPage } from "./pages/ChefRecipesPage";
import { ChefRecipeDetailPage } from "./pages/ChefRecipeDetailPage";
import { AddRecipePage } from "./pages/AddRecipePage";
import { ManageRecipesPage } from "./pages/ManageRecipesPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { ApproveRecipesPage } from "./pages/ApproveRecipesPage";
import { ManageCategoriesPage } from "./pages/ManageCategoriesPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { ChefLayout } from "./layouts/ChefLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { UserLayout } from "./layouts/UserLayout";
import { AuthenticatedUserLayout } from "./layouts/AuthenticatedUserLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: UserLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
    ],
  },
  {
    path: "/dashboard",
    Component: AuthenticatedUserLayout,
    children: [
      { index: true, Component: UserDashboardPage },
    ],
  },
  {
    path: "/recipes",
    Component: AuthenticatedUserLayout,
    children: [
      { index: true, Component: RecipeListPage },
      { path: ":id", Component: RecipeDetailPage },
    ],
  },
  {
    path: "/profile",
    Component: AuthenticatedUserLayout,
    children: [
      { index: true, Component: UserProfilePage },
    ],
  },
  {
    path: "/saved-recipes",
    Component: AuthenticatedUserLayout,
    children: [
      { index: true, Component: SavedRecipesPage },
    ],
  },
  {
    path: "/chef",
    Component: ChefLayout,
    children: [
      { index: true, Component: ChefDashboardPage },
      { path: "recipes", Component: ChefRecipesPage },
      { path: "recipes/:id", Component: ChefRecipeDetailPage },
      { path: "add-recipe", Component: AddRecipePage },
      { path: "edit-recipe/:id", Component: AddRecipePage },
      { path: "manage-recipes", Component: ManageRecipesPage },
      { path: "profile", Component: ChefProfilePage },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboardPage },
      { path: "approve-recipes", Component: ApproveRecipesPage },
      { path: "categories", Component: ManageCategoriesPage },
      { path: "users", Component: UserManagementPage },
    ],
  },
]);