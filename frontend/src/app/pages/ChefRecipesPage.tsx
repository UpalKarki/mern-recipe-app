import { Link } from "react-router";
import { Clock, ChefHat, Star, Bookmark, Eye, Edit, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getCurrentUser } from "../config/demoCredentials";
import { useRecipes } from "../hooks/useRecipes";
import { useMemo } from "react";

export function ChefRecipesPage() {
  const currentUser = getCurrentUser();
  const { recipes: allRecipes } = useRecipes();

  const myRecipes = useMemo(() => {
    if (!currentUser) return [];
    return allRecipes.filter(recipe => recipe.chef === currentUser.name);
  }, [allRecipes, currentUser]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Recipe Gallery</h1>
          <p className="text-muted-foreground">Browse and view your published recipes</p>
        </div>
        <Link to="/chef/add-recipe">
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            Add New Recipe
          </Button>
        </Link>
      </div>

      {myRecipes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No recipes yet</h3>
            <p className="text-muted-foreground mb-6">
              Start sharing your culinary creations with the world!
            </p>
            <Link to="/chef/add-recipe">
              <Button>Add Your First Recipe</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {myRecipes.length} recipe{myRecipes.length !== 1 ? "s" : ""} published
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRecipes.map((recipe) => (
              <Card key={recipe.id} className="h-full hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <Link to={`/chef/recipes/${recipe.id}`}>
                    <ImageWithFallback
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Link to={`/chef/edit-recipe/${recipe.id}`}>
                      <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                        <Edit className="h-4 w-4 text-primary" />
                      </button>
                    </Link>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Link to={`/chef/recipes/${recipe.id}`}>
                    <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors line-clamp-2">
                      {recipe.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                    <ChefHat className="h-4 w-4" />
                    {recipe.category}
                  </p>

                  <div className="flex items-center gap-4 text-sm mb-4">
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

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      {recipe.rating}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Bookmark className="h-4 w-4" />
                      {recipe.bookmarks} saves
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link to={`/chef/recipes/${recipe.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/chef/edit-recipe/${recipe.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
