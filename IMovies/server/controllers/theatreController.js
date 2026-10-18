const Theatre = require('../models/theatreModel');

// Get all theatres
exports.getAllTheatres = async (req, res, next) => {
  try {
    const theatres = await Theatre.find().sort({ theatreName: 1 });
    res.status(200).json({ success: true, count: theatres.length, data: theatres });
  } catch (error) {
    next(error);
  }
};

// Add Theatre (Admin)
exports.addTheatre = async (req, res, next) => {
  try {
    const {
      theatreName,
      location,
      balconySeatPrice,
      balconySeatCount,
      middleSeatPrice,
      middleSeatCount,
      lowerSeatPrice,
      lowerSeatCount,
    } = req.body;

    if (!theatreName || !location) {
      return res.status(400).json({ success: false, error: 'Theatre name and location are required.' });
    }

    const theatre = await Theatre.create({
      theatreName,
      location,
      balconySeatPrice: Number(balconySeatPrice) || 0,
      balconySeatCount: Number(balconySeatCount) || 40,
      middleSeatPrice: Number(middleSeatPrice) || 0,
      middleSeatCount: Number(middleSeatCount) || 60,
      lowerSeatPrice: Number(lowerSeatPrice) || 0,
      lowerSeatCount: Number(lowerSeatCount) || 50,
      balconySeats: { rows: 4, cols: Math.ceil((Number(balconySeatCount) || 40) / 4) },
      middleSeats: { rows: 6, cols: Math.ceil((Number(middleSeatCount) || 60) / 6) },
      lowerSeats: { rows: 5, cols: Math.ceil((Number(lowerSeatCount) || 50) / 5) },
    });

    res.status(201).json({ success: true, message: 'Theatre added successfully.', data: theatre });
  } catch (error) {
    next(error);
  }
};

// Delete Theatre (Admin)
exports.deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findOneAndDelete({
      $or: [{ _id: req.params.id }, { theatreId: req.params.id }],
    });

    if (!theatre) {
      return res.status(404).json({ success: false, error: 'Theatre not found.' });
    }

    res.status(200).json({ success: true, message: 'Theatre deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
