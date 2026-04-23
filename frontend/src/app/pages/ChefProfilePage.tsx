import { Settings, Mail, ChefHat, BookOpen, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { getCurrentUser } from "../config/demoCredentials";
import { getUserProfile, updateUserProfile } from "../utils/userProfile";
import { useState, useEffect, useMemo } from "react";
import { useRecipes } from "../hooks/useRecipes";
import { getAllReviews } from "../utils/reviews";
import { toast } from "sonner";

export function ChefProfilePage() {
  const currentUser = getCurrentUser();
  const { recipes: allRecipes } = useRecipes();
  const allReviews = getAllReviews();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [userBio, setUserBio] = useState("");

  // Load user profile
  useEffect(() => {
    if (currentUser) {
      const profile = getUserProfile(currentUser.email);
      const bio = profile?.bio || "Passionate chef sharing delicious recipes with the world.";
      setUserBio(bio);
      setEditBio(bio);
    }
  }, [currentUser]);

  // Calculate chef statistics
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

  const totalBookmarks = useMemo(() => {
    return myRecipes.reduce((sum, recipe) => sum + recipe.bookmarks, 0);
  }, [myRecipes]);

  const avgRating = useMemo(() => {
    if (myRecipes.length === 0) return "0.0";
    return (myRecipes.reduce((sum, recipe) => sum + recipe.rating, 0) / myRecipes.length).toFixed(1);
  }, [myRecipes]);

  const handleSaveProfile = () => {
    if (!currentUser) return;

    const success = updateUserProfile(currentUser.email, editBio);
    if (success) {
      setUserBio(editBio);
      setIsEditDialogOpen(false);
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile");
    }
  };

  const userData = {
    name: currentUser?.name || "Chef",
    email: currentUser?.email || "",
    bio: userBio,
    joinedDate: "January 2026",
    stats: {
      recipes: myRecipes.length,
      reviews: myReviews.length,
      bookmarks: totalBookmarks,
      avgRating: avgRating,
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
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

            <Button onClick={() => setIsEditDialogOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
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

      {/* Edit Profile Dialog */}
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
