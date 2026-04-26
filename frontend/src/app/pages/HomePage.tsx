import { Link, useNavigate } from "react-router";
import { Search, Clock, ChefHat, Star, Bookmark, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getCurrentUser } from "../config/demoCredentials";
import { toast } from "sonner";
import { useState, useMemo, useRef, useEffect } from "react";
import { apiGetRecipes, apiToggleBookmark } from "../config/api";

const categories = [
  { name: "Italian", icon: "🍝" },
  { name: "Asian", icon: "🍜" },
  { name: "Mexican", icon: "🌮" },
  { name: "Desserts", icon: "🍰" },
  { name: "Vegetarian", icon: "🥗" },
  { name: "Seafood", icon: "🦐" },
];

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allRecipes, setAllRecipes] = useState<any[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const currentUser = getCurrentUser();
  const recipesRef = useRef<HTMLDivElement>(null);

  // Fetch real approved recipes from backend
  useEffect(() => {
    apiGetRecipes().then((res) => {
      if (res.success) setAllRecipes(res.recipes);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) { toast.error("Please enter a search term"); return; }
    recipesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSearchQuery("");
    setTimeout(() => { recipesRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
  };

  const clearFilters = () => { setSearchQuery(""); setSelectedCategory(null); };

  const handleBookmark = async (recipe: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) { toast.info("Please login to save recipes"); return; }
    try {
      const res = await apiToggleBookmark(recipe._id);
      if (res.success) {
        setBookmarkedIds(prev => {
          const next = new Set(prev);
          res.bookmarked ? next.add(recipe._id) : next.delete(recipe._id);
          return next;
        });
        toast.success(res.message);
      }
    } catch { toast.error("Failed to bookmark"); }
  };

  // Filter recipes — same logic as before, just using _id and real fields
  const filteredRecipes = useMemo(() => {
    let results = [...allRecipes];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.chef?.name?.toLowerCase().includes(query) ||
          recipe.category.toLowerCase().includes(query)
      );
    }
    if (selectedCategory) {
      results = results.filter((recipe) => recipe.category === selectedCategory);
    }
    return results;
  }, [searchQuery, selectedCategory, allRecipes]);

  // Category counts from real data
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.name] = allRecipes.filter((r) => r.category === cat.name).length;
    });
    return counts;
  }, [allRecipes]);

  const displayRecipes = searchQuery || selectedCategory ? filteredRecipes : allRecipes.slice(0, 6);
  const showingAll = searchQuery || selectedCategory;

  return (
    <div>
      {/* Hero Section — UNCHANGED */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Discover Amazing Recipes
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Explore thousands of delicious recipes from chefs around the world.
              Cook, share, and save your favorites.
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
              </Link>
              <Link to="/login" state={{ from: "/chef" }}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Chef Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section — UNCHANGED UI, real counts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className={`hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer ${
                  selectedCategory === category.name ? "ring-2 ring-primary shadow-lg" : ""
                }`}
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

      {/* Recipes Section — UNCHANGED UI, real recipes */}
      <section ref={recipesRef} className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">
                {showingAll
                  ? selectedCategory ? `${selectedCategory} Recipes` : "Search Results"
                  : "Featured Recipes"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex gap-2">
              {(searchQuery || selectedCategory) && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />Clear Filters
                </Button>
              )}
              {!currentUser && (
                <Link to="/login"><Button variant="outline">Login to Save</Button></Link>
              )}
            </div>
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No recipes found matching your search.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayRecipes.map((recipe) => (
                  <div
                    key={recipe._id}
                    className="cursor-pointer"
                    onClick={() => {
                      if (!currentUser) {
                        toast.info("Please login to view recipe details");
                        navigate("/login", { state: { from: `/recipes/${recipe._id}` } });
                      } else {
                        navigate(`/recipes/${recipe._id}`);
                      }
                    }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
                      <div className="aspect-video relative overflow-hidden">
                        <ImageWithFallback
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                          onClick={(e) => handleBookmark(recipe, e)}
                        >
                          <Bookmark className={`h-5 w-5 ${bookmarkedIds.has(recipe._id) ? "fill-primary text-primary" : "text-foreground"}`} />
                        </button>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                          <ChefHat className="h-4 w-4" />
                          {recipe.chef?.name}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {recipe.cookingTime} mins
                          </span>
                          <Badge variant={
                            recipe.difficulty === "Easy" ? "secondary"
                            : recipe.difficulty === "Medium" ? "default"
                            : "destructive"
                          }>
                            {recipe.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                          <span className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            {recipe.averageRating}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {recipe.totalReviews} reviews
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {showingAll && filteredRecipes.length > 6 && (
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground mb-4">Showing all {filteredRecipes.length} recipes</p>
                </div>
              )}

              {!showingAll && (
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Showing 6 of {allRecipes.length} total recipes
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery(" ");
                    setTimeout(() => { recipesRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
                  }}>
                    View All Recipes
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section — UNCHANGED */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-12 text-center">
              <ChefHat className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">Ready to Share Your Recipes?</h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join our community of passionate chefs and home cooks. Share your culinary creations with food lovers worldwide.
              </p>
              <Link to="/register">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Get Started Today
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}