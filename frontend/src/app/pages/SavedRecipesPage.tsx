import { Clock, Star, Bookmark } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { apiGetMyBookmarks, apiToggleBookmark } from "../config/api";
import { toast } from "sonner";

interface Bookmark {
  _id: string;
  recipe: {
    _id: string; title: string; description: string;
    category: string; difficulty: string; cookingTime: number;
    averageRating: number; totalReviews: number; image: string;
    chef: { name: string };
  };
}

export function SavedRecipesPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const res = await apiGetMyBookmarks();
      if (res.success) setBookmarks(res.bookmarks);
      else toast.error(res.message);
    } catch { toast.error("Could not connect to server"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookmarks(); }, []);

  const handleRemove = async (recipeId: string) => {
    try {
      const res = await apiToggleBookmark(recipeId);
      if (res.success) { toast.success("Bookmark removed"); fetchBookmarks(); }
    } catch { toast.error("Failed to remove bookmark"); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Saved Recipes</h1>
        <p className="text-muted-foreground">Your bookmarked recipes</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No saved recipes yet.</p>
          <Button asChild><Link to="/recipes">Browse Recipes</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bm) => {
            const recipe = bm.recipe;
            if (!recipe) return null;
            return (
              <Card key={bm._id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                  {recipe.image
                    ? <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Link to={`/recipes/${recipe._id}`} className="font-semibold hover:underline line-clamp-1">{recipe.title}</Link>
                    <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">{recipe.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{recipe.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{recipe.cookingTime} mins</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3" />{recipe.averageRating}</span>
                    <span>{recipe.chef?.name}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => handleRemove(recipe._id)}>
                    <Bookmark className="h-4 w-4 mr-2 fill-primary text-primary" /> Remove Bookmark
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}