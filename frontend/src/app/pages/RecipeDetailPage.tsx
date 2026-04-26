import { Clock, Users, Star, Bookmark, ChefHat, Trash2 } from "lucide-react";
import { useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { useEffect, useState } from "react";
import { apiGetRecipe, apiGetReviews, apiAddReview, apiDeleteReview, apiToggleBookmark } from "../config/api";
import { getCurrentUser } from "../config/demoCredentials";
import { toast } from "sonner";

interface Recipe {
  _id: string; title: string; description: string; category: string;
  difficulty: string; cookingTime: number; servings: number;
  ingredients: string[]; instructions: string[]; image: string;
  averageRating: number; totalReviews: number;
  chef: { _id: string; name: string; bio?: string };
}

interface Review {
  _id: string; rating: number; comment: string;
  user: { _id: string; name: string };
  createdAt: string;
}

export function RecipeDetailPage() {
  const { id } = useParams();
  const currentUser = getCurrentUser();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([apiGetRecipe(id), apiGetReviews(id)]).then(([rRes, rvRes]) => {
      if (rRes.success) setRecipe(rRes.recipe);
      if (rvRes.success) setReviews(rvRes.reviews);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleBookmark = async () => {
    if (!currentUser) { toast.error("Login to bookmark recipes"); return; }
    try {
      const res = await apiToggleBookmark(id!);
      if (res.success) { setBookmarked(res.bookmarked); toast.success(res.message); }
    } catch { toast.error("Failed to bookmark"); }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) { toast.error("Login to leave a review"); return; }
    setSubmitting(true);
    try {
      const res = await apiAddReview(id!, { rating, comment });
      if (res.success) {
        toast.success("Review added!");
        setComment(""); setRating(5);
        const rvRes = await apiGetReviews(id!);
        if (rvRes.success) setReviews(rvRes.reviews);
        const rRes = await apiGetRecipe(id!);
        if (rRes.success) setRecipe(rRes.recipe);
      } else { toast.error(res.message); }
    } catch { toast.error("Failed to submit review"); }
    finally { setSubmitting(false); }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const res = await apiDeleteReview(id!, reviewId);
      if (res.success) {
        toast.success("Review deleted");
        setReviews(reviews.filter((r) => r._id !== reviewId));
      } else { toast.error(res.message); }
    } catch { toast.error("Failed to delete review"); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading recipe...</p></div>;
  if (!recipe) return <div className="text-center py-16 text-muted-foreground">Recipe not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        {recipe.image && (
          <div className="aspect-video rounded-xl overflow-hidden">
            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
            <p className="text-muted-foreground">{recipe.description}</p>
          </div>
          <Button variant="outline" size="icon" onClick={handleBookmark}>
            <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-primary text-primary" : ""}`} />
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary">{recipe.category}</Badge>
          <Badge variant="outline">{recipe.difficulty}</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" />{recipe.cookingTime} mins</span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="h-4 w-4" />{recipe.servings} servings</span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{recipe.averageRating} ({recipe.totalReviews} reviews)</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ChefHat className="h-4 w-4" />
          <span>By <strong>{recipe.chef?.name}</strong></span>
          {recipe.chef?.bio && <span>— {recipe.chef.bio}</span>}
        </div>
      </div>

      {/* Ingredients + Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Ingredients</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Instructions</CardTitle></CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Reviews */}
      <Card>
        <CardHeader><CardTitle>Reviews ({recipe.totalReviews})</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {currentUser && (
            <form onSubmit={handleReview} className="space-y-3 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Your Rating:</span>
                {[1,2,3,4,5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)}>
                    <Star className={`h-5 w-5 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
              <Textarea placeholder="Write your review..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
              <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Review"}</Button>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-sm">No reviews yet. Be the first!</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="flex justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{review.user?.name}</span>
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
                {currentUser?._id === review.user?._id && (
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteReview(review._id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}