import { Search, Clock, Star } from "lucide-react";
import { Link } from "react-router";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useEffect, useState } from "react";
import { apiGetRecipes } from "../config/api";
import { toast } from "sonner";

interface Recipe {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  cookingTime: number;
  averageRating: number;
  totalReviews: number;
  image: string;
  chef: { name: string };
}

export function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await apiGetRecipes({
        search: search || undefined,
        category: category || undefined,
        difficulty: difficulty || undefined,
      });
      if (res.success) setRecipes(res.recipes);
      else toast.error(res.message);
    } catch { toast.error("Could not connect to server"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecipes(); }, [category, difficulty]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">All Recipes</h1>
        <p className="text-muted-foreground">Discover delicious recipes from our chefs</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search recipes..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={category || "all"} onValueChange={(val) => setCategory(val === "all" ? "" : val)}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Italian">Italian</SelectItem>
            <SelectItem value="Asian">Asian</SelectItem>
            <SelectItem value="Mexican">Mexican</SelectItem>
            <SelectItem value="Desserts">Desserts</SelectItem>
            <SelectItem value="Vegetarian">Vegetarian</SelectItem>
            <SelectItem value="Seafood">Seafood</SelectItem>
            <SelectItem value="Meat">Meat</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficulty || "all"} onValueChange={(val) => setDifficulty(val === "all" ? "" : val)}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Difficulty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">Search</Button>
      </form>

      {loading ? (
        <p className="text-muted-foreground">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No recipes found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link key={recipe._id} to={`/recipes/${recipe._id}`}>
              <Card className="hover:shadow-lg transition-shadow h-full">
                <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold line-clamp-1">{recipe.title}</h3>
                    <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">{recipe.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{recipe.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{recipe.cookingTime} mins</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3" />{recipe.averageRating} ({recipe.totalReviews})</span>
                    <span>{recipe.chef?.name}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}