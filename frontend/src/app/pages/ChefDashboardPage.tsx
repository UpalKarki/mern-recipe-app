import { Plus, BookOpen, Star, Clock } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useEffect, useState } from "react";
import { apiGetMyRecipes } from "../config/api";
import { getCurrentUser } from "../config/demoCredentials";
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

export function ChefDashboardPage() {
  const currentUser = getCurrentUser();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetMyRecipes()
      .then((res) => {
        if (res.success) setRecipes(res.recipes);
        else toast.error(res.message || "Failed to load recipes");
      })
      .catch(() => toast.error("Could not connect to server"))
      .finally(() => setLoading(false));
  }, []);

  const approved = recipes.filter((r) => r.status === "approved").length;
  const pending = recipes.filter((r) => r.status === "pending").length;
  const avgRating = recipes.length
    ? (recipes.reduce((sum, r) => sum + r.averageRating, 0) / recipes.length).toFixed(1)
    : "0.0";

  const statCards = [
    { title: "Total Recipes", value: recipes.length, icon: BookOpen, desc: "All your recipes" },
    { title: "Approved", value: approved, icon: Star, desc: "Live on platform" },
    { title: "Pending", value: pending, icon: Clock, desc: "Awaiting review" },
    { title: "Avg Rating", value: avgRating, icon: Star, desc: "Across all recipes" },
  ];

  const statusColor = (status: string) => {
    if (status === "approved") return "default";
    if (status === "rejected") return "destructive";
    return "secondary";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chef Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {currentUser?.name}!</p>
        </div>
        <Button asChild>
          <Link to="/chef/add-recipe">
            <Plus className="h-4 w-4 mr-2" /> Add New Recipe
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Recipes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Recipes</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/chef/manage-recipes">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading your recipes...</p>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't added any recipes yet.</p>
              <Button asChild>
                <Link to="/chef/add-recipe">
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Recipe
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recipes.slice(0, 5).map((recipe) => (
                <div key={recipe._id}
                  className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{recipe.title}</p>
                      <Badge variant={statusColor(recipe.status)} className="capitalize text-xs">
                        {recipe.status}
                      </Badge>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>{recipe.category}</span>
                      <span>{recipe.difficulty}</span>
                      <span>{recipe.cookingTime} mins</span>
                      <span>⭐ {recipe.averageRating} ({recipe.totalReviews} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}