const Bookmark = require('../models/Bookmark');
const Recipe = require('../models/Recipe');

// @desc  Toggle bookmark (add if not exists, remove if exists)
exports.toggleBookmark = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe.status !== 'approved')
      return res.status(404).json({ success: false, message: 'Recipe not found' });

    const existing = await Bookmark.findOne({ user: req.user._id, recipe: req.params.id });
    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ success: true, bookmarked: false, message: 'Bookmark removed' });
    }

    await Bookmark.create({ user: req.user._id, recipe: req.params.id });
    res.status(201).json({ success: true, bookmarked: true, message: 'Bookmark added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all bookmarks for logged-in user
exports.getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({ path: 'recipe', populate: { path: 'chef', select: 'name profileImage' } })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookmarks.length, bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};