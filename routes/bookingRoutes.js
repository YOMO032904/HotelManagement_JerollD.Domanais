const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBookingsByGuest,  // ← Add this
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  checkIn,
  checkOut
} = require('../controllers/bookingController');

router.get('/', getBookings);
router.get('/guest/:guestId', getBookingsByGuest);  // ← MUST be before '/:id'
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.patch('/:id/checkin', checkIn);
router.patch('/:id/checkout', checkOut);

module.exports = router;