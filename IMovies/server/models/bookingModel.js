const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    showId: {
      type: String,
      required: true,
    },
    movieName: {
      type: String,
      required: true,
    },
    theatreName: {
      type: String,
      required: true,
    },
    showdate: {
      type: String,
      required: true,
    },
    showtime: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
      default: '',
    },
    tier: {
      type: String,
      default: 'Middle',
    },
    seats: {
      type: [String],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    ticketsData: {
      type: Object,
      required: true, // Fixed typo from 'requires: true'
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED'],
      default: 'PENDING',
    },
    paymentId: {
      type: String,
      default: null,
    },
    qrCode: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
