const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  },
  { timestamps: true }
);

// Prevent duplicate bookmarks
BookmarkSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);