/**
 * Transactional email dispatcher for booking confirmations, reminders, and cancellations
 */
const sendBookingConfirmation = async ({ to, bookingId, movieName, theatreName, showDate, showTime, seats, totalAmount }) => {
  console.log(`[Notification Service] Sending booking confirmation receipt to ${to}`);
  console.log(`[Notification Details] Booking: ${bookingId} | Movie: ${movieName} | Venue: ${theatreName} | Seats: ${seats.join(', ')} | Total: ₹${totalAmount}`);
  return { success: true, messageId: `msg_${Date.now()}` };
};

const sendCancellationNotice = async ({ to, bookingId, refundAmount }) => {
  console.log(`[Notification Service] Sending cancellation alert to ${to} for booking ${bookingId}. Refund: ₹${refundAmount}`);
  return { success: true };
};

module.exports = {
  sendBookingConfirmation,
  sendCancellationNotice,
};
