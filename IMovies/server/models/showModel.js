const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    showId: {
      type: String,
      unique: true,
      default: () => 'sh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    },
    adminEmail: {
      type: String,
      required: [true, 'Admin email is required'],
    },
    movieId: {
      type: String,
      required: [true, 'Movie ID is required'],
    },
    movieName: {
      type: String,
      default: '',
    },
    theatreId: {
      type: String,
      default: '',
    },
    theatreName: {
      type: String,
      required: [true, 'Theatre name is required'],
    },
    showdate: {
      type: String,
      required: [true, 'Show date is required'],
    },
    showtime: {
      type: String,
      required: [true, 'Show time is required'],
    },
    tickets: {
      type: Object,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Show', showSchema);
