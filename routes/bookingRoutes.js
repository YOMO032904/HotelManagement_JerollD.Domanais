const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  checkIn,
  checkOut
} = require('../controllers/bookingController');

router.get('/bookings', getBookings);
router.get('/bookings/:id', getBookingById);
router.post('/bookings', createBooking);
router.put('/bookings/:id', updateBooking);
router.delete('/bookings/:id', deleteBooking);
router.patch('/bookings/:id/checkin', checkIn);
router.patch('/bookings/:id/checkout', checkOut);

module.exports = router;