const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');
const fetchUser = require('../middlewares/fetchUser');

router.get('/:showId', seatController.getShowSeats);
router.post('/lock/:showId', fetchUser, seatController.lockSeats);
router.post('/release/:showId', fetchUser, seatController.releaseSeats);

module.exports = router;
