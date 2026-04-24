const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    ingredients: {
      type: [String],
      required: [true, 'At least one ingredient is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Please provide at least one ingredient',
      },
    },

    instructions: {
      type: [String],
      required: [true, 'At least one instruction step is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Please provide at least one instruction step',
      },
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },

    cookingTime: {
      type: Number,
      required: [true, 'Cooking time is required'],
      min: [1, 'Cooking time must be at least 1 minute'],
    },

    servings: {
      type: Number,
      required: [true, 'Servings is required'],
      min: [1, 'Servings must be at least 1'],
    },

    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },

    image: {
      type: String,
      default: '',
    },

    chef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Chef is required'],
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', RecipeSchema);