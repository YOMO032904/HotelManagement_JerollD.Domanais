// routes/bookingRoutes.js

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

// **FIXED:** Changed '/bookings' to '/' to correctly resolve to /api/bookings
router.get('/', getBookings);
router.get('/:id', getBookingById);
// **FIXED:** Changed '/bookings' to '/' to correctly resolve to /api/bookings
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.patch('/:id/checkin', checkIn);
router.patch('/:id/checkout', checkOut);

module.exports = router;