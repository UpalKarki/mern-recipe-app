// Utility functions for managing recipes in localStorage
import { allRecipes as initialRecipes } from "../data/recipes";
import type { Recipe } from "../data/recipes";

const STORAGE_KEY = "recipenest_all_recipes";

// Initialize recipes from static data on first load
function initializeRecipes(): Recipe[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRecipes));
    return initialRecipes;
  }
  return JSON.parse(stored);
}

// Get all recipes
export function getAllRecipesData(): Recipe[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return initializeRecipes();
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading recipes:", error);
    return initializeRecipes();
  }
}

// Get a single recipe by ID
export function getRecipeById(id: number): Recipe | null {
  const recipes = getAllRecipesData();
  return recipes.find(r => r.id === id) || null;
}

// Add a new recipe
export function addRecipe(recipe: Omit<Recipe, "id">): Recipe {
  const recipes = getAllRecipesData();
  const newId = Math.max(...recipes.map(r => r.id), 0) + 1;
  const newRecipe: Recipe = { ...recipe, id: newId };
  recipes.push(newRecipe);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  return newRecipe;
}

// Update an existing recipe
export function updateRecipe(id: number, updates: Partial<Omit<Recipe, "id">>): boolean {
  try {
    const recipes = getAllRecipesData();
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) return false;

    recipes[index] = { ...recipes[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    return true;
  } catch (error) {
    console.error("Error updating recipe:", error);
    return false;
  }
}

// Delete a recipe
export function deleteRecipe(id: number): boolean {
  try {
    const recipes = getAllRecipesData();
    const filtered = recipes.filter(r => r.id !== id);
    if (filtered.length === recipes.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return false;
  }
}

// Get recipes by category
export function getRecipesByCategory(category: string): Recipe[] {
  const recipes = getAllRecipesData();
  return recipes.filter(r => r.category === category);
}

// Get recipes by chef
export function getRecipesByChef(chefName: string): Recipe[] {
  const recipes = getAllRecipesData();
  return recipes.filter(r => r.chef === chefName);
}

// Search recipes
export function searchRecipes(query: string): Recipe[] {
  const recipes = getAllRecipesData();
  const lowercaseQuery = query.toLowerCase();
  return recipes.filter(r =>
    r.title.toLowerCase().includes(lowercaseQuery) ||
    r.chef.toLowerCase().includes(lowercaseQuery) ||
    r.category.toLowerCase().includes(lowercaseQuery)
  );
}
