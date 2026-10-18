const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    movieName: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ userEmail: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
