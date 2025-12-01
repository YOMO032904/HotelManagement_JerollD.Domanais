// Add this AFTER getBookingById function
// Get bookings by guest ID
const getBookingsByGuest = async (req, res) => {
  try {
    const bookings = await Booking.find({ guestId: req.params.guestId })
      .populate('guestId')
      .populate('roomId');
    res.json(bookings);
  } catch (error) {
    console.error('Error in getBookingsByGuest:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookings,
  getBookingsByGuest,  // ← ADD THIS
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  checkIn,
  checkOut
};