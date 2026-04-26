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
import { useEffect, useState } from "react";
import { apiGetMyRecipes, apiDeleteRecipe } from "../config/api";
import { toast } from "sonner";

export function ManageRecipesPage() {
  // ── REAL API STATE ─────────────────────────────────────────────────────────
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      const res = await apiGetMyRecipes();
      if (res.success) setRecipes(res.recipes);
    } catch {
      toast.error("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipes(); }, []);

  const handleDelete = async (id: string, title: string) => {
    try {
      const res = await apiDeleteRecipe(id);
      if (res.success) {
        toast.success(`"${title}" has been deleted`);
        fetchRecipes();
      } else {
        toast.error(res.message || "Failed to delete recipe");
      }
    } catch {
      toast.error("Failed to delete recipe");
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  return (
    // IDENTICAL JSX to the original — only data source changed
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
          <CardTitle>All Recipes ({loading ? "..." : recipes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading recipes...</p>
            </div>
          ) : recipes.length === 0 ? (
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
                    {/* Status column added — useful with real data */}
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipes.map((recipe) => (
                    <TableRow key={recipe._id}>
                      <TableCell className="font-medium">{recipe.title}</TableCell>
                      <TableCell>{recipe.category}</TableCell>
                      <TableCell>
                        {/* Status badge — shows pending/approved/rejected */}
                        <Badge
                          variant={
                            recipe.status === "approved" ? "default"
                            : recipe.status === "rejected" ? "destructive"
                            : "secondary"
                          }
                          className="capitalize"
                        >
                          {recipe.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        ⭐ {recipe.averageRating} ({recipe.totalReviews})
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View — goes to chef recipe detail */}
                          <Link to={`/chef/recipes/${recipe._id}`}>
                            <Button variant="ghost" size="icon" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {/* Edit */}
                          <Link to={`/chef/edit-recipe/${recipe._id}`}>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {/* Delete with confirmation dialog */}
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
                                  onClick={() => handleDelete(recipe._id, recipe.title)}
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