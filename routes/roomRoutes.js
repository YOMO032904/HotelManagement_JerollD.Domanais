const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');

// Remove '/rooms' prefix - it's already in app.use('/api/rooms', ...)
router.get('/', getRooms);                    // Changed from '/rooms'
router.get('/:id', getRoomById);              // Changed from '/rooms/:id'
router.post('/', createRoom);                 // Changed from '/rooms'
router.put('/:id', updateRoom);               // Changed from '/rooms/:id'
router.delete('/:id', deleteRoom);            // Changed from '/rooms/:id'

module.exports = router;