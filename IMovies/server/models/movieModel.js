const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    movieId: {
      type: String,
      unique: true,
      default: () => 'mov_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    },
    movieName: {
      type: String,
      required: [true, 'Movie name is required'],
      trim: true,
      minlength: [2, 'Movie name must be at least 2 characters'],
      maxlength: [200, 'Movie name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    genres: {
      type: [String],
      required: [true, 'At least one genre is required'],
      validate: [(arr) => arr.length > 0, 'Must have at least one genre'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    runtime: {
      type: Number,
      default: 120, // in minutes
    },
    certification: {
      type: String,
      default: 'UA',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    posterUrl: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'Hindi',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
