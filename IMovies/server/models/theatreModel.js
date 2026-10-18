const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
  {
    theatreId: {
      type: String,
      unique: true,
      default: () => 'th_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    },
    theatreName: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Theatre location is required'],
      trim: true,
    },
    balconySeatPrice: {
      type: Number,
      required: [true, 'Balcony seat price is required'],
      min: [0, 'Price must be non-negative'],
    },
    balconySeatCount: {
      type: Number,
      default: 40,
      min: [0, 'Seat count must be non-negative'],
    },
    middleSeatPrice: {
      type: Number,
      required: [true, 'Middle seat price is required'],
      min: [0, 'Price must be non-negative'],
    },
    middleSeatCount: {
      type: Number,
      default: 60,
      min: [0, 'Seat count must be non-negative'],
    },
    lowerSeatPrice: {
      type: Number,
      required: [true, 'Lower seat price is required'],
      min: [0, 'Price must be non-negative'],
    },
    lowerSeatCount: {
      type: Number,
      default: 50,
      min: [0, 'Seat count must be non-negative'],
    },
    balconySeats: {
      type: Object,
      default: () => ({ rows: 4, cols: 10 }),
    },
    middleSeats: {
      type: Object,
      default: () => ({ rows: 6, cols: 10 }),
    },
    lowerSeats: {
      type: Object,
      default: () => ({ rows: 5, cols: 10 }),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Theatre', theatreSchema);
