const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');

// --- READ OPERATIONS ---

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

// --- CREATE OPERATION ---

// Create new booking
const createBooking = async (req, res) => {
  try {
    const { guestId, roomId, checkIn, checkOut } = req.body;

    // Convert dates to Date objects for robust comparison and calculation
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // 1. ✅ VALIDATION: Check for invalid date strings and require values.
    // Combining the check for undefined/null with the isNaN check.
    if (!checkIn || !checkOut || isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return res.status(400).json({ 
            message: 'Check-in and Check-out dates are required and must be in a valid format.' 
        });
    }

    // 2. VALIDATION: Check if Check-out is after Check-in
    if (checkOutDate <= checkInDate) {
        return res.status(400).json({ 
            message: 'Check-out date must be strictly after the Check-in date.' 
        });
    }

    // 3. Check if guest exists
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    // 4. Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // 5. Check for static room unavailability (e.g., Maintenance)
    if (room.status === 'maintenance') {
      return res.status(400).json({ message: 'Room is under maintenance and cannot be booked.' });
    }
    
    // 6. Temporal Availability Check: Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
        roomId,
        // Only check active bookings
        status: { $in: ['confirmed', 'checked-in'] }, 
        // Overlap condition: (StartA < EndB) AND (EndA > StartB)
        checkIn: { $lt: checkOutDate }, 
        checkOut: { $gt: checkInDate } 
    });
    // 

    if (overlappingBooking) {
      return res.status(400).json({ 
        message: 'Room is not available for the requested dates. It overlaps with an existing booking.',
        overlappingBookingId: overlappingBooking._id 
      });
    }

    // 7. Calculate total amount based on number of days
    const msPerDay = 1000 * 60 * 60 * 24;
    // Math.ceil ensures at least 1 day is charged even if check-in/out is close
    const days = Math.ceil((checkOutDate - checkInDate) / msPerDay);
    const totalAmount = days * room.price;

    const booking = new Booking({
      ...req.body,
      totalAmount
    });

    const savedBooking = await booking.save();

    res.status(201).json(await savedBooking.populate(['guestId', 'roomId']));
  } catch (error) {
    // Catch Mongoose validation or other specific errors
    if (error.name === 'ValidationError') {
        res.status(400).json({ message: `Mongoose Validation Error: ${error.message}` });
    } else {
        // Fallback for general errors
        res.status(400).json({ message: error.message });
    }
  }
};

// --- UPDATE/DELETE/STATUS OPERATIONS ---

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

    // Free up the room ONLY IF the booking status was confirmed or checked-in
    if (['confirmed', 'checked-in'].includes(booking.status)) {
        await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });
    }
    
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

    // Update room status to occupied
    await Room.findByIdAndUpdate(booking.roomId, { status: 'occupied' });

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
      return res.status(404).json({ message: 'Booking not found' }); 
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