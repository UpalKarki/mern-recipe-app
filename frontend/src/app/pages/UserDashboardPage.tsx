import { Link, useNavigate } from "react-router";
import { Search, Clock, ChefHat, Star, Bookmark, Heart, BookmarkCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getCurrentUser } from "../config/demoCredentials";
import { useRecipes } from "../hooks/useRecipes";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { getSavedRecipes, isRecipeSaved, saveRecipe, unsaveRecipe } from "../utils/savedRecipes";
import { getAllReviews } from "../utils/reviews";

const categories = [
  { name: "Italian", icon: "🍝" },
  { name: "Asian", icon: "🍜" },
  { name: "Mexican", icon: "🌮" },
  { name: "Desserts", icon: "🍰" },
  { name: "Vegetarian", icon: "🥗" },
  { name: "Seafood", icon: "🦐" },
];

export function UserDashboardPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const { recipes: allRecipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<number>>(new Set());
  const [savedCount, setSavedCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Load saved recipes count and IDs
  useEffect(() => {
    const savedRecipes = getSavedRecipes();
    setSavedCount(savedRecipes.length);
    const ids = new Set(savedRecipes.map(r => r.id));
    setSavedRecipeIds(ids);

    // Load review count
    const user = getCurrentUser();
    if (user) {
      const allReviews = getAllReviews();
      const userReviews = allReviews.filter(r => r.userId === user.email);
      setReviewCount(userReviews.length);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    navigate(`/recipes?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/recipes?category=${encodeURIComponent(categoryName)}`);
  };

  const handleToggleBookmark = (recipe: typeof allRecipes[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isSaved = savedRecipeIds.has(recipe.id);

    if (isSaved) {
      const success = unsaveRecipe(recipe.id);
      if (success) {
        setSavedRecipeIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipe.id);
          return newSet;
        });
        const newCount = getSavedRecipes().length;
        setSavedCount(newCount);
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
        setSavedRecipeIds(prev => new Set(prev).add(recipe.id));
        const newCount = getSavedRecipes().length;
        setSavedCount(newCount);
        toast.success("Recipe saved!");
      } else {
        toast.error("This recipe is already saved");
      }
    }
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.name] = allRecipes.filter((r) => r.category === cat.name).length;
    });
    return counts;
  }, [allRecipes]);

  // Get recommended recipes (first 6)
  const recommendedRecipes = allRecipes.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Welcome back, {currentUser?.name || 'User'}! 👋
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Ready to discover new recipes or revisit your favorites?
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for recipes, ingredients, or chefs..."
                  className="pl-12 pr-4 py-6 text-base rounded-xl bg-white shadow-lg border-border"
                />
              </form>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Link to="/saved-recipes">
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Heart className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground">Saved Recipes</p>
                        <p className="text-2xl font-bold">{savedCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/profile">
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <Star className="h-6 w-6 text-accent" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground">Reviews</p>
                        <p className="text-2xl font-bold">{reviewCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {categoryCounts[category.name] || 0} recipes
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended for You */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Recommended for You</h2>
              <p className="text-muted-foreground mt-2">
                Personalized recipes based on your taste
              </p>
            </div>
            <Link to="/recipes">
              <Button variant="outline">View All Recipes</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedRecipes.map((recipe) => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <ImageWithFallback
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                      onClick={(e) => handleToggleBookmark(recipe, e)}
                    >
                      {savedRecipeIds.has(recipe.id) ? (
                        <BookmarkCheck className="h-5 w-5 text-primary" />
                      ) : (
                        <Bookmark className="h-5 w-5 text-foreground" />
                      )}
                    </button>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                      <ChefHat className="h-4 w-4" />
                      {recipe.chef}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {recipe.time}
                      </span>
                      <Badge
                        variant={
                          recipe.difficulty === "Easy"
                            ? "secondary"
                            : recipe.difficulty === "Medium"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {recipe.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        {recipe.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {recipe.bookmarks} saves
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
