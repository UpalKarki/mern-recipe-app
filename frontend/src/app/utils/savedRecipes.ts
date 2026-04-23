// Utility functions for managing saved recipes in localStorage

const STORAGE_KEY = "recipenest_saved_recipes";

export interface SavedRecipe {
  id: number;
  title: string;
  chef: string;
  time: string;
  difficulty: string;
  rating: number;
  category: string;
  image: string;
  savedAt: string;
}

export function getSavedRecipes(): SavedRecipe[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error reading saved recipes:", error);
    return [];
  }
}

export function saveRecipe(recipe: Omit<SavedRecipe, "savedAt">): boolean {
  try {
    const savedRecipes = getSavedRecipes();

    // Check if already saved
    if (savedRecipes.some((r) => r.id === recipe.id)) {
      return false; // Already saved
    }

    // Add new recipe with timestamp
    const newRecipe: SavedRecipe = {
      ...recipe,
      savedAt: new Date().toISOString(),
    };

    savedRecipes.unshift(newRecipe); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRecipes));
    return true;
  } catch (error) {
    console.error("Error saving recipe:", error);
    return false;
  }
}

export function unsaveRecipe(recipeId: number): boolean {
  try {
    const savedRecipes = getSavedRecipes();
    const filtered = savedRecipes.filter((r) => r.id !== recipeId);

    if (filtered.length === savedRecipes.length) {
      return false; // Recipe was not saved
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error removing saved recipe:", error);
    return false;
  }
}

export function isRecipeSaved(recipeId: number): boolean {
  const savedRecipes = getSavedRecipes();
  return savedRecipes.some((r) => r.id === recipeId);
}

export function toggleSaveRecipe(recipe: Omit<SavedRecipe, "savedAt">): boolean {
  if (isRecipeSaved(recipe.id)) {
    return !unsaveRecipe(recipe.id); // Return true if still saved (unsave failed)
  } else {
    return saveRecipe(recipe);
  }
}
