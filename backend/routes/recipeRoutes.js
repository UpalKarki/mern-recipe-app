const express = require('express');
const router = express.Router();
const {
  createRecipe, getRecipes, getRecipe,
  updateRecipe, deleteRecipe, getMyRecipes,
} = require('../controllers/recipeController');
const { addReview, getReviews, deleteReview } = require('../controllers/reviewController');
const { toggleBookmark, getMyBookmarks } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// Recipe routes
router.get('/', getRecipes);
router.get('/my', protect, restrictTo('chef'), getMyRecipes);
router.get('/bookmarks', protect, getMyBookmarks);
router.get('/:id', getRecipe);
router.post('/', protect, restrictTo('chef'), createRecipe);
router.put('/:id', protect, restrictTo('chef'), updateRecipe);
router.delete('/:id', protect, restrictTo('chef'), deleteRecipe);

// Review routes (nested under recipe)
router.get('/:id/reviews', getReviews);
router.post('/:id/reviews', protect, addReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

// Bookmark routes
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;