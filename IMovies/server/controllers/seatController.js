const Seat = require('../models/seatModel');
const Show = require('../models/showModel');

// Get seat map for a specific show
exports.getShowSeats = async (req, res, next) => {
  try {
    const { showId } = req.params;
    const now = new Date();

    // Release any expired locks first
    await Seat.updateMany(
      {
        showId,
        status: 'LOCKED',
        lockExpiresAt: { $lt: now },
      },
      {
        $set: {
          status: 'AVAILABLE',
          lockedBy: null,
          lockExpiresAt: null,
        },
      }
    );

    let seats = await Seat.find({ showId }).sort({ seatNumber: 1 });

    // If seats don't exist yet for this show, dynamically generate them based on show tickets
    if (seats.length === 0) {
      const show = await Show.findOne({ showId });
      const bPrice = (show && show.tickets && show.tickets.Balcony) || 200;
      const mPrice = (show && show.tickets && show.tickets.Middle) || 150;
      const lPrice = (show && show.tickets && show.tickets.Lower) || 100;

      const generated = [];
      ['A', 'B'].forEach((r) => {
        for (let i = 1; i <= 10; i++) {
          generated.push({ showId, seatNumber: `${r}${i}`, tier: 'Balcony', price: bPrice, status: 'AVAILABLE' });
        }
      });
      ['C', 'D', 'E'].forEach((r) => {
        for (let i = 1; i <= 10; i++) {
          generated.push({ showId, seatNumber: `${r}${i}`, tier: 'Middle', price: mPrice, status: 'AVAILABLE' });
        }
      });
      ['F', 'G'].forEach((r) => {
        for (let i = 1; i <= 10; i++) {
          generated.push({ showId, seatNumber: `${r}${i}`, tier: 'Lower', price: lPrice, status: 'AVAILABLE' });
        }
      });

      seats = await Seat.insertMany(generated);
    }

    res.status(200).json({ success: true, count: seats.length, data: seats });
  } catch (error) {
    next(error);
  }
};

// Atomically lock seats for 10 minutes
exports.lockSeats = async (req, res, next) => {
  try {
    const { showId } = req.params;
    const { seatNumbers } = req.body; // e.g. ["B1", "B2"]
    const userEmail = req.user.email;

    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ success: false, error: 'Please specify seat numbers to lock.' });
    }

    const now = new Date();
    const lockExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes TTL

    // Find all target seats
    const targetSeats = await Seat.find({
      showId,
      seatNumber: { $in: seatNumbers },
    });

    if (targetSeats.length !== seatNumbers.length) {
      return res.status(404).json({ success: false, error: 'One or more requested seats do not exist.' });
    }

    // Verify all seats are either AVAILABLE or currently held by this same user or lock expired
    const unavailableSeats = targetSeats.filter((s) => {
      if (s.status === 'BOOKED') return true;
      if (s.status === 'LOCKED' && s.lockExpiresAt > now && s.lockedBy !== userEmail) return true;
      return false;
    });

    if (unavailableSeats.length > 0) {
      return res.status(409).json({
        success: false,
        error: `Seats already locked or booked: ${unavailableSeats.map((s) => s.seatNumber).join(', ')}`,
      });
    }

    // Atomically lock all requested seats
    await Seat.updateMany(
      {
        showId,
        seatNumber: { $in: seatNumbers },
      },
      {
        $set: {
          status: 'LOCKED',
          lockedBy: userEmail,
          lockExpiresAt,
        },
      }
    );

    const lockedSeats = await Seat.find({ showId, seatNumber: { $in: seatNumbers } });
    const totalPrice = lockedSeats.reduce((acc, curr) => acc + curr.price, 0);

    res.status(200).json({
      success: true,
      message: 'Seats locked successfully for 10 minutes.',
      data: {
        showId,
        seats: seatNumbers,
        lockedBy: userEmail,
        lockExpiresAt,
        totalPrice,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Release locked seats
exports.releaseSeats = async (req, res, next) => {
  try {
    const { showId } = req.params;
    const { seatNumbers } = req.body;
    const userEmail = req.user.email;

    await Seat.updateMany(
      {
        showId,
        seatNumber: { $in: seatNumbers },
        lockedBy: userEmail,
        status: 'LOCKED',
      },
      {
        $set: {
          status: 'AVAILABLE',
          lockedBy: null,
          lockExpiresAt: null,
        },
      }
    );

    res.status(200).json({ success: true, message: 'Seats released.' });
  } catch (error) {
    next(error);
  }
};
