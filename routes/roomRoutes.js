// routes/roomRoutes.js

const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');

// **FIXED:** Changed '/rooms' to '/' to correctly resolve to /api/rooms
router.get('/', getRooms); 
router.get('/:id', getRoomById);
// **FIXED:** Changed '/rooms' to '/' to correctly resolve to /api/rooms
router.post('/', createRoom); 
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;