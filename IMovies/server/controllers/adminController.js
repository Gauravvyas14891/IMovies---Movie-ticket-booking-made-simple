const Movie = require('../models/movieModel');
const Theatre = require('../models/theatreModel');
const Show = require('../models/showModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

// Admin Dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalTheatres = await Theatre.countDocuments();
    const totalShows = await Show.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();

    const bookings = await Booking.find({ status: 'CONFIRMED' });
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalMovies,
        totalTheatres,
        totalShows,
        totalBookings,
        totalUsers,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};
