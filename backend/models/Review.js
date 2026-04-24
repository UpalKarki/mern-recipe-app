const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// One review per user per recipe
ReviewSchema.index({ recipe: 1, user: 1 }, { unique: true });

// After saving a review, recalculate recipe's averageRating + totalReviews
ReviewSchema.post('save', async function () {
  const Recipe = require('./Recipe');
  const stats = await this.constructor.aggregate([
    { $match: { recipe: this.recipe } },
    { $group: { _id: '$recipe', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Recipe.findByIdAndUpdate(this.recipe, {
      averageRating: Math.round(stats[0].avg * 10) / 10,
      totalReviews: stats[0].count,
    });
  }
});

module.exports = mongoose.model('Review', ReviewSchema);