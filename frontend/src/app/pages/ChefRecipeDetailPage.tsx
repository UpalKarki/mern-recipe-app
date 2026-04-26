import { useParams, Link, Navigate } from "react-router";
import { Clock, Users, ChefHat, Star, ArrowLeft, Edit } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { apiGetRecipe, apiGetReviews } from "../config/api";
import { getCurrentUser } from "../config/demoCredentials";
import { formatReviewDate } from "../utils/reviews";

export function ChefRecipeDetailPage() {
  const { id } = useParams();
  const currentUser = getCurrentUser();

  // ── REAL API STATE ─────────────────────────────────────────────────────────
  const [recipe, setRecipe] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([apiGetRecipe(id), apiGetReviews(id)])
      .then(([rRes, rvRes]) => {
        if (rRes.success) setRecipe(rRes.recipe);
        if (rvRes.success) setReviews(rvRes.reviews);
      })
      .finally(() => setLoading(false));
  }, [id]);
  // ──────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return <Navigate to="/chef/recipes" replace />;
  }

  // Chef owns this recipe if their _id matches recipe.chef._id
  const isOwner = currentUser?._id
    ? recipe.chef?._id === currentUser._id || recipe.chef === currentUser._id
    : false;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image — IDENTICAL to original */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
        <ImageWithFallback
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-4 left-4 md:left-8">
          <Link to="/chef/recipes">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Recipes
            </Button>
          </Link>
        </div>

        {isOwner && (
          <div className="absolute top-4 right-4 md:right-8">
            <Link to={`/chef/edit-recipe/${recipe._id}`}>
              <Button variant="secondary" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Recipe
              </Button>
            </Link>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{recipe.title}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>{recipe.chef?.name?.[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{recipe.chef?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="font-medium">{recipe.averageRating}</span>
                <span className="text-sm opacity-90">({recipe.totalReviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content — IDENTICAL layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info — IDENTICAL 4-stat card */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Cook Time</p>
                    <p className="font-semibold">{recipe.cookingTime} mins</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Servings</p>
                    <p className="font-semibold">{recipe.servings} people</p>
                  </div>
                  <div className="text-center">
                    <ChefHat className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <Badge variant="default">{recipe.difficulty}</Badge>
                  </div>
                  <div className="text-center">
                    <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-semibold">{recipe.averageRating}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About This Recipe</h2>
              <p className="text-muted-foreground leading-relaxed">{recipe.description}</p>
            </div>

            {/* Ingredients — real data from recipe.ingredients */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
                <ul className="space-y-3">
                  {(recipe.ingredients || []).map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="flex-1">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions — real data from recipe.instructions */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                <ol className="space-y-4">
                  {(recipe.instructions || []).map((step: string, index: number) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <p className="flex-1 pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Reviews — real reviews from API */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">No reviews yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  reviews.map((review) => (
                    <Card key={review._id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>{review.user?.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.user?.name}</h4>
                              <span className="text-sm text-muted-foreground">
                                {formatReviewDate(review.createdAt)}
                              </span>
                            </div>
                            <div className="flex gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating ? "fill-accent text-accent" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar — IDENTICAL layout, real numbers */}
          <div className="space-y-6">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Recipe Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <span className="font-bold text-lg">{recipe.averageRating}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Reviews</span>
                    <span className="font-bold text-lg">{recipe.totalReviews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium
                      ${recipe.status === "approved" ? "bg-green-100 text-green-700"
                      : recipe.status === "rejected" ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"}`}>
                      {recipe.status}
                    </span>
                  </div>
                </div>
                {isOwner && (
                  <div className="mt-6">
                    <Link to={`/chef/edit-recipe/${recipe._id}`}>
                      <Button className="w-full">
                        <Edit className="h-5 w-5 mr-2" />
                        Edit Recipe
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Nutrition — real data if stored, otherwise hidden */}
            {recipe.nutritionInfo && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Nutrition Information</h3>
                  <p className="text-xs text-muted-foreground mb-4">Per serving</p>
                  <p className="text-sm text-muted-foreground">{recipe.nutritionInfo}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}