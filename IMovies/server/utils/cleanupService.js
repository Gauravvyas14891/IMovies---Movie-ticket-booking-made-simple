const Booking = require('../models/bookingModel');
const Seat = require('../models/seatModel');

/**
 * Background task to sweep expired temporary seat locks and transition stale bookings
 */
const cleanupExpiredLocks = async () => {
  try {
    const now = new Date();

    // 1. Release expired seat locks
    const releasedSeats = await Seat.updateMany(
      {
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

    if (releasedSeats.modifiedCount > 0) {
      console.log(`[Cleanup Service] Released ${releasedSeats.modifiedCount} expired seat locks.`);
    }

    // 2. Mark pending bookings as expired if created more than 10 minutes ago
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const expiredBookings = await Booking.updateMany(
      {
        status: 'PENDING',
        createdAt: { $lt: tenMinutesAgo },
      },
      {
        $set: {
          status: 'EXPIRED',
        },
      }
    );

    if (expiredBookings.modifiedCount > 0) {
      console.log(`[Cleanup Service] Marked ${expiredBookings.modifiedCount} abandoned bookings as EXPIRED.`);
    }
  } catch (error) {
    console.error('[Cleanup Service Error]:', error.message);
  }
};

const startCleanupTask = () => {
  // Sweep every 60 seconds
  setInterval(cleanupExpiredLocks, 60 * 1000);
  console.log('[Cleanup Service] Background expired lock sweeper initialized (Interval: 60s).');
};

module.exports = {
  cleanupExpiredLocks,
  startCleanupTask,
};
