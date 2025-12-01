const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');

// Get all bookings with populated data
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('guestId')
      .populate('roomId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('guestId')
      .populate('roomId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new booking
const createBooking = async (req, res) => {
  try {
    const { guestId, roomId, checkIn, checkOut } = req.body;

    // Check if guest exists
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    // Check if room exists and is available
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (room.status !== 'available') {
      return res.status(400).json({ message: 'Room is not available' });
    }

    // Calculate total amount based on number of days
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalAmount = days * room.price;

    const booking = new Booking({
      ...req.body,
      totalAmount
    });

    const savedBooking = await booking.save();

    // Update room status to occupied
    await Room.findByIdAndUpdate(roomId, { status: 'occupied' });

    res.status(201).json(await savedBooking.populate(['guestId', 'roomId']));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update booking
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(['guestId', 'roomId']);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Free up the room when booking is deleted
    await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check-in booking
const checkIn = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'checked-in' },
      { new: true }
    ).populate(['guestId', 'roomId']);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Check-out booking
const checkOut = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'checked-out' },
      { new: true }
    ).populate(['guestId', 'roomId']);
    
    if (!booking) {
      return res.status(404).json({ message: 'Occupied' });
    }

    // Free up the room
    await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  checkIn,
  checkOut
};