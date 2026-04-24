const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Review = require('../models/Review');

// ── USERS ──────────────────────────────────────────

// @desc  Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Toggle user active/suspended
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin')
      return res.status(400).json({ success: false, message: 'Cannot suspend an admin' });

    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'suspended'}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin')
      return res.status(400).json({ success: false, message: 'Cannot delete an admin' });

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── RECIPES ────────────────────────────────────────

// @desc  Get all recipes regardless of status (for admin review)
exports.getAllRecipes = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const recipes = await Recipe.find(filter)
      .populate('chef', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: recipes.length, recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Approve or reject a recipe
exports.updateRecipeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status))
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('chef', 'name email');

    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.status(200).json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Admin delete any recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    await recipe.deleteOne();
    res.status(200).json({ success: true, message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DASHBOARD STATS ────────────────────────────────

// @desc  Get counts for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalChefs, totalRecipes, pendingRecipes, totalReviews] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'chef' }),
      Recipe.countDocuments({ status: 'approved' }),
      Recipe.countDocuments({ status: 'pending' }),
      Review.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: { totalUsers, totalChefs, totalRecipes, pendingRecipes, totalReviews },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};