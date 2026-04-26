import { Link } from "react-router";
import { Clock, ChefHat, Star, Bookmark, Settings, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getCurrentUser, setCurrentUser } from "../config/demoCredentials";
import { useState, useEffect } from "react";
import { apiGetMyBookmarks, apiUpdateProfile } from "../config/api";
import { toast } from "sonner";

export function UserProfilePage() {
  const currentUser = getCurrentUser();

  // ── REAL API STATE ─────────────────────────────────────────────────────────
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);

  // Fetch real bookmarks from backend on mount
  useEffect(() => {
    apiGetMyBookmarks()
      .then((res) => { if (res.success) setBookmarks(res.bookmarks); })
      .finally(() => setLoadingBookmarks(false));
  }, []);
  // ──────────────────────────────────────────────────────────────────────────

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editBio, setEditBio] = useState(currentUser?.bio || "");

  const handleSaveProfile = async () => {
    try {
      const res = await apiUpdateProfile({ bio: editBio });
      if (res.success) {
        // Keep localStorage in sync so the header still shows the right name
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
    name: currentUser?.name || "User",
    email: currentUser?.email || "",
    bio: currentUser?.bio || "Food enthusiast exploring delicious recipes from around the world.",
    joinedDate: "January 2026",
    stats: {
      // Real count from API
      savedRecipes: loadingBookmarks ? "..." : bookmarks.length,
      // Reviews count kept as placeholder — no reviews API endpoint for users yet
      reviews: "—",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header — IDENTICAL to original */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">{userData.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
              <p className="text-muted-foreground mb-4">{userData.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {userData.email}
                </span>
                <span>Member since {userData.joinedDate}</span>
              </div>
            </div>

            <Button variant="outline" onClick={() => { setEditBio(currentUser?.bio || ""); setIsEditDialogOpen(true); }}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Stats — IDENTICAL layout, real savedRecipes count */}
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {userData.stats.savedRecipes}
                </div>
                <p className="text-sm text-muted-foreground">Saved Recipes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {userData.stats.reviews}
                </div>
                <p className="text-sm text-muted-foreground">Reviews</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content Tabs — IDENTICAL layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="saved">Saved Recipes</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>

          {/* Saved Recipes Tab — real data from API */}
          <TabsContent value="saved">
            {loadingBookmarks ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Loading saved recipes...</p>
                </CardContent>
              </Card>
            ) : bookmarks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No saved recipes yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start exploring and save your favorite recipes!
                  </p>
                  <Link to="/recipes">
                    <Button>Browse Recipes</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              // IDENTICAL card grid — just using real bookmark data
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((bm) => {
                  const recipe = bm.recipe;
                  if (!recipe) return null;
                  return (
                    <Link key={bm._id} to={`/recipes/${recipe._id}`}>
                      <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
                        <div className="aspect-video relative overflow-hidden">
                          <ImageWithFallback
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                          />
                          <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                            <Bookmark className="h-5 w-5 text-primary fill-primary" />
                          </button>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2">{recipe.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                            <ChefHat className="h-4 w-4" />
                            {recipe.chef?.name}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {recipe.cookingTime} mins
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              {recipe.averageRating}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab — IDENTICAL empty state */}
          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-12 text-center">
                <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-6">
                  Try some recipes and share your experience!
                </p>
                <Link to="/recipes">
                  <Button>Browse Recipes</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog — IDENTICAL layout, real save */}
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