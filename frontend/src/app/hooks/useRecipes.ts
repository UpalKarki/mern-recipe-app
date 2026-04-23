import { useState, useEffect } from "react";
import { getAllRecipesData } from "../utils/recipesData";
import type { Recipe } from "../data/recipes";

// Custom hook to get recipes with automatic updates
export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshRecipes = () => {
    const allRecipes = getAllRecipesData();
    setRecipes(allRecipes);
    setLoading(false);
  };

  useEffect(() => {
    refreshRecipes();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "recipenest_all_recipes") {
        refreshRecipes();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { recipes, loading, refreshRecipes };
}
