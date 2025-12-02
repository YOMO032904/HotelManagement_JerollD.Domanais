// controllers/roomController.js

const Room = require('../models/Room');

// Get all rooms
// @route   GET /api/rooms
const getRooms = async (req, res) => {
  try {
    // This function remains simple, only fetching all rooms.
    // Filtering (like status) is handled by the dedicated getAvailableRooms function.
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error("DATABASE ERROR in getRooms:", error.message);
    res.status(500).json({ 
      message: "Internal Server Error. Could not query all rooms.", 
      detail: error.message
    });
  }
};

// Get room by ID
// @route   GET /api/rooms/:id
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    // 🛑 CRITICAL FIX for the "Cast to ObjectId failed" error (e.g., when 'available' is passed as ID)
    if (error.name === 'CastError') {
        // If Mongoose can't convert the ID string (like 'available') into a valid MongoDB ID, 
        // we treat it as if the resource was not found, returning 404.
        return res.status(404).json({ message: 'Invalid Room ID format or Room not found.' });
    }
    
    // Catch other unexpected server errors
    res.status(500).json({ message: 'Internal Server Error.', detail: error.message });
  }
};

// Get all rooms where status is 'available'
// @route   GET /api/rooms/available
const getAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await Room.find({ status: 'available' });
    res.json(availableRooms);
  } catch (error) {
    console.error("DATABASE ERROR in getAvailableRooms:", error.message);
    res.status(500).json({ 
      message: "Internal Server Error. Could not query available rooms.", 
      detail: error.message
    });
  }
};

// Check room availability by roomNumber
// @route   GET /api/rooms/check?roomNumber=100
const checkRoomAvailability = async (req, res) => {
  try {
    const { roomNumber } = req.query;
    if (!roomNumber) {
      return res.status(400).json({ message: 'roomNumber query parameter is required.' });
    }

    const rn = Number(roomNumber);
    if (Number.isNaN(rn) || rn < 1) {
      return res.status(400).json({ message: 'roomNumber must be a positive integer.' });
    }

    const existing = await Room.findOne({ roomNumber: rn });
    if (existing) {
      return res.status(200).json({ available: false, message: `Room number '${rn}' is already in use.` });
    }

    return res.status(200).json({ available: true, message: `Room number '${rn}' is available.` });
  } catch (error) {
    console.error('Error in checkRoomAvailability:', error);
    res.status(500).json({ message: 'Internal Server Error', detail: error.message });
  }
};

// Create new room
// @route   POST /api/rooms
const createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    console.error("API /api/rooms POST Error:", error);

    // --- 1. Duplicate Key Error (Unique Constraint Failure) ---
    if (error.code === 11000) {
      // 409 Conflict is the correct status for unique constraint violations
      return res.status(409).json({ 
        error: true,
        message: `⚠️ Error: Room number '${req.body.roomNumber}' is already in use.`
      });
    } 

    // --- 2. Mongoose Validation Error (Missing field, bad enum, bad type) ---
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      // 400 Bad Request is the correct status for invalid client data/payload
      return res.status(400).json({ 
          message: 'Validation Failed.',
          details: messages.join('; ') 
      });
    }

    // 500 Catch-all
    res.status(500).json({ message: 'Internal Server Error.', details: error.message });
  }
};

// Update room
// @route   PUT /api/rooms/:id
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error(`API /api/rooms/${req.params.id} PUT Error:`, error);
    
    // --- 1. Mongoose Validation Error ---
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
          message: 'Validation Failed.',
          details: messages.join('; ') 
      });
    }
    
    // --- 2. Duplicate Key Error when updating to an existing room number ---
    if (error.code === 11000) {
      return res.status(409).json({
        error: true,
        message: `⚠️ Error: Room number '${req.body.roomNumber}' is already in use.`
      });
    }
    
    // --- 2. Cast Error (Invalid ID used in PUT request URL) ---
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Invalid Room ID format or Room not found.' });
    }

    // 500 Catch-all
    res.status(500).json({ message: 'Internal Server Error.', details: error.message });
  }
};

// Delete room
// @route   DELETE /api/rooms/:id
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    // Add CastError check for safety
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Invalid Room ID format or Room not found.' });
    }
    res.status(500).json({ message: 'Internal Server Error.', detail: error.message });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getAvailableRooms
};