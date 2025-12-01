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

// Remove '/bookings' prefix - it's already in app.use('/api/bookings', ...)
router.get('/', getBookings);                    // Changed from '/bookings'
router.get('/:id', getBookingById);              // Changed from '/bookings/:id'
router.post('/', createBooking);                 // Changed from '/bookings'
router.put('/:id', updateBooking);               // Changed from '/bookings/:id'
router.delete('/:id', deleteBooking);            // Changed from '/bookings/:id'
router.patch('/:id/checkin', checkIn);           // Changed from '/bookings/:id/checkin'
router.patch('/:id/checkout', checkOut);         // Changed from '/bookings/:id/checkout'

module.exports = router;