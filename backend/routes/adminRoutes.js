const express = require('express');
const router = express.Router();
const {
  getAllUsers, toggleUserStatus, deleteUser,
  getAllRecipes, updateRecipeStatus, deleteRecipe,
  getStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// All admin routes are protected + admin only
router.use(protect, restrictTo('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/recipes', getAllRecipes);
router.put('/recipes/:id/status', updateRecipeStatus);
router.delete('/recipes/:id', deleteRecipe);

module.exports = router;