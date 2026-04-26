import { Users, BookOpen, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useEffect, useState } from "react";
import { apiGetStats, apiGetAllUsers } from "../config/api";

interface Stats {
  totalUsers: number;
  totalChefs: number;
  totalRecipes: number;
  pendingRecipes: number;
  totalReviews: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          apiGetStats(),
          apiGetAllUsers(),
        ]);
        if (statsRes.success) setStats(statsRes.stats);
        if (usersRes.success) setRecentUsers(usersRes.users.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, change: "Registered users" },
    { title: "Total Recipes", value: stats?.totalRecipes ?? 0, icon: BookOpen, change: "Approved recipes" },
    { title: "Total Reviews", value: stats?.totalReviews ?? 0, icon: Clock, change: "User feedback" },
    { title: "Active Chefs", value: stats?.totalChefs ?? 0, icon: TrendingUp, change: "Contributing" },
  ];

  const platformStats = [
    { label: "Approved Recipes", value: stats?.totalRecipes ?? 0, max: 100 },
    { label: "Pending Recipes", value: stats?.pendingRecipes ?? 0, max: 50 },
    { label: "Total Reviews", value: stats?.totalReviews ?? 0, max: 200 },
    { label: "Total Chefs", value: stats?.totalChefs ?? 0, max: 50 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform statistics and activity</p>
      </div>

      {/* Stats Grid */}
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
                  <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
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
              {recentUsers.length === 0 ? (
                <p className="text-muted-foreground text-sm">No users yet.</p>
              ) : (
                recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={user.role === "chef" ? "default" : user.role === "admin" ? "destructive" : "secondary"}>
                        {user.role}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
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
              {platformStats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <span className="text-lg font-bold">{stat.value}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((stat.value / stat.max) * 100, 100)}%` }}
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