const Booking = require('../models/bookingModel');
const Seat = require('../models/seatModel');
const Show = require('../models/showModel');
const Movie = require('../models/movieModel');
const { sendBookingConfirmation, sendCancellationNotice } = require('../utils/mailer');

// Create Booking
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seatNumbers, tier } = req.body;
    const userEmail = req.user.email;

    if (!showId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ success: false, error: 'Show and seats are required.' });
    }

    const show = await Show.findOne({ showId });
    if (!show) {
      return res.status(404).json({ success: false, error: 'Show not found.' });
    }

    const movie = await Movie.findOne({ movieName: show.movieName });
    const now = new Date();

    // Verify seats are locked by this user and not expired
    const lockedSeats = await Seat.find({
      showId,
      seatNumber: { $in: seatNumbers },
      lockedBy: userEmail,
      status: 'LOCKED',
      lockExpiresAt: { $gt: now },
    });

    if (lockedSeats.length !== seatNumbers.length) {
      return res.status(409).json({
        success: false,
        error: 'Seat locks expired or not held by user. Please select seats again.',
      });
    }

    const totalPrice = lockedSeats.reduce((sum, s) => sum + s.price, 0);
    const bookingId = 'BK_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5).toUpperCase();

    const booking = await Booking.create({
      bookingId,
      userEmail,
      showId,
      movieName: show.movieName,
      theatreName: show.theatreName,
      showdate: show.showdate,
      showtime: show.showtime,
      posterUrl: movie ? movie.posterUrl : '',
      tier: tier || lockedSeats[0].tier,
      seats: seatNumbers,
      totalPrice,
      ticketsData: {
        seats: seatNumbers,
        pricePerSeat: lockedSeats[0].price,
        tier: tier || lockedSeats[0].tier,
        bookedAt: new Date().toISOString(),
      },
      status: 'CONFIRMED', // Immediately confirmed or upon payment verify
      paymentId: 'PAY_' + Date.now(),
      qrCode: `IMOVE:${bookingId}:${showId}:${seatNumbers.join(',')}`,
    });

    // Mark seats as BOOKED permanently
    await Seat.updateMany(
      {
        showId,
        seatNumber: { $in: seatNumbers },
      },
      {
        $set: {
          status: 'BOOKED',
          lockedBy: null,
          lockExpiresAt: null,
          bookingId,
        },
      }
    );

    // Send confirmation receipt
    await sendBookingConfirmation({
      to: userEmail,
      bookingId,
      movieName: show.movieName,
      theatreName: show.theatreName,
      showDate: show.showdate,
      showTime: show.showtime,
      seats: seatNumbers,
      totalAmount: totalPrice,
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get User's Bookings (matches screenshot "Your Bookings")
exports.getMyBookings = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const bookings = await Booking.find({ userEmail }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Bookings (Admin view matches screenshot "All Bookings")
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userEmail = req.user.email;

    const query = req.user.role === 'ADMIN' ? { bookingId } : { bookingId, userEmail };
    const booking = await Booking.findOne(query);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ success: false, error: 'Booking is already cancelled.' });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    // Release seats back to AVAILABLE
    await Seat.updateMany(
      { showId: booking.showId, seatNumber: { $in: booking.seats } },
      {
        $set: {
          status: 'AVAILABLE',
          lockedBy: null,
          lockExpiresAt: null,
          bookingId: null,
        },
      }
    );

    await sendCancellationNotice({
      to: booking.userEmail,
      bookingId: booking.bookingId,
      refundAmount: booking.totalPrice,
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled and seats released successfully.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
