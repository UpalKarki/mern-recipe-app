import { Check, X, Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useEffect, useState } from "react";
import { apiGetAllRecipes, apiUpdateRecipeStatus, apiAdminDeleteRecipe } from "../config/api";
import { toast } from "sonner";

interface Recipe {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  cookingTime: number;
  status: string;
  chef: { _id: string; name: string; email: string };
  createdAt: string;
}

export function ApproveRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await apiGetAllRecipes(filter === "all" ? undefined : filter);
      if (res.success) setRecipes(res.recipes);
    } catch {
      toast.error("Failed to fetch recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipes(); }, [filter]);

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await apiUpdateRecipeStatus(id, status);
      if (res.success) {
        toast.success(`Recipe ${status}`);
        fetchRecipes();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    try {
      const res = await apiAdminDeleteRecipe(id);
      if (res.success) {
        toast.success("Recipe deleted");
        fetchRecipes();
      }
    } catch {
      toast.error("Failed to delete recipe");
    }
  };

  const statusColor = (status: string) => {
    if (status === "approved") return "default";
    if (status === "rejected") return "destructive";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Recipes</h1>
        <p className="text-muted-foreground">Approve or reject chef-submitted recipes</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No {filter === "all" ? "" : filter} recipes found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <Card key={recipe._id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg">{recipe.title}</h3>
                      <Badge variant={statusColor(recipe.status)} className="capitalize">
                        {recipe.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{recipe.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Chef: <strong>{recipe.chef?.name || "Unknown"}</strong></span>
                      <span>Category: {recipe.category}</span>
                      <span>Difficulty: {recipe.difficulty}</span>
                      <span>Time: {recipe.cookingTime} mins</span>
                      <span>Submitted: {new Date(recipe.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {recipe.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => handleStatus(recipe._id, "approved")}
                          className="bg-green-600 hover:bg-green-700 text-white">
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleStatus(recipe._id, "rejected")}>
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                    {recipe.status === "approved" && (
                      <Button size="sm" variant="destructive" onClick={() => handleStatus(recipe._id, "rejected")}>
                        <X className="h-4 w-4 mr-1" /> Revoke
                      </Button>
                    )}
                    {recipe.status === "rejected" && (
                      <Button size="sm" onClick={() => handleStatus(recipe._id, "approved")}
                        className="bg-green-600 hover:bg-green-700 text-white">
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleDelete(recipe._id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}