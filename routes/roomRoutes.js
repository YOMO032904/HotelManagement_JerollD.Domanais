// routes/roomRoutes.js

const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getAvailableRooms // <-- 1. Import the new controller
} = require('../controllers/roomController');

// **NEW ROUTE:** GET /api/rooms/available
// Place this BEFORE /:id to prevent 'available' from being treated as an ID.
router.get('/available', getAvailableRooms); 

// **FIXED:** Changed '/rooms' to '/' to correctly resolve to /api/rooms
router.get('/', getRooms); 
router.get('/:id', getRoomById); // This is now AFTER /available
// **FIXED:** Changed '/rooms' to '/' to correctly resolve to /api/rooms
router.post('/', createRoom); 
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;