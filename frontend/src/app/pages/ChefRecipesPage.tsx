import { Plus, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useEffect, useState } from "react";
import { apiGetMyRecipes, apiDeleteRecipe } from "../config/api";
import { toast } from "sonner";

interface Recipe {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  cookingTime: number;
  status: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export function ChefRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      const res = await apiGetMyRecipes();
      if (res.success) setRecipes(res.recipes);
      else toast.error(res.message);
    } catch { toast.error("Could not connect to server"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecipes(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this recipe?")) return;
    try {
      const res = await apiDeleteRecipe(id);
      if (res.success) { toast.success("Recipe deleted"); fetchRecipes(); }
      else toast.error(res.message);
    } catch { toast.error("Failed to delete recipe"); }
  };

  const statusColor = (status: string) => {
    if (status === "approved") return "default";
    if (status === "rejected") return "destructive";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Recipes</h1>
          <p className="text-muted-foreground">Manage all your submitted recipes</p>
        </div>
        <Button asChild>
          <Link to="/chef/add-recipe"><Plus className="h-4 w-4 mr-2" /> Add Recipe</Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : recipes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't added any recipes yet.</p>
            <Button asChild><Link to="/chef/add-recipe"><Plus className="h-4 w-4 mr-2" />Add Your First Recipe</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <Card key={recipe._id}>
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{recipe.title}</p>
                    <Badge variant={statusColor(recipe.status)} className="capitalize text-xs">{recipe.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{recipe.description}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{recipe.category}</span>
                    <span>{recipe.difficulty}</span>
                    <span>{recipe.cookingTime} mins</span>
                    <span>⭐ {recipe.averageRating} ({recipe.totalReviews} reviews)</span>
                    <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/chef/edit-recipe/${recipe._id}`}><Pencil className="h-4 w-4 mr-1" /> Edit</Link>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(recipe._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}