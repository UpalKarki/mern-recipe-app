import { Link, useSearchParams } from "react-router";
import { Search, Clock, ChefHat, Star, Bookmark, SlidersHorizontal, X, BookmarkCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect, useMemo } from "react";
import { useRecipes } from "../hooks/useRecipes";
import { isRecipeSaved, saveRecipe, unsaveRecipe } from "../utils/savedRecipes";
import { toast } from "sonner";

const categories = ["All", "Italian", "Asian", "Mexican", "Desserts", "Vegetarian", "Seafood", "Meat"];

export function RecipeListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipes: allRecipes } = useRecipes();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "ingredient">("name");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<number>>(new Set());
  const recipesPerPage = 6;

  // Load saved recipe IDs
  useEffect(() => {
    const updateSavedRecipes = () => {
      const ids = new Set(allRecipes.filter(r => isRecipeSaved(r.id)).map(r => r.id));
      setSavedRecipeIds(ids);
    };
    updateSavedRecipes();
  }, [allRecipes]);

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
        toast.success("Recipe saved!");
      } else {
        toast.error("This recipe is already saved");
      }
    }
  };

  // Initialize from URL params
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlCategory = searchParams.get("category");

    if (urlSearch) {
      setSearchQuery(urlSearch);
    }

    if (urlCategory) {
      setSelectedCategories([urlCategory]);
    }
  }, [searchParams]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (searchType === "name") {
          if (!recipe.title.toLowerCase().includes(query)) {
            return false;
          }
        }
        // For ingredient search, we'd need ingredient data - for now just search title
        else if (!recipe.title.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Filter by category
      if (selectedCategories.length > 0 && !selectedCategories.includes("All")) {
        if (!selectedCategories.includes(recipe.category)) {
          return false;
        }
      }

      // Filter by difficulty
      if (difficulty !== "all") {
        const difficultyMap: Record<string, string> = {
          easy: "Easy",
          medium: "Medium",
          hard: "Hard"
        };
        if (recipe.difficulty !== difficultyMap[difficulty]) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, searchType, selectedCategories, difficulty]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, difficulty]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) => {
      if (category === "All") {
        return checked ? ["All"] : [];
      }

      const filtered = prev.filter((c) => c !== "All");

      if (checked) {
        return [...filtered, category];
      } else {
        return filtered.filter((c) => c !== category);
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setDifficulty("all");
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Discover Recipes</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={searchType === "name" ? "Search recipes by name..." : "Search by ingredients (e.g., chicken, tomato)..."}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={searchType === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => setSearchType("name")}
            >
              Search by Name
            </Button>
            <Button
              variant={searchType === "ingredient" ? "default" : "outline"}
              size="sm"
              onClick={() => setSearchType("ingredient")}
            >
              Search by Ingredient
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Filters</h2>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <Label className="mb-3 block">Category</Label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center gap-2">
                        <Checkbox
                          id={`cat-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                        />
                        <Label htmlFor={`cat-${category}`} className="text-sm font-normal cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <Label className="mb-3 block">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Mobile Filters */}
        {filtersOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setFiltersOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={() => setFiltersOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <Label className="mb-3 block">Category</Label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center gap-2">
                        <Checkbox
                          id={`cat-mobile-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                        />
                        <Label htmlFor={`cat-mobile-${category}`} className="text-sm font-normal cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <Label className="mb-3 block">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => setFiltersOpen(false)}>Apply</Button>
                  <Button className="flex-1" variant="outline" onClick={clearFilters}>Clear</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">{filteredRecipes.length} recipes found</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRecipes.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-muted-foreground">No recipes found. Try adjusting your filters.</p>
                <Button className="mt-4" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              currentRecipes.map((recipe) => (
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
                      <Badge variant={recipe.difficulty === "Easy" ? "secondary" : recipe.difficulty === "Medium" ? "default" : "destructive"}>
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
            ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}