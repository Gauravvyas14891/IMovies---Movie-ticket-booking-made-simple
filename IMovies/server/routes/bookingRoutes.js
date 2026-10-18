const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const fetchUser = require('../middlewares/fetchUser');
const checkAdmin = require('../middlewares/checkAdmin');

router.post('/', fetchUser, bookingController.createBooking);
router.get('/my-bookings', fetchUser, bookingController.getMyBookings);
router.get('/all-bookings', fetchUser, checkAdmin, bookingController.getAllBookings);
router.post('/cancel/:bookingId', fetchUser, bookingController.cancelBooking);

module.exports = router;
