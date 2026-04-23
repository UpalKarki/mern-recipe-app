import { BookOpen, Star, Bookmark, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useRecipes } from "../hooks/useRecipes";
import { getCurrentUser } from "../config/demoCredentials";
import { getAllReviews, formatReviewDate } from "../utils/reviews";
import { useMemo } from "react";
import { Link } from "react-router";

export function ChefDashboardPage() {
  const currentUser = getCurrentUser();
  const { recipes: allRecipes } = useRecipes();
  const allReviews = getAllReviews();

  const myRecipes = useMemo(() => {
    if (!currentUser) return [];
    return allRecipes.filter(recipe => recipe.chef === currentUser.name);
  }, [allRecipes, currentUser]);

  const myRecipeIds = useMemo(() => {
    return new Set(myRecipes.map(r => r.id));
  }, [myRecipes]);

  const myReviews = useMemo(() => {
    return allReviews.filter(review => myRecipeIds.has(review.recipeId));
  }, [allReviews, myRecipeIds]);

  const stats = useMemo(() => {
    const totalRecipes = myRecipes.length;
    const totalBookmarks = myRecipes.reduce((sum, recipe) => sum + recipe.bookmarks, 0);
    const totalReviews = myReviews.length;
    const avgRating = myRecipes.length > 0
      ? (myRecipes.reduce((sum, recipe) => sum + recipe.rating, 0) / myRecipes.length).toFixed(1)
      : "0.0";

    return [
      {
        title: "Total Recipes",
        value: totalRecipes.toString(),
        icon: BookOpen,
        change: "",
      },
      {
        title: "Total Reviews",
        value: totalReviews.toString(),
        icon: Star,
        change: "",
      },
      {
        title: "Total Bookmarks",
        value: totalBookmarks.toLocaleString(),
        icon: Bookmark,
        change: "",
      },
      {
        title: "Avg. Rating",
        value: avgRating,
        icon: TrendingUp,
        change: "",
      },
    ];
  }, [myRecipes, myReviews]);

  const recentActivity = useMemo(() => {
    const recipeMap = new Map(myRecipes.map(r => [r.id, r.title]));

    return myReviews
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((review, index) => ({
        id: index,
        type: "review",
        recipe: recipeMap.get(review.recipeId) || "Unknown Recipe",
        user: review.userName,
        action: `left a ${review.rating}-star review`,
        time: formatReviewDate(review.date),
      }));
  }, [myReviews, myRecipes]);

  const topRecipes = useMemo(() => {
    return [...myRecipes]
      .sort((a, b) => b.bookmarks - a.bookmarks)
      .slice(0, 3);
  }, [myRecipes]);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your recipes.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className={`mt-1 p-2 rounded-lg ${activity.type === "review" ? "bg-accent/10" : "bg-primary/10"}`}>
                    {activity.type === "review" ? (
                      <Star className="h-4 w-4 text-accent" />
                    ) : (
                      <Bookmark className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-sm text-primary font-medium truncate">{activity.recipe}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Recipes */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            {topRecipes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recipes yet. Add your first recipe to see it here!
              </p>
            ) : (
              <div className="space-y-4">
                {topRecipes.map((recipe, index) => (
                  <div key={recipe.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/chef/recipes/${recipe.id}`}>
                        <h4 className="font-medium truncate hover:text-primary transition-colors">{recipe.title}</h4>
                      </Link>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Bookmark className="h-3 w-3" />
                          {recipe.bookmarks} saves
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-accent text-accent" />
                          {recipe.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
