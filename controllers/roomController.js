// controllers/roomController.js

const Room = require('../models/Room');

// Get all rooms (This is the function that is throwing the 500 error)
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    // 🛑 CRITICAL LOGGING: This line prints the actual database error to your server console.
    console.error("FATAL DATABASE ERROR in getRooms:", error.message);
    
    // Send a 500 response back to the client
    res.status(500).json({ 
      message: "Internal Server Error. Could not query the database.", 
      detail: "Check the server console for the specific database connection or query error."
    });
  }
};

// Get room by ID
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **NEW FUNCTION: Get all rooms where status is 'available'**
const getAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await Room.find({ status: 'available' });
    res.json(availableRooms);
  } catch (error) {
    console.error("DATABASE ERROR in getAvailableRooms:", error.message);
    res.status(500).json({ 
      message: "Internal Server Error. Could not query available rooms.", 
      detail: "Check server logs."
    });
  }
};

// Create new room
const createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Room number already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// Update room
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
    res.status(400).json({ message: error.message });
  }
};

// Delete room
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  // Export the new function
  getAvailableRooms
};