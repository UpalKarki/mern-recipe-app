import { useParams, Link, Navigate } from "react-router";
import { Clock, Users, ChefHat, Star, ArrowLeft, Edit } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useMemo, useEffect } from "react";
import { useRecipes } from "../hooks/useRecipes";
import { getReviewsForRecipe, formatReviewDate } from "../utils/reviews";
import { getCurrentUser } from "../config/demoCredentials";

// Generate mock detailed data based on recipe
const generateRecipeDetails = (recipe: any) => {
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

export function ChefRecipeDetailPage() {
  const { id } = useParams();
  const { recipes: allRecipes, loading } = useRecipes();
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const currentUser = getCurrentUser();

  // Find the recipe by ID
  const recipe = useMemo(() => {
    return allRecipes.find((r) => r.id === Number(id));
  }, [id, allRecipes]);

  // Check if current user owns this recipe
  const isOwner = useMemo(() => {
    if (!currentUser || !recipe) return false;
    return recipe.chef === currentUser.name;
  }, [currentUser, recipe]);

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

  // Show loading state while recipes are being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading recipe...</p>
      </div>
    );
  }

  // If recipe not found after loading, redirect to chef recipes
  if (!recipe || !recipeDetails) {
    return <Navigate to="/chef/recipes" replace />;
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
          <Link to="/chef/recipes">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Recipes
            </Button>
          </Link>
        </div>

        {isOwner && (
          <div className="absolute top-4 right-4 md:right-8">
            <Link to={`/chef/edit-recipe/${recipe.id}`}>
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
                    <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-semibold">{recipe.rating}</p>
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

              {/* Review List */}
              <div className="space-y-4">
                {allReviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">No reviews yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  allReviews.map((review, index) => (
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
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Recipe Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Saves</span>
                    <span className="font-bold text-lg">{recipe.bookmarks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <span className="font-bold text-lg">{recipe.rating}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Reviews</span>
                    <span className="font-bold text-lg">{allReviews.length}</span>
                  </div>
                </div>
                {isOwner && (
                  <div className="mt-6">
                    <Link to={`/chef/edit-recipe/${recipe.id}`}>
                      <Button className="w-full">
                        <Edit className="h-5 w-5 mr-2" />
                        Edit Recipe
                      </Button>
                    </Link>
                  </div>
                )}
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
