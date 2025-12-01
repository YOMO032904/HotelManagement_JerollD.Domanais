// controllers/roomController.js

const Room = require('../models/Room');

// Get all rooms (This is the function that is throwing the 500 error)
const getRooms = async (req, res) => {
  try {
    // The client message suggests they might be looking for only available rooms. 
    // It's possible the client endpoint is requesting a query parameter like ?status=available.
    // However, we'll stick to Room.find() for now as that's what's in your code.
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    // 🛑 CRITICAL LOGGING: Print the actual Mongoose/DB error to your server console
    console.error("FATAL DATABASE ERROR in getRooms:", error.message);
    
    // Send a 500 response back to the client with a general message
    res.status(500).json({ 
      message: "Internal Server Error. Could not connect to or query the database.", 
      // Include the error detail here, but for security, usually only log this on the server:
      // detail: error.message 
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
  deleteRoom
};