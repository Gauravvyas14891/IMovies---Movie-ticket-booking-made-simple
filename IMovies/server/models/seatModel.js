const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    showId: {
      type: String,
      required: true,
      index: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    tier: {
      type: String,
      enum: ['Balcony', 'Middle', 'Lower'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'LOCKED', 'BOOKED'],
      default: 'AVAILABLE',
      index: true,
    },
    lockedBy: {
      type: String, // userEmail
      default: null,
    },
    lockExpiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    bookingId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index to guarantee uniqueness of seat number per show
seatSchema.index({ showId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);
