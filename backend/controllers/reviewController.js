const Review = require('../models/Review');
const Recipe = require('../models/Recipe');

// @desc  Add a review (logged-in users only)
exports.addReview = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe.status !== 'approved')
      return res.status(404).json({ success: false, message: 'Recipe not found' });

    const existing = await Review.findOne({ recipe: req.params.id, user: req.user._id });
    if (existing)
      return res.status(400).json({ success: false, message: 'You have already reviewed this recipe' });

    const review = await Review.create({
      recipe: req.params.id,
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Get all reviews for a recipe (public)
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ recipe: req.params.id })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete a review (owner only)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await review.deleteOne();
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};