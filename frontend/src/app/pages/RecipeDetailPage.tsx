import { useParams, Link, Navigate } from "react-router";
import { Clock, Users, ChefHat, Star, Bookmark, BookmarkCheck, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useMemo, useEffect } from "react";
import { useRecipes } from "../hooks/useRecipes";
import { isRecipeSaved, saveRecipe, unsaveRecipe } from "../utils/savedRecipes";
import { getReviewsForRecipe, addReview, formatReviewDate } from "../utils/reviews";
import { getCurrentUser } from "../config/demoCredentials";
import { toast } from "sonner";

// Generate mock detailed data based on recipe
const generateRecipeDetails = (recipe: typeof allRecipes[0]) => {
  const servings = recipe.difficulty === "Easy" ? 2 : recipe.difficulty === "Medium" ? 4 : 6;
  const totalRatings = Math.floor(recipe.bookmarks * 0.7);

  return {
    servings,
    totalRatings,
    description: recipe.description || `A delicious ${recipe.title.toLowerCase()} recipe with authentic flavors. Perfect for any occasion and sure to impress your guests.`,
    ingredients: [
      { name: "Main ingredient", amount: "500g" },
      { name: "Secondary ingredient", amount: "200ml" },
      { name: "Spices and herbs", amount: "2 tbsp" },
      { name: "Oil or butter", amount: "3 tbsp" },
      { name: "Salt", amount: "to taste" },
      { name: "Black pepper", amount: "to taste" },
    ],
    instructions: [
      "Prepare all ingredients by washing, chopping, and measuring as needed.",
      "Heat a large pan or pot over medium heat with oil or butter.",
      "Add your main ingredients and cook until they begin to soften and develop flavor.",
      "Season with spices, herbs, salt, and pepper to taste.",
      "Continue cooking according to the recipe requirements, adjusting heat as needed.",
      "Once cooked through and flavors have melded, remove from heat.",
      "Serve hot and garnish as desired. Enjoy your delicious meal!",
    ],
    nutrition: {
      calories: recipe.difficulty === "Easy" ? 245 : recipe.difficulty === "Medium" ? 320 : 425,
      protein: recipe.difficulty === "Easy" ? "8g" : recipe.difficulty === "Medium" ? "12g" : "18g",
      carbs: recipe.difficulty === "Easy" ? "28g" : recipe.difficulty === "Medium" ? "36g" : "45g",
      fat: recipe.difficulty === "Easy" ? "8g" : recipe.difficulty === "Medium" ? "12g" : "16g",
    },
    reviews: [
      {
        id: 1,
        user: "Sarah Johnson",
        rating: 5,
        comment: "Absolutely delicious! This recipe turned out perfectly. My family asked for seconds!",
        date: "3 days ago",
      },
      {
        id: 2,
        user: "Michael Chen",
        rating: Math.floor(recipe.rating),
        comment: "Great recipe with clear instructions. I made a few tweaks to suit my taste and it was fantastic.",
        date: "1 week ago",
      },
    ],
  };
};

