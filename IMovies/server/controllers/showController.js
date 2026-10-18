const Show = require('../models/showModel');
const Movie = require('../models/movieModel');
const Theatre = require('../models/theatreModel');
const Seat = require('../models/seatModel');

// Get shows for a movie
exports.getMovieShows = async (req, res, next) => {
  try {
    const { movieName } = req.params;
    const shows = await Show.find({
      movieName: { $regex: new RegExp(movieName, 'i') },
    }).sort({ showdate: 1, showtime: 1 });

    res.status(200).json({ success: true, count: shows.length, data: shows });
  } catch (error) {
    next(error);
  }
};

// Get all shows
exports.getAllShows = async (req, res, next) => {
  try {
    const shows = await Show.find().sort({ showdate: 1, showtime: 1 });
    res.status(200).json({ success: true, count: shows.length, data: shows });
  } catch (error) {
    next(error);
  }
};

// Add Show (Admin)
exports.addShow = async (req, res, next) => {
  try {
    const { theatreName, movieName, showdate, showtime } = req.body;

    if (!theatreName || !movieName || !showdate || !showtime) {
      return res.status(400).json({ success: false, error: 'All show fields are required.' });
    }

    const movie = await Movie.findOne({ movieName });
    const theatre = await Theatre.findOne({ theatreName });

    const show = await Show.create({
      adminEmail: req.user.email,
      movieId: movie ? movie.movieId : 'mov_' + Date.now(),
      movieName,
      theatreId: theatre ? theatre.theatreId : 'th_' + Date.now(),
      theatreName,
      showdate,
      showtime,
      tickets: {
        Balcony: theatre ? theatre.balconySeatPrice : 200,
        Middle: theatre ? theatre.middleSeatPrice : 150,
        Lower: theatre ? theatre.lowerSeatPrice : 100,
      },
    });

    // Seed seat inventory for this show
    const seatsToInsert = [];
    const bPrice = theatre ? theatre.balconySeatPrice : 200;
    const mPrice = theatre ? theatre.middleSeatPrice : 150;
    const lPrice = theatre ? theatre.lowerSeatPrice : 100;

    // Balcony (A, B)
    ['A', 'B'].forEach((row) => {
      for (let i = 1; i <= 10; i++) {
        seatsToInsert.push({
          showId: show.showId,
          seatNumber: `${row}${i}`,
          tier: 'Balcony',
          price: bPrice,
          status: 'AVAILABLE',
        });
      }
    });

    // Middle (C, D, E)
    ['C', 'D', 'E'].forEach((row) => {
      for (let i = 1; i <= 10; i++) {
        seatsToInsert.push({
          showId: show.showId,
          seatNumber: `${row}${i}`,
          tier: 'Middle',
          price: mPrice,
          status: 'AVAILABLE',
        });
      }
    });

    // Lower (F, G)
    ['F', 'G'].forEach((row) => {
      for (let i = 1; i <= 10; i++) {
        seatsToInsert.push({
          showId: show.showId,
          seatNumber: `${row}${i}`,
          tier: 'Lower',
          price: lPrice,
          status: 'AVAILABLE',
        });
      }
    });

    await Seat.insertMany(seatsToInsert);

    res.status(201).json({ success: true, message: 'Show scheduled successfully.', data: show });
  } catch (error) {
    next(error);
  }
};

// Delete Show (Admin)
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findOneAndDelete({
      $or: [{ _id: req.params.id }, { showId: req.params.id }],
    });

    if (!show) {
      return res.status(404).json({ success: false, error: 'Show not found.' });
    }

    // Clean up seat inventory
    await Seat.deleteMany({ showId: show.showId });

    res.status(200).json({ success: true, message: 'Show deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
