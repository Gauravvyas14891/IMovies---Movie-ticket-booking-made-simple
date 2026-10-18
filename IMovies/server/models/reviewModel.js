const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    movieId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: 'Anonymous',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