export function RecipeDetailPage() {
  const { id } = useParams();
  const { recipes: allRecipes, loading } = useRecipes();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const currentUser = getCurrentUser();

  // Find the recipe by ID
  const recipe = useMemo(() => {
    return allRecipes.find((r) => r.id === Number(id));
  }, [id, allRecipes]);

  // Generate detailed data for this recipe
  const recipeDetails = useMemo(() => {
    if (!recipe) return null;
    return generateRecipeDetails(recipe);
  }, [recipe]);

  // Load user reviews for this recipe
  useEffect(() => {
    if (recipe) {
      const reviews = getReviewsForRecipe(recipe.id);
      setUserReviews(reviews);
    }
  }, [recipe]);

  // Check if recipe is already saved
  useEffect(() => {
    if (recipe) {
      setIsBookmarked(isRecipeSaved(recipe.id));
    }
  }, [recipe]);

  // Handle save/unsave
  const handleToggleBookmark = () => {
    if (!recipe) return;

    if (isBookmarked) {
      const success = unsaveRecipe(recipe.id);
      if (success) {
        setIsBookmarked(false);
        toast.success("Recipe removed from saved");
      }
    } else {
      const success = saveRecipe({
        id: recipe.id,
        title: recipe.title,
        chef: recipe.chef,
        time: recipe.time,
        difficulty: recipe.difficulty,
        rating: recipe.rating,
        category: recipe.category,
        image: recipe.image,
      });

      if (success) {
        setIsBookmarked(true);
        toast.success("Recipe saved!");
      } else {
        toast.error("This recipe is already saved");
      }
    }
  };

  // Handle review submission
  const handleSubmitReview = () => {
    if (!recipe || !currentUser) {
      toast.error("Please log in to leave a review");
      return;
    }

    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    const success = addReview({
      recipeId: recipe.id,
      userId: currentUser.email,
      userName: currentUser.name,
      rating: userRating,
      comment: reviewComment.trim(),
    });

    if (success) {
      toast.success("Review submitted successfully!");
      setUserRating(0);
      setReviewComment("");
      // Refresh reviews
      const reviews = getReviewsForRecipe(recipe.id);
      setUserReviews(reviews);
    } else {
      toast.error("Failed to submit review");
    }
  };

  // Show loading state while recipes are being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading recipe...</p>
      </div>
    );
  }

  // If recipe not found after loading, redirect to recipes page
  if (!recipe || !recipeDetails) {
    return <Navigate to="/recipes" replace />;
  }

  // Combine mock reviews with user reviews
  const allReviews = [...userReviews, ...recipeDetails.reviews];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
        <ImageWithFallback
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-4 left-4 md:left-8">
          <Link to="/recipes">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{recipe.title}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>{recipe.chef[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{recipe.chef}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="font-medium">{recipe.rating}</span>
                <span className="text-sm opacity-90">({recipeDetails.totalRatings} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Prep Time</p>
                    <p className="font-semibold">{recipe.time}</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Servings</p>
                    <p className="font-semibold">{recipeDetails.servings} people</p>
                  </div>
                  <div className="text-center">
                    <ChefHat className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <Badge variant="default">{recipe.difficulty}</Badge>
                  </div>
                  <div className="text-center">
                    <Bookmark className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Saves</p>
                    <p className="font-semibold">{recipe.bookmarks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About This Recipe</h2>
              <p className="text-muted-foreground leading-relaxed">{recipeDetails.description}</p>
            </div>

            {/* Ingredients */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
                <ul className="space-y-3">
                  {recipeDetails.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="flex-1">
                        <span className="font-medium">{ingredient.amount}</span> {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                <ol className="space-y-4">
                  {recipeDetails.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <p className="flex-1 pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Reviews ({allReviews.length})</h2>

              {/* Leave Review */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Leave a Review</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm mb-2">Your Rating</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserRating(star)}
                            className="transition-colors"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= userRating ? "fill-accent text-accent" : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      placeholder="Share your experience with this recipe..."
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                    <Button onClick={handleSubmitReview}>Submit Review</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Review List */}
              <div className="space-y-4">
                {allReviews.map((review, index) => (
                  <Card key={review.id || `mock-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>{(review.userName || review.user)?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{review.userName || review.user}</h4>
                            <span className="text-sm text-muted-foreground">
                              {review.date && review.date.includes('T') ? formatReviewDate(review.date) : review.date}
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
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <Button
                  className="w-full"
                  onClick={handleToggleBookmark}
                  variant={isBookmarked ? "secondary" : "default"}
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkCheck className="h-5 w-5 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-5 w-5 mr-2" />
                      Save Recipe
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Nutrition Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Nutrition Information</h3>
                <p className="text-xs text-muted-foreground mb-4">Per serving</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Calories</span>
                    <span className="font-semibold">{recipeDetails.nutrition.calories} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Protein</span>
                    <span className="font-semibold">{recipeDetails.nutrition.protein}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Carbs</span>
                    <span className="font-semibold">{recipeDetails.nutrition.carbs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Fat</span>
                    <span className="font-semibold">{recipeDetails.nutrition.fat}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
