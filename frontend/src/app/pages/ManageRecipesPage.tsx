import { Link } from "react-router";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { useRecipes } from "../hooks/useRecipes";
import { getCurrentUser } from "../config/demoCredentials";
import { deleteRecipe } from "../utils/recipesData";
import { toast } from "sonner";
import { useMemo } from "react";

export function ManageRecipesPage() {
  const currentUser = getCurrentUser();
  const { recipes: allRecipes, refreshRecipes } = useRecipes();

  const myRecipes = useMemo(() => {
    if (!currentUser) return [];
    return allRecipes.filter(recipe => recipe.chef === currentUser.name);
  }, [allRecipes, currentUser]);

  const handleDelete = (recipeId: number, recipeTitle: string) => {
    const success = deleteRecipe(recipeId);
    if (success) {
      toast.success(`"${recipeTitle}" has been deleted`);
      refreshRecipes();
    } else {
      toast.error("Failed to delete recipe");
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Recipes</h1>
          <p className="text-muted-foreground">Manage and edit your published recipes</p>
        </div>
        <Link to="/chef/add-recipe">
          <Button>Add New Recipe</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Recipes ({myRecipes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {myRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't added any recipes yet.
              </p>
              <Link to="/chef/add-recipe">
                <Button>Add Your First Recipe</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipe</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Saves</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRecipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell className="font-medium">{recipe.title}</TableCell>
                      <TableCell>{recipe.category}</TableCell>
                      <TableCell className="text-center">{recipe.bookmarks}</TableCell>
                      <TableCell className="text-center">{recipe.rating}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/recipes/${recipe.id}`}>
                            <Button variant="ghost" size="icon" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/chef/edit-recipe/${recipe.id}`}>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Delete">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(recipe.id, recipe.title)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
