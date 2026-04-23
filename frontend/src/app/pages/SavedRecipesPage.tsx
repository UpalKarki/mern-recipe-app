import { Link } from "react-router";
import { Clock, ChefHat, Star, Bookmark, BookmarkX } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getSavedRecipes, unsaveRecipe } from "../utils/savedRecipes";

export function SavedRecipesPage() {
  const [savedRecipes, setSavedRecipes] = useState(getSavedRecipes());

  // Refresh saved recipes when component mounts
  useEffect(() => {
    setSavedRecipes(getSavedRecipes());
  }, []);

  const handleRemove = (id: number, title: string) => {
    const success = unsaveRecipe(id);
    if (success) {
      setSavedRecipes(getSavedRecipes());
      toast.success(`Removed "${title}" from saved recipes`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Saved Recipes</h1>
          <p className="text-muted-foreground">
            {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'} saved for later
          </p>
        </div>

        {savedRecipes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No saved recipes yet</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring and save your favorite recipes for quick access!
              </p>
              <Link to="/recipes">
                <Button>Browse Recipes</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedRecipes.map((recipe) => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3">{recipe.category}</Badge>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(recipe.id, recipe.title);
                      }}
                    >
                      <BookmarkX className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">by {recipe.chef}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-medium">{recipe.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      <ChefHat className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">
                        {recipe.difficulty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
