const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBookingsByGuest,  // ← ADD THIS
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  checkIn,
  checkOut
} = require('../controllers/bookingController');

router.get('/', getBookings);
router.get('/guest/:guestId', getBookingsByGuest);  // ← ADD THIS (MUST BE BEFORE /:id)
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.patch('/:id/checkin', checkIn);
router.patch('/:id/checkout', checkOut);

module.exports = router;