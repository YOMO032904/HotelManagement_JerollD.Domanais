const Room = require('../models/Room');



// Get all rooms

const getRooms = async (req, res) => {

  try {

    const rooms = await Room.find();

    res.json(rooms);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



// Get available rooms (UPDATED to use 'status')

const getAvailableRooms = async (req, res) => {

  try {

    const rooms = await Room.find({ status: 'available' });  // ← Changed to match your model

    res.json(rooms);

  } catch (error) {

    res.status(500).json({ message: error.message });

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

  getAvailableRooms,

  getRoomById,

  createRoom,

  updateRoom,

  deleteRoom

};



here is my roomRoutes.js

const express = require('express');

const router = express.Router();

const {

  getRooms,

  getAvailableRooms,  // ← Add this

  getRoomById,

  createRoom,

  updateRoom,

  deleteRoom

} = require('../controllers/roomController');



router.get('/', getRooms);

router.get('/available', getAvailableRooms);  // ← MUST be before '/:id'

router.get('/:id', getRoomById);

router.post('/', createRoom);

router.put('/:id', updateRoom);

router.delete('/:id', deleteRoom);



module.exports = router;