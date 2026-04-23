import { Check, X, Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

const initialRecipes = [
  {
    id: 1,
    title: "Fresh Garden Salad Bowl",
    chef: "Sarah Green",
    category: "Vegetarian",
    submittedDate: "2025-02-28",
    status: "pending" as const,
  },
  {
    id: 2,
    title: "Spicy Thai Curry",
    chef: "Yuki Tanaka",
    category: "Asian",
    submittedDate: "2025-02-27",
    status: "pending" as const,
  },
  {
    id: 3,
    title: "Homemade Ravioli",
    chef: "Giovanni Russo",
    category: "Italian",
    submittedDate: "2025-02-26",
    status: "pending" as const,
  },
  {
    id: 4,
    title: "Moroccan Tagine",
    chef: "Ahmed Hassan",
    category: "Mediterranean",
    submittedDate: "2025-02-25",
    status: "pending" as const,
  },
  {
    id: 5,
    title: "Strawberry Cheesecake",
    chef: "Emily Baker",
    category: "Desserts",
    submittedDate: "2025-02-24",
    status: "pending" as const,
  },
];

export function ApproveRecipesPage() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<{ id: number; title: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = (id: number, title: string) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === id ? { ...recipe, status: "approved" as const } : recipe
    ));
    toast.success(`"${title}" has been approved!`, {
      description: "The recipe is now visible to all users.",
    });
  };

  const openRejectDialog = (id: number, title: string) => {
    setSelectedRecipe({ id, title });
    setRejectDialogOpen(true);
    setRejectionReason("");
  };

  const handleReject = () => {
    if (!selectedRecipe) return;
    
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setRecipes(recipes.map(recipe => 
      recipe.id === selectedRecipe.id ? { ...recipe, status: "rejected" as const } : recipe
    ));
    
    toast.error(`"${selectedRecipe.title}" has been rejected.`, {
      description: `Chef will be notified: ${rejectionReason}`,
    });
    
    setRejectDialogOpen(false);
    setSelectedRecipe(null);
    setRejectionReason("");
  };

  const pendingRecipes = recipes.filter(r => r.status === "pending");
  const processedRecipes = recipes.filter(r => r.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Approve Recipes</h1>
        <p className="text-muted-foreground">Review and approve recipes submitted by chefs</p>
      </div>

      {/* Pending Recipes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Approval ({pendingRecipes.length})</CardTitle>
            {pendingRecipes.length > 0 && (
              <Badge variant="destructive">{pendingRecipes.length} pending</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {pendingRecipes.length === 0 ? (
            <div className="text-center py-12">
              <Check className="h-12 w-12 mx-auto text-primary mb-4" />
              <p className="text-lg font-medium mb-2">All caught up!</p>
              <p className="text-sm text-muted-foreground">No pending recipes to review</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipe</TableHead>
                    <TableHead>Chef</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRecipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell className="font-medium">{recipe.title}</TableCell>
                      <TableCell>{recipe.chef}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{recipe.category}</Badge>
                      </TableCell>
                      <TableCell>{new Date(recipe.submittedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(recipe.id, recipe.title)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openRejectDialog(recipe.id, recipe.title)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
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

      {/* Recently Processed */}
      {processedRecipes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipe</TableHead>
                    <TableHead>Chef</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedRecipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell className="font-medium">{recipe.title}</TableCell>
                      <TableCell>{recipe.chef}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{recipe.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={recipe.status === "approved" ? "default" : "destructive"}
                        >
                          {recipe.status === "approved" ? "Approved" : "Rejected"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(recipe.submittedDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Recipe</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting &quot;{selectedRecipe?.title}&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejectionReason">Reason for Rejection *</Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}