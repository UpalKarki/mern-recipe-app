import { Users, BookOpen, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useRecipes } from "../hooks/useRecipes";
import { getAllReviews } from "../utils/reviews";
import { useMemo } from "react";

export function AdminDashboardPage() {
  const { recipes: allRecipes } = useRecipes();
  const allReviews = getAllReviews();

  const uniqueChefs = useMemo(() => {
    return new Set(allRecipes.map(recipe => recipe.chef)).size;
  }, [allRecipes]);

  const totalBookmarks = useMemo(() => {
    return allRecipes.reduce((sum, recipe) => sum + recipe.bookmarks, 0);
  }, [allRecipes]);

  const avgRating = useMemo(() => {
    if (allRecipes.length === 0) return "0.0";
    return (allRecipes.reduce((sum, recipe) => sum + recipe.rating, 0) / allRecipes.length).toFixed(1);
  }, [allRecipes]);

  const stats = [
    {
      title: "Total Users",
      value: "3",
      icon: Users,
      change: "Demo accounts",
      changeType: "positive",
    },
    {
      title: "Total Recipes",
      value: allRecipes.length.toString(),
      icon: BookOpen,
      change: "In platform",
      changeType: "positive",
    },
    {
      title: "Total Reviews",
      value: allReviews.length.toString(),
      icon: Clock,
      change: "User feedback",
      changeType: "positive",
    },
    {
      title: "Active Chefs",
      value: uniqueChefs.toString(),
      icon: TrendingUp,
      change: "Contributing",
      changeType: "positive",
    },
  ];

  const recentUsers = [
    { id: 1, name: "John Doe", email: "user@recipenest.com", role: "User", joinedDate: "2026-01-15" },
    { id: 2, name: "Chef Maria Garcia", email: "chef@recipenest.com", role: "Chef", joinedDate: "2026-01-10" },
    { id: 3, name: "Admin Sarah Johnson", email: "admin@recipenest.com", role: "Admin", joinedDate: "2026-01-01" },
  ];

  const platformStats = [
    { label: "Total Recipes", value: allRecipes.length.toString() },
    { label: "Total Bookmarks", value: totalBookmarks.toLocaleString() },
    { label: "Total Reviews", value: allReviews.length.toString() },
    { label: "Avg. Rating", value: avgRating },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform statistics and activity</p>
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
                  <Badge
                    variant={stat.changeType === "warning" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
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
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={user.role === "Chef" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {platformStats.map((stat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <span className="text-lg font-bold">{stat.value}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((parseInt(stat.value.replace(/,/g, "")) / 50000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
