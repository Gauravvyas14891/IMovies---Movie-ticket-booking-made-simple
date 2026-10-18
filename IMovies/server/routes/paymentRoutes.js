const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const fetchUser = require('../middlewares/fetchUser');

router.post('/create-order', fetchUser, paymentController.createOrder);
router.post('/verify', fetchUser, paymentController.verifyPayment);

module.exports = router;
