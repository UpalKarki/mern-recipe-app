import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
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
import { useState } from "react";
import { toast } from "sonner";

const initialCategories = [
  { id: 1, name: "Italian", recipeCount: 120, icon: "🍝" },
  { id: 2, name: "Asian", recipeCount: 95, icon: "🍜" },
  { id: 3, name: "Mexican", recipeCount: 78, icon: "🌮" },
  { id: 4, name: "Desserts", recipeCount: 110, icon: "🍰" },
  { id: 5, name: "Vegetarian", recipeCount: 86, icon: "🥗" },
  { id: 6, name: "Seafood", recipeCount: 64, icon: "🦐" },
  { id: 7, name: "Meat", recipeCount: 73, icon: "🥩" },
];

export function ManageCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string; icon: string } | null>(null);

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.icon) {
      const category = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name: newCategory.name,
        icon: newCategory.icon,
        recipeCount: 0,
      };
      setCategories([...categories, category]);
      setNewCategory({ name: "", icon: "" });
      setIsAddDialogOpen(false);
      toast.success(`Category "${category.name}" has been added!`);
    }
  };

  const handleEditCategory = () => {
    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: editingCategory.name, icon: editingCategory.icon }
          : cat
      ));
      setEditingCategory(null);
      toast.success("Category has been updated!");
    }
  };

  const handleDeleteCategory = (id: number, name: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast.success(`Category "${name}" has been deleted!`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Categories</h1>
          <p className="text-muted-foreground">Add, edit, or remove recipe categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category for recipes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Mediterranean"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-icon">Icon (Emoji)</Label>
                <Input
                  id="category-icon"
                  placeholder="e.g., 🥙"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Recipe Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="text-2xl">{category.icon}</TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{category.recipeCount} recipes</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog
                          open={editingCategory?.id === category.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setEditingCategory({ id: category.id, name: category.name, icon: category.icon });
                            } else {
                              setEditingCategory(null);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                              <DialogDescription>
                                Update the category details
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-category-name">Category Name</Label>
                                <Input
                                  id="edit-category-name"
                                  value={editingCategory?.name || ""}
                                  onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, name: e.target.value } : null)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-category-icon">Icon (Emoji)</Label>
                                <Input
                                  id="edit-category-icon"
                                  value={editingCategory?.icon || ""}
                                  onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, icon: e.target.value } : null)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditCategory}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Delete">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the "{category.name}" category? 
                                This will affect {category.recipeCount} recipes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDeleteCategory(category.id, category.name)}
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
        </CardContent>
      </Card>
    </div>
  );
}
