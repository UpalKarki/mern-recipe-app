import { Plus, X, Image } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getCurrentUser } from "../config/demoCredentials";
import { addRecipe, getRecipeById, updateRecipe } from "../utils/recipesData";
import { toast } from "sonner";

export function AddRecipePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = getCurrentUser();
  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [servings, setServings] = useState("");
  const [instructions, setInstructions] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [ingredients, setIngredients] = useState([{ amount: "", name: "" }]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load recipe data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const recipe = getRecipeById(Number(id));
      if (recipe) {
        // Check if current user is the chef of this recipe
        if (currentUser && recipe.chef !== currentUser.name) {
          toast.error("You can only edit your own recipes");
          navigate("/chef/manage-recipes");
          return;
        }

        setTitle(recipe.title);
        setDescription(recipe.description || "");
        setCategory(recipe.category.toLowerCase());
        setTime(recipe.time.replace(" min", ""));
        setDifficulty(recipe.difficulty.toLowerCase());
        setImagePreview(recipe.image);
      } else {
        toast.error("Recipe not found");
        navigate("/chef/manage-recipes");
      }
    }
  }, [isEditMode, id, currentUser, navigate]);

  const addIngredient = () => {
    setIngredients([...ingredients, { amount: "", name: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("You must be logged in to save a recipe");
      return;
    }

    if (!title || !description || !category || !time || !difficulty) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isEditMode && id) {
      // Update existing recipe
      const success = updateRecipe(Number(id), {
        title,
        description,
        time: `${time} min`,
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        category: category.charAt(0).toUpperCase() + category.slice(1),
        image: imagePreview || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
      });

      if (success) {
        toast.success("Recipe updated successfully!");
        navigate("/chef/manage-recipes");
      } else {
        toast.error("Failed to update recipe");
      }
    } else {
      // Add new recipe
      const newRecipe = addRecipe({
        title,
        description,
        chef: currentUser.name,
        time: `${time} min`,
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        category: category.charAt(0).toUpperCase() + category.slice(1),
        rating: 0,
        bookmarks: 0,
        image: imagePreview || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
      });

      toast.success("Recipe published successfully!");
      navigate("/chef/manage-recipes");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{isEditMode ? "Edit Recipe" : "Add New Recipe"}</h1>
        <p className="text-muted-foreground">
          {isEditMode ? "Update your recipe details" : "Share your culinary creation with the world!"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Recipe Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Classic Homemade Pizza"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your recipe..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="asian">Asian</SelectItem>
                    <SelectItem value="mexican">Mexican</SelectItem>
                    <SelectItem value="desserts">Desserts</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="seafood">Seafood</SelectItem>
                    <SelectItem value="meat">Meat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Cooking Time *</Label>
                <Input
                  id="time"
                  type="number"
                  placeholder="Minutes"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select value={difficulty} onValueChange={setDifficulty} required>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="servings">Servings *</Label>
              <Input
                id="servings"
                type="number"
                placeholder="Number of servings"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Amount (e.g., 2 cups)"
                    value={ingredient.amount}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].amount = e.target.value;
                      setIngredients(newIngredients);
                    }}
                  />
                </div>
                <div className="flex-[2]">
                  <Input
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].name = e.target.value;
                      setIngredients(newIngredients);
                    }}
                  />
                </div>
                {ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addIngredient}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Step 1: Preheat the oven...&#10;Step 2: Mix the ingredients...&#10;Step 3: ..."
              rows={12}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground mt-2">
              Write each step on a new line for better readability.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recipe Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors"
                >
                  <Image className="h-12 w-12 text-muted-foreground mb-4" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload recipe image
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 5MB
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nutrition Information (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="kcal"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein</Label>
                <Input
                  id="protein"
                  placeholder="e.g., 12g"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs</Label>
                <Input
                  id="carbs"
                  placeholder="e.g., 36g"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat</Label>
                <Input
                  id="fat"
                  placeholder="e.g., 10g"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            {isEditMode ? "Update Recipe" : "Publish Recipe"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/chef/manage-recipes")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
