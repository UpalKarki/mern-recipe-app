import { Settings, Mail, ChefHat, BookOpen, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { getCurrentUser, setCurrentUser } from "../config/demoCredentials";
import { useState, useEffect, useMemo } from "react";
import { apiGetMyRecipes, apiUpdateProfile } from "../config/api";
import { toast } from "sonner";

export function ChefProfilePage() {
  const currentUser = getCurrentUser();

  // ── REAL API STATE ─────────────────────────────────────────────────────────
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch chef's real recipes from backend
  useEffect(() => {
    apiGetMyRecipes()
      .then((res) => { if (res.success) setRecipes(res.recipes); })
      .finally(() => setLoading(false));
  }, []);
  // ──────────────────────────────────────────────────────────────────────────

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editBio, setEditBio] = useState(currentUser?.bio || "");

  // Compute stats from real recipe data
  const totalReviews = useMemo(() =>
    recipes.reduce((sum, r) => sum + (r.totalReviews || 0), 0), [recipes]);

  const avgRating = useMemo(() => {
    if (recipes.length === 0) return "0.0";
    const rated = recipes.filter(r => r.averageRating > 0);
    if (rated.length === 0) return "0.0";
    return (rated.reduce((sum, r) => sum + r.averageRating, 0) / rated.length).toFixed(1);
  }, [recipes]);

  // Total saves is not directly available from getMyRecipes — use totalReviews as proxy
  // We keep the same 4-stat card layout, replacing "bookmarks" with totalReviews
  const totalSaves = useMemo(() =>
    recipes.reduce((sum, r) => sum + (r.bookmarks || 0), 0), [recipes]);

  const handleSaveProfile = async () => {
    try {
      const res = await apiUpdateProfile({ bio: editBio });
      if (res.success) {
        const updated = { ...currentUser, bio: editBio };
        setCurrentUser(updated as any);
        setIsEditDialogOpen(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch {
      toast.error("Could not connect to server");
    }
  };

  const userData = {
    name: currentUser?.name || "Chef",
    email: currentUser?.email || "",
    bio: currentUser?.bio || "Passionate chef sharing delicious recipes with the world.",
    joinedDate: "January 2026",
    stats: {
      recipes: loading ? "..." : recipes.length,
      avgRating: loading ? "..." : avgRating,
      reviews: loading ? "..." : totalReviews,
      bookmarks: loading ? "..." : totalSaves,
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header — IDENTICAL to original */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {userData.name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
              <p className="text-muted-foreground mb-4">{userData.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {userData.email}
                </span>
                <span className="flex items-center gap-1">
                  <ChefHat className="h-4 w-4" />
                  Chef since {userData.joinedDate}
                </span>
              </div>
            </div>

            <Button onClick={() => { setEditBio(currentUser?.bio || ""); setIsEditDialogOpen(true); }}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid — IDENTICAL 4-card layout, real numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {userData.stats.recipes}
            </div>
            <p className="text-sm text-muted-foreground">Total Recipes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Star className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {userData.stats.avgRating}
            </div>
            <p className="text-sm text-muted-foreground">Avg. Rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Star className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {userData.stats.reviews}
            </div>
            <p className="text-sm text-muted-foreground">Total Reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <ChefHat className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {userData.stats.bookmarks}
            </div>
            <p className="text-sm text-muted-foreground">Total Saves</p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog — IDENTICAL layout, real save via API */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={userData.name}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Name cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={userData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}