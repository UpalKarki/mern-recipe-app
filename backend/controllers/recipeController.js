const Recipe = require('../models/Recipe');

// @desc  Create a new recipe (chef only)
exports.createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create({ ...req.body, chef: req.user._id });
    res.status(201).json({ success: true, recipe });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Get all approved recipes (public)
exports.getRecipes = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const filter = { status: 'approved' };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const recipes = await Recipe.find(filter)
      .populate('chef', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: recipes.length, recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single recipe by ID (public)
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('chef', 'name profileImage bio');
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.status(200).json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update a recipe (chef who owns it only)
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    if (recipe.chef.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized to edit this recipe' });

    // Reset to pending when chef edits so admin re-approves
    req.body.status = 'pending';
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, recipe: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Delete a recipe (chef who owns it only)
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    if (recipe.chef.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized to delete this recipe' });

    await recipe.deleteOne();
    res.status(200).json({ success: true, message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all recipes by the logged-in chef
exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ chef: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: recipes.length, recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};