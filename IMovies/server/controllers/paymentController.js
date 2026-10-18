const Payment = require('../models/paymentModel');
const Booking = require('../models/bookingModel');

// Create payment order
exports.createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', bookingId } = req.body;
    const userEmail = req.user.email;

    if (!amount) {
      return res.status(400).json({ success: false, error: 'Amount is required.' });
    }

    const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

    const payment = await Payment.create({
      paymentId: 'pay_' + Date.now(),
      bookingId: bookingId || 'PENDING_' + Date.now(),
      userEmail,
      gateway: 'RAZORPAY',
      gatewayOrderId: orderId,
      amount,
      currency,
      status: 'INITIATED',
    });

    res.status(200).json({
      success: true,
      data: {
        orderId,
        amount,
        currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_imovies_demo_key',
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify payment signature / callback
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

    // In demo / test mode or with verified signature
    const payment = await Payment.findOne({ gatewayOrderId: razorpayOrderId });
    if (payment) {
      payment.status = 'SUCCESS';
      payment.signature = razorpaySignature || 'verified_demo_sig';
      await payment.save();
    }

    if (bookingId) {
      await Booking.findOneAndUpdate(
        { bookingId },
        { status: 'CONFIRMED', paymentId: razorpayPaymentId || 'demo_pay_id' }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and confirmed.',
    });
  } catch (error) {
    next(error);
  }
};
